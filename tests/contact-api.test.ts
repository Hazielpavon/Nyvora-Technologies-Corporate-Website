// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/contact-email", () => {
  class ContactEmailConfigurationError extends Error {}
  return {
    ContactEmailConfigurationError,
    sendContactEmail: vi.fn(),
  };
});

import { POST } from "@/app/api/contact/route";
import {
  ContactEmailConfigurationError,
  sendContactEmail,
} from "@/lib/contact-email";

const origin = "https://nyvoratechnologies.com";
const validInput = {
  name: "Persona de prueba",
  organization: "Institución de ejemplo",
  email: "persona@example.org",
  reason: "myke",
  message: "Queremos conocer más sobre Myke para nuestra institución.",
  consent: true,
  website: "",
};

function contactRequest(
  body: unknown,
  headers: Record<string, string> = {},
) {
  return new Request(`${origin}/api/contact`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

afterEach(() => {
  vi.mocked(sendContactEmail).mockReset();
});

describe("POST /api/contact", () => {
  it.each(["myke", "support", "privacy", "legal"])(
    "accepts a valid %s inquiry without accepting a client recipient",
    async (reason) => {
      const response = await POST(contactRequest({
        ...validInput,
        reason,
        recipient: "attacker@example.org",
      }));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
      expect(sendContactEmail).toHaveBeenCalledTimes(1);
      const submission = vi.mocked(sendContactEmail).mock.calls[0][0];
      expect(submission.reason).toBe(reason);
      expect(submission).not.toHaveProperty("recipient");
    },
  );

  it("rejects malformed input without invoking delivery", async () => {
    const response = await POST(contactRequest({
      ...validInput,
      email: "persona,otra@example.org",
      consent: false,
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.code).toBe("validation_error");
    expect(body.fieldErrors).toMatchObject({ email: expect.any(String), consent: expect.any(String) });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects unsupported content types, origins, oversized bodies and malformed JSON", async () => {
    const unsupported = await POST(contactRequest(validInput, { "Content-Type": "text/plain" }));
    expect(unsupported.status).toBe(415);

    const foreign = await POST(contactRequest(validInput, { Origin: "https://example.org" }));
    expect(foreign.status).toBe(403);

    const oversized = await POST(contactRequest({ ...validInput, message: "x".repeat(13_000) }));
    expect(oversized.status).toBe(413);

    const malformed = await POST(contactRequest("{"));
    expect(malformed.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("silently accepts the honeypot without sending email", async () => {
    const response = await POST(contactRequest({ ...validInput, website: "https://spam.example" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns an honest unavailable state when SMTP is not configured", async () => {
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new ContactEmailConfigurationError());
    const response = await POST(contactRequest(validInput));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, code: "delivery_unavailable" });
  });

  it("does not leak provider errors", async () => {
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new Error("sensitive SMTP detail"));
    const response = await POST(contactRequest(validInput));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, code: "delivery_failed" });
  });
});
