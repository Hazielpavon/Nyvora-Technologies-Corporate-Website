import { randomBytes } from "node:crypto";
import { Resend } from "resend";
import {
  getContactReason,
  getContactRecipient,
  type ContactSubmission,
} from "@/lib/contact";

export class ContactEmailConfigurationError extends Error {
  constructor() {
    super("Contact email delivery is not configured.");
    this.name = "ContactEmailConfigurationError";
  }
}

const domainPattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

function getResendConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim().toLowerCase();

  if (!apiKey || !domain || !domainPattern.test(domain)) {
    throw new ContactEmailConfigurationError();
  }

  return { apiKey, domain };
}

function createInquiryReference() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function sendContactEmail(submission: ContactSubmission) {
  const configuration = getResendConfiguration();
  const reason = getContactReason(submission.reason);
  const recipient = getContactRecipient(submission.reason);
  const reference = createInquiryReference();
  const resend = new Resend(configuration.apiKey);
  const { data, error } = await resend.emails.send({
    from: `Nyvora Website <website@${configuration.domain}>`,
    to: recipient,
    replyTo: submission.email,
    subject: `[Nyvora ${reference}] ${reason.label}`,
    text: [
      "Nueva consulta desde nyvoratechnologies.com",
      `Referencia: ${reference}`,
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

  if (error || !data?.id) {
    throw new Error("Contact email delivery failed.");
  }
}
