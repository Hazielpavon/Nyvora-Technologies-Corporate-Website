// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("nodemailer", () => ({
  default: { createTransport: vi.fn() },
}));

import nodemailer from "nodemailer";
import {
  ContactEmailConfigurationError,
  sendContactEmail,
} from "@/lib/contact-email";

const originalEnvironment = { ...process.env };
const sendMail = vi.fn();

beforeEach(() => {
  process.env.SMTP_HOST = "smtp.gmail.com";
  process.env.SMTP_PORT = "465";
  process.env.SMTP_SECURE = "true";
  process.env.SMTP_USER = "workspace-user@nyvoratechnologies.com";
  process.env.SMTP_PASSWORD = "test-app-password";
  process.env.SMTP_FROM_ADDRESS = "contact@nyvoratechnologies.com";
  process.env.SMTP_FROM_NAME = "Nyvora Technologies";
  sendMail.mockReset();
  vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.mocked(nodemailer.createTransport).mockReset();
});

describe("contact email delivery", () => {
  it("uses fixed SMTP identity, approved recipient and visitor reply-to", async () => {
    await sendContactEmail({
      name: "Persona de prueba",
      organization: "Institución de ejemplo",
      email: "persona@example.org",
      reason: "support",
      message: "Necesitamos asistencia con un servicio de Nyvora.",
      consent: true,
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: false,
    }));
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: { name: "Nyvora Technologies", address: "contact@nyvoratechnologies.com" },
      to: "support@nyvoratechnologies.com",
      replyTo: { address: "persona@example.org" },
      subject: "[Nyvora.com] Soporte",
    }));
  });

  it("fails explicitly when server credentials are missing", async () => {
    delete process.env.SMTP_PASSWORD;

    await expect(sendContactEmail({
      name: "Persona de prueba",
      organization: "Institución de ejemplo",
      email: "persona@example.org",
      reason: "myke",
      message: "Queremos recibir información adicional sobre Myke.",
      consent: true,
    })).rejects.toBeInstanceOf(ContactEmailConfigurationError);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it("requires STARTTLS when configured for port 587", async () => {
    process.env.SMTP_PORT = "587";
    process.env.SMTP_SECURE = "false";

    await sendContactEmail({
      name: "Persona de prueba",
      organization: "Institución de ejemplo",
      email: "persona@example.org",
      reason: "myke",
      message: "Queremos recibir información adicional sobre Myke.",
      consent: true,
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
      port: 587,
      secure: false,
      requireTLS: true,
    }));
  });

  it("rejects ambiguous SMTP identities", async () => {
    process.env.SMTP_FROM_ADDRESS = "contact,other@nyvoratechnologies.com";

    await expect(sendContactEmail({
      name: "Persona de prueba",
      organization: "Institución de ejemplo",
      email: "persona@example.org",
      reason: "myke",
      message: "Queremos recibir información adicional sobre Myke.",
      consent: true,
    })).rejects.toBeInstanceOf(ContactEmailConfigurationError);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
});
