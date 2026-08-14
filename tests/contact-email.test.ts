// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("resend", () => ({
  Resend: vi.fn(),
}));

import { Resend } from "resend";
import {
  ContactEmailConfigurationError,
  sendContactEmail,
} from "@/lib/contact-email";

const originalEnvironment = { ...process.env };
const send = vi.fn();

const submission = {
  name: "Persona de prueba",
  organization: "Institución de ejemplo",
  email: "persona@example.org",
  reason: "support" as const,
  message: "Necesitamos asistencia con un servicio de Nyvora.",
  consent: true as const,
};

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-api-key";
  process.env.RESEND_EMAIL_DOMAIN = "nyvoratechnologies.com";
  send.mockReset();
  send.mockResolvedValue({ data: { id: "email_test_id" }, error: null });
  vi.mocked(Resend).mockImplementation(function ResendMock() {
    return { emails: { send } } as never;
  });
});

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.mocked(Resend).mockReset();
});

describe("contact email delivery", () => {
  it("uses the Resend key, verified-domain sender, approved recipient and visitor reply-to", async () => {
    await sendContactEmail(submission);

    expect(Resend).toHaveBeenCalledWith("test-api-key");
    expect(send).toHaveBeenCalledTimes(1);
    const message = send.mock.calls[0][0];
    expect(message).toMatchObject({
      from: "Nyvora Website <website@nyvoratechnologies.com>",
      to: "support@nyvoratechnologies.com",
      replyTo: "persona@example.org",
    });
    expect(message.subject).toMatch(/^\[Nyvora [A-F0-9]{8}\] Soporte$/);
    const reference = message.subject.match(/[A-F0-9]{8}/)?.[0];
    expect(reference).toBeTruthy();
    expect(message.text).toContain(`Referencia: ${reference}`);
    expect(message.text).toContain("Organización: Institución de ejemplo");
  });

  it("generates a distinct subject reference for each inquiry", async () => {
    await sendContactEmail(submission);
    await sendContactEmail(submission);

    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][0].subject).not.toBe(send.mock.calls[1][0].subject);
  });

  it.each(["RESEND_API_KEY", "RESEND_EMAIL_DOMAIN"] as const)(
    "fails explicitly when %s is missing",
    async (variable) => {
      delete process.env[variable];

      await expect(sendContactEmail(submission)).rejects.toBeInstanceOf(
        ContactEmailConfigurationError,
      );
      expect(Resend).not.toHaveBeenCalled();
    },
  );

  it("rejects an invalid sending domain before calling Resend", async () => {
    process.env.RESEND_EMAIL_DOMAIN = "https://nyvoratechnologies.com";

    await expect(sendContactEmail(submission)).rejects.toBeInstanceOf(
      ContactEmailConfigurationError,
    );
    expect(Resend).not.toHaveBeenCalled();
  });

  it("fails when Resend rejects the request without exposing provider details", async () => {
    send.mockResolvedValueOnce({
      data: null,
      error: {
        name: "validation_error",
        message: "sensitive provider detail",
        statusCode: 422,
      },
    });

    await expect(sendContactEmail(submission)).rejects.toThrow(
      "Contact email delivery failed.",
    );
  });
});
