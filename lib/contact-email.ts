import nodemailer from "nodemailer";
import {
  getContactReason,
  getContactRecipient,
  isValidEmailAddress,
  type ContactSubmission,
} from "@/lib/contact";

export class ContactEmailConfigurationError extends Error {
  constructor() {
    super("Contact email delivery is not configured.");
    this.name = "ContactEmailConfigurationError";
  }
}

function getSmtpConfiguration() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  const fromAddress = process.env.SMTP_FROM_ADDRESS?.trim();
  const fromName = process.env.SMTP_FROM_NAME?.trim() || "Nyvora Technologies";
  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureValue ? secureValue === "true" : port === 465;

  if (
    !host ||
    /\s/.test(host) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !user ||
    !isValidEmailAddress(user) ||
    !password ||
    !fromAddress ||
    !isValidEmailAddress(fromAddress) ||
    (secureValue !== undefined && secureValue !== "true" && secureValue !== "false") ||
    fromName.length > 100 ||
    /[\r\n]/.test(fromName)
  ) {
    throw new ContactEmailConfigurationError();
  }

  return {
    host,
    port,
    secure,
    user,
    password,
    fromAddress,
    fromName,
  };
}

export async function sendContactEmail(submission: ContactSubmission) {
  const configuration = getSmtpConfiguration();
  const reason = getContactReason(submission.reason);
  const recipient = getContactRecipient(submission.reason);
  const transporter = nodemailer.createTransport({
    host: configuration.host,
    port: configuration.port,
    secure: configuration.secure,
    requireTLS: !configuration.secure,
    auth: {
      user: configuration.user,
      pass: configuration.password,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  await transporter.sendMail({
    from: {
      name: configuration.fromName,
      address: configuration.fromAddress,
    },
    to: recipient,
    replyTo: { address: submission.email },
    subject: `[Nyvora.com] ${reason.label}`,
    text: [
      "Nueva consulta desde nyvoratechnologies.com",
      "",
      `Motivo: ${reason.label}`,
      `Nombre: ${submission.name}`,
      `Organización: ${submission.organization}`,
      `Correo de respuesta: ${submission.email}`,
      "",
      "Mensaje:",
      submission.message,
    ].join("\n"),
  });
}
