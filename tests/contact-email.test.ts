// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  CONTACT_DELIVERY_TIMEOUT_MS,
  ContactEmailConfigurationError,
  ContactEmailDeliveryError,
  ContactEmailTimeoutError,
  sendContactEmail,
} from "@/lib/contact-email";
import type { ContactReason, ContactSubmission } from "@/lib/contact";

const originalEnvironment = { ...process.env };
const fetchMock = vi.fn();

const submission: ContactSubmission = {
  name: "Persona de prueba",
  organization: "Institución de ejemplo",
  email: "persona@example.org",
  reason: "support",
  subject: "Ayuda con un servicio de Nyvora",
  message: "Necesitamos asistencia con un servicio de Nyvora.",
  consent: true,
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  startedAt: Date.parse("2026-08-21T11:59:58.000Z"),
};

function successResponse() {
  return new Response(JSON.stringify({ id: "email_test_id" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function getRequest() {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
  return {
    url,
    options,
    headers: options.headers as Record<string, string>,
    body: JSON.parse(String(options.body)) as Record<string, unknown>,
  };
}

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-api-key";
  process.env.RESEND_EMAIL_DOMAIN = "nyvoratechnologies.com";
  fetchMock.mockReset();
  fetchMock.mockImplementation(() => Promise.resolve(successResponse()));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("contact email delivery", () => {
  it.each<[ContactReason, string]>([
    ["nyvora", "contact@nyvoratechnologies.com"],
    ["myke", "contact@nyvoratechnologies.com"],
    ["commercial", "contact@nyvoratechnologies.com"],
    ["alliances", "contact@nyvoratechnologies.com"],
    ["support", "support@nyvoratechnologies.com"],
    ["privacy", "privacy@nyvoratechnologies.com"],
    ["legal", "legal@nyvoratechnologies.com"],
    ["other", "contact@nyvoratechnologies.com"],
  ])("derives the %s recipient on the server", async (reason, recipient) => {
    await sendContactEmail({ ...submission, reason });

    const { url, options, headers, body } = getRequest();
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.method).toBe("POST");
    expect(options.cache).toBe("no-store");
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(headers.Authorization).toMatch(/^Bearer /);
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["Idempotency-Key"]).toBe(
      `contact/${submission.submissionId}`,
    );
    expect(body).toMatchObject({
      from: "Nyvora Website <website@nyvoratechnologies.com>",
      to: [recipient],
      reply_to: "persona@example.org",
    });
    expect(body.subject).toMatch(
      /^\[Nyvora [A-F0-9]{8}\] .+: Ayuda con un servicio de Nyvora$/,
    );
    expect(body.text).toContain("Asunto: Ayuda con un servicio de Nyvora");
    expect(body.html).toContain("<html lang=\"es\">");
  });

  it("escapes every user value in HTML and preserves a text version", async () => {
    await sendContactEmail({
      ...submission,
      name: "<Persona & compañía>",
      organization: 'Organización "Uno"',
      subject: "Consulta <urgente> & seguimiento",
      message: "Primera línea <script>alert('x')</script>\nSegunda & final.",
    });

    const { body } = getRequest();
    const html = String(body.html);
    const text = String(body.text);
    expect(html).toContain("&lt;Persona &amp; compañía&gt;");
    expect(html).toContain("Organización &quot;Uno&quot;");
    expect(html).toContain("Consulta &lt;urgente&gt; &amp; seguimiento");
    expect(html).toContain(
      "&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;<br />Segunda &amp; final.",
    );
    expect(html).not.toContain("<script>");
    expect(text).toContain("Primera línea <script>alert('x')</script>\nSegunda & final.");
  });

  it("generates a distinct safe reference for each inquiry", async () => {
    await sendContactEmail(submission);
    await sendContactEmail({
      ...submission,
      submissionId: "b6a1c0e2-4f8e-4db1-b41e-9a0a4c3d7f10",
    });

    const first = JSON.parse(String(fetchMock.mock.calls[0][1].body));
    const second = JSON.parse(String(fetchMock.mock.calls[1][1].body));
    expect(first.subject).not.toBe(second.subject);
  });

  it("keeps the idempotency key and complete payload stable for a retry", async () => {
    await sendContactEmail(submission);
    await sendContactEmail(submission);

    const firstOptions = fetchMock.mock.calls[0][1] as RequestInit;
    const secondOptions = fetchMock.mock.calls[1][1] as RequestInit;
    expect(firstOptions.headers).toEqual(secondOptions.headers);
    expect(firstOptions.body).toBe(secondOptions.body);
  });

  it.each(["RESEND_API_KEY", "RESEND_EMAIL_DOMAIN"] as const)(
    "fails explicitly when %s is missing",
    async (variable) => {
      delete process.env[variable];

      await expect(sendContactEmail(submission)).rejects.toBeInstanceOf(
        ContactEmailConfigurationError,
      );
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("rejects an invalid sending domain before contacting Resend", async () => {
    process.env.RESEND_EMAIL_DOMAIN = "https://nyvoratechnologies.com";

    await expect(sendContactEmail(submission)).rejects.toBeInstanceOf(
      ContactEmailConfigurationError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps provider, network and malformed responses to one generic error", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchMock
      .mockResolvedValueOnce(new Response("sensitive provider detail", { status: 422 }))
      .mockRejectedValueOnce(new Error("sensitive network detail"))
      .mockResolvedValueOnce(new Response("not-json", { status: 200 }));

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await expect(sendContactEmail({
        ...submission,
        submissionId: `550e8400-e29b-41d4-a71${attempt}-446655440000`,
      })).rejects.toEqual(new ContactEmailDeliveryError());
    }
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("aborts a stalled provider request after the delivery timeout", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementationOnce((_url: string, options: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        options.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      }),
    );

    const delivery = sendContactEmail(submission);
    const assertion = expect(delivery).rejects.toBeInstanceOf(
      ContactEmailTimeoutError,
    );
    await vi.advanceTimersByTimeAsync(CONTACT_DELIVERY_TIMEOUT_MS);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
});
