import "server-only";

import {
  getContactReason,
  getContactRecipient,
  type ContactSubmission,
} from "@/lib/contact";

export const CONTACT_DELIVERY_TIMEOUT_MS = 8_000;

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const domainPattern =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export class ContactEmailConfigurationError extends Error {
  constructor() {
    super("Contact email delivery is not configured.");
    this.name = "ContactEmailConfigurationError";
  }
}

export class ContactEmailTimeoutError extends Error {
  constructor() {
    super("Contact email delivery timed out.");
    this.name = "ContactEmailTimeoutError";
  }
}

export class ContactEmailDeliveryError extends Error {
  constructor() {
    super("Contact email delivery failed.");
    this.name = "ContactEmailDeliveryError";
  }
}

function getResendConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim().toLowerCase();

  if (!apiKey || !domain || !domainPattern.test(domain)) {
    throw new ContactEmailConfigurationError();
  }

  return { apiKey, domain };
}

function createInquiryReference(submissionId: string) {
  return submissionId.replaceAll("-", "").slice(0, 8).toUpperCase();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createEmailContent(submission: ContactSubmission, reference: string) {
  const reason = getContactReason(submission.reason);
  const text = [
    "Nueva consulta desde nyvoratechnologies.com",
    `Referencia: ${reference}`,
    "",
    `Motivo: ${reason.label}`,
    `Asunto: ${submission.subject}`,
    `Nombre: ${submission.name}`,
    `Organización: ${submission.organization}`,
    `Correo de respuesta: ${submission.email}`,
    "",
    "Mensaje:",
    submission.message,
  ].join("\n");

  const messageHtml = escapeHtml(submission.message).replace(
    /\r\n|\r|\n/gu,
    "<br />",
  );
  const html = `<!doctype html>
<html lang="es">
  <body>
    <h1>Nueva consulta desde nyvoratechnologies.com</h1>
    <p><strong>Referencia:</strong> ${escapeHtml(reference)}</p>
    <dl>
      <dt>Motivo</dt><dd>${escapeHtml(reason.label)}</dd>
      <dt>Asunto</dt><dd>${escapeHtml(submission.subject)}</dd>
      <dt>Nombre</dt><dd>${escapeHtml(submission.name)}</dd>
      <dt>Organización</dt><dd>${escapeHtml(submission.organization)}</dd>
      <dt>Correo de respuesta</dt><dd>${escapeHtml(submission.email)}</dd>
    </dl>
    <h2>Mensaje</h2>
    <p>${messageHtml}</p>
  </body>
</html>`;

  return {
    reason,
    text,
    html,
  };
}

export async function sendContactEmail(submission: ContactSubmission) {
  const configuration = getResendConfiguration();
  const recipient = getContactRecipient(submission.reason);
  const reference = createInquiryReference(submission.submissionId);
  const { reason, text, html } = createEmailContent(submission, reference);
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    CONTACT_DELIVERY_TIMEOUT_MS,
  );

  try {
    const response = await fetch(RESEND_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configuration.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `contact/${submission.submissionId}`,
      },
      body: JSON.stringify({
        from: `Nyvora Website <website@${configuration.domain}>`,
        to: [recipient],
        reply_to: submission.email,
        subject: `[Nyvora ${reference}] ${reason.label}: ${submission.subject}`,
        text,
        html,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ContactEmailDeliveryError();
    }

    const result = await response.json().catch(() => null) as
      | { id?: unknown }
      | null;
    if (typeof result?.id !== "string" || result.id.length === 0) {
      throw new ContactEmailDeliveryError();
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ContactEmailTimeoutError();
    }
    if (error instanceof ContactEmailDeliveryError) {
      throw error;
    }
    throw new ContactEmailDeliveryError();
  } finally {
    clearTimeout(timeout);
  }
}
