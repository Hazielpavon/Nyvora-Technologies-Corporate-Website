// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/contact-email", () => {
  class ContactEmailConfigurationError extends Error {}
  class ContactEmailTimeoutError extends Error {}
  return {
    ContactEmailConfigurationError,
    ContactEmailTimeoutError,
    sendContactEmail: vi.fn(),
  };
});

import { POST } from "@/app/api/contact/route";
import {
  ContactEmailConfigurationError,
  ContactEmailTimeoutError,
  sendContactEmail,
} from "@/lib/contact-email";

const origin = "https://nyvoratechnologies.com";
const now = Date.parse("2026-08-21T12:00:00.000Z");
const validInput = {
  name: "Persona de prueba",
  organization: "Institución de ejemplo",
  email: "persona@example.org",
  reason: "myke",
  subject: "Consulta institucional sobre Myke",
  message: "Queremos conocer más sobre Myke para nuestra institución.",
  consent: true,
  website: "",
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  startedAt: now - 2_000,
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

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.mocked(sendContactEmail).mockReset();
  vi.useRealTimers();
});

describe("POST /api/contact", () => {
  it.each(["nyvora", "myke", "commercial", "alliances", "support", "privacy", "legal", "other"])(
    "accepts a valid %s inquiry",
    async (reason) => {
      const response = await POST(contactRequest({ ...validInput, reason }));

      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(await response.json()).toEqual({ ok: true });
      expect(sendContactEmail).toHaveBeenCalledTimes(1);
      expect(vi.mocked(sendContactEmail).mock.calls[0][0].reason).toBe(reason);
    },
  );

  it("derives a safe submission and ignores arbitrary delivery fields", async () => {
    const response = await POST(contactRequest({
      ...validInput,
      recipient: "attacker@example.org",
      to: "attacker@example.org",
      from: "attacker@example.org",
      replyTo: "attacker@example.org",
      apiKey: "not-a-real-secret",
    }));

    expect(response.status).toBe(200);
    const submission = vi.mocked(sendContactEmail).mock.calls[0][0];
    expect(submission).toMatchObject({
      email: validInput.email,
      reason: validInput.reason,
      subject: validInput.subject,
      submissionId: validInput.submissionId,
    });
    expect(submission).not.toHaveProperty("recipient");
    expect(submission).not.toHaveProperty("to");
    expect(submission).not.toHaveProperty("from");
    expect(submission).not.toHaveProperty("replyTo");
    expect(submission).not.toHaveProperty("apiKey");
  });

  it.each([
    ["name", "x", "name"],
    ["name", "x".repeat(101), "name"],
    ["organization", "x", "organization"],
    ["organization", "x".repeat(121), "organization"],
    ["email", "person,other@example.org", "email"],
    ["reason", "bank", "reason"],
    ["subject", "abc", "subject"],
    ["subject", "x".repeat(121), "subject"],
    ["message", "x".repeat(19), "message"],
    ["message", "x".repeat(2001), "message"],
    ["consent", false, "consent"],
  ])("rejects an invalid %s boundary", async (field, value, expectedField) => {
    const response = await POST(contactRequest({
      ...validInput,
      [field]: value,
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body.code).toBe("validation_error");
    expect(body.fieldErrors).toHaveProperty(String(expectedField));
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["name", "Persona\tPrueba", "name"],
    ["organization", "Institución\u0085Prueba", "organization"],
    ["email", "persona\n@example.org", "email"],
    ["subject", "Asunto\r\nBcc: attacker@example.org", "subject"],
    ["message", "Mensaje válido con una alerta\u000boculta.", "message"],
  ])("rejects control characters in %s", async (field, value, expectedField) => {
    const response = await POST(contactRequest({
      ...validInput,
      [field]: value,
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.fieldErrors).toHaveProperty(String(expectedField));
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("allows tabs and line breaks in the multiline message", async () => {
    const response = await POST(contactRequest({
      ...validInput,
      message: "Primera línea con contexto.\r\n\tSegunda línea con más información.",
    }));

    expect(response.status).toBe(200);
    expect(sendContactEmail).toHaveBeenCalledTimes(1);
  });

  it("requires valid hidden identity fields and reasonable elapsed time", async () => {
    const invalidCases = [
      { submissionId: "not-a-uuid" },
      { startedAt: now - 1_499 },
      { startedAt: now - (24 * 60 * 60 * 1_000 + 1) },
      { startedAt: now + 1 },
    ];

    for (const invalid of invalidCases) {
      const response = await POST(contactRequest({ ...validInput, ...invalid }));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        ok: false,
        code: "invalid_submission",
      });
    }
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("silently accepts a filled honeypot before validating hidden fields", async () => {
    const response = await POST(contactRequest({ website: "https://spam.example" }));

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: true });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("accepts JSON charset parameters and rejects lookalike media types", async () => {
    const accepted = await POST(contactRequest(validInput, {
      "Content-Type": "application/json; charset=utf-8",
    }));
    expect(accepted.status).toBe(200);

    vi.mocked(sendContactEmail).mockClear();
    const rejected = await POST(contactRequest(validInput, {
      "Content-Type": "application/jsonp",
    }));
    expect(rejected.status).toBe(415);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects missing or foreign origins", async () => {
    const missing = await POST(contactRequest(validInput, { Origin: "" }));
    const foreign = await POST(contactRequest(validInput, {
      Origin: "https://example.org",
    }));

    expect(missing.status).toBe(403);
    expect(foreign.status).toBe(403);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON and UTF-8 bodies larger than 12 KB", async () => {
    const malformed = await POST(contactRequest("{"));
    expect(malformed.status).toBe(400);

    const oversized = await POST(contactRequest({
      ...validInput,
      padding: "á".repeat(6_100),
    }));
    expect(oversized.status).toBe(413);
    expect(oversized.headers.get("cache-control")).toBe("no-store");
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns generic configuration, timeout and provider failures", async () => {
    vi.mocked(sendContactEmail)
      .mockRejectedValueOnce(new ContactEmailConfigurationError())
      .mockRejectedValueOnce(new ContactEmailTimeoutError())
      .mockRejectedValueOnce(new Error("sensitive provider detail"));

    const unavailable = await POST(contactRequest(validInput));
    expect(unavailable.status).toBe(503);
    expect(await unavailable.json()).toEqual({
      ok: false,
      code: "delivery_unavailable",
    });

    const timeout = await POST(contactRequest(validInput));
    expect(timeout.status).toBe(504);
    expect(await timeout.json()).toEqual({
      ok: false,
      code: "delivery_timeout",
    });

    const failed = await POST(contactRequest(validInput));
    expect(failed.status).toBe(502);
    const failedBody = await failed.text();
    expect(failedBody).toBe('{"ok":false,"code":"delivery_failed"}');
    expect(failedBody).not.toContain("sensitive provider detail");
    expect(failedBody).not.toContain("RESEND_API_KEY");
  });
});
