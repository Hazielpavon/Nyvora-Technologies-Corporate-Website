import { SITE } from "@/lib/site";

export const contactReasons = [
  { value: "nyvora", label: "Información sobre Nyvora", channel: "contact" },
  { value: "myke", label: "Información sobre Myke", channel: "contact" },
  { value: "commercial", label: "Oportunidades comerciales", channel: "contact" },
  { value: "alliances", label: "Alianzas", channel: "contact" },
  { value: "support", label: "Soporte", channel: "support" },
  { value: "privacy", label: "Privacidad", channel: "privacy" },
  { value: "legal", label: "Asuntos legales", channel: "legal" },
  { value: "other", label: "Otro", channel: "contact" },
] as const;

export const contactFields = [
  "name",
  "organization",
  "email",
  "reason",
  "subject",
  "message",
  "consent",
] as const;

export const CONTACT_MIN_FILL_TIME_MS = 1_500;
export const CONTACT_MAX_FILL_TIME_MS = 24 * 60 * 60 * 1_000;

export type ContactReason = (typeof contactReasons)[number]["value"];
export type ContactFieldName = (typeof contactFields)[number];
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export type ContactSubmission = {
  name: string;
  organization: string;
  email: string;
  reason: ContactReason;
  subject: string;
  message: string;
  consent: true;
  submissionId: string;
  startedAt: number;
};

export type ContactRequestData = ContactSubmission & {
  website: string;
};

type ContactValidationResult =
  | { ok: true; data: ContactRequestData }
  | {
      ok: false;
      code: "validation_error" | "invalid_submission";
      fieldErrors: ContactFieldErrors;
    };

type ContactValidationOptions = {
  enforceTiming?: boolean;
  now?: number;
};

const submissionIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function hasControlCharacter(value: string, allowMultilineWhitespace = false) {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    if (allowMultilineWhitespace && (code === 9 || code === 10 || code === 13)) {
      return false;
    }
    return code <= 31 || (code >= 127 && code <= 159);
  });
}

export function isContactReason(value: string): value is ContactReason {
  return contactReasons.some((reason) => reason.value === value);
}

export function getContactReason(reason: ContactReason) {
  return contactReasons.find((item) => item.value === reason)!;
}

export function getContactRecipient(reason: ContactReason) {
  return SITE.emails[getContactReason(reason).channel];
}

export function isValidEmailAddress(value: string) {
  if (
    value.length > 254 ||
    /[\s,;]/u.test(value) ||
    hasControlCharacter(value)
  ) {
    return false;
  }

  const parts = value.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (
    !localPart ||
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart)
  ) {
    return false;
  }

  if (!domain || domain.length > 253) return false;
  const labels = domain.split(".");
  return labels.length >= 2 && labels.every(
    (label) =>
      label.length >= 1 &&
      label.length <= 63 &&
      !label.startsWith("-") &&
      !label.endsWith("-") &&
      /^[A-Z0-9-]+$/i.test(label),
  );
}

export function validateContactSubmission(
  input: unknown,
  options: ContactValidationOptions = {},
): ContactValidationResult {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const name = typeof source.name === "string" ? source.name.trim() : "";
  const organization = typeof source.organization === "string" ? source.organization.trim() : "";
  const email = typeof source.email === "string" ? source.email.trim() : "";
  const reason = typeof source.reason === "string" ? source.reason.trim() : "";
  const subject = typeof source.subject === "string" ? source.subject.trim() : "";
  const message = typeof source.message === "string" ? source.message.trim() : "";
  const website = typeof source.website === "string" ? source.website.trim() : "";
  const submissionId = typeof source.submissionId === "string" ? source.submissionId.trim() : "";
  const startedAt = source.startedAt;
  const errors: ContactFieldErrors = {};

  if (
    name.length < 2 ||
    name.length > 100 ||
    hasControlCharacter(name)
  ) {
    errors.name = "Ingrese un nombre válido de hasta 100 caracteres.";
  }
  if (
    organization.length < 2 ||
    organization.length > 120 ||
    hasControlCharacter(organization)
  ) {
    errors.organization = "Ingrese una organización válida de hasta 120 caracteres.";
  }
  if (!isValidEmailAddress(email)) {
    errors.email = "Ingrese un correo válido.";
  }
  if (!isContactReason(reason)) {
    errors.reason = "Seleccione un motivo de contacto.";
  }
  if (
    subject.length < 4 ||
    subject.length > 120 ||
    hasControlCharacter(subject)
  ) {
    errors.subject = "Ingrese un asunto válido de 4 a 120 caracteres.";
  }
  if (hasControlCharacter(message, true)) {
    errors.message = "El mensaje contiene caracteres no permitidos.";
  } else if (message.length < 20) {
    errors.message = "Incluya al menos 20 caracteres para explicar su consulta.";
  } else if (message.length > 2000) {
    errors.message = "El mensaje no puede superar los 2,000 caracteres.";
  }
  if (source.consent !== true) {
    errors.consent = "Confirme que ha leído el Aviso de privacidad.";
  }

  if (Object.keys(errors).length > 0 || !isContactReason(reason)) {
    return { ok: false, code: "validation_error", fieldErrors: errors };
  }

  const enforceTiming = options.enforceTiming ?? true;
  const now = options.now ?? Date.now();
  const elapsed = typeof startedAt === "number" ? now - startedAt : Number.NaN;
  const hiddenFieldsAreValid =
    submissionIdPattern.test(submissionId) &&
    typeof startedAt === "number" &&
    Number.isSafeInteger(startedAt) &&
    (!enforceTiming ||
      (elapsed >= CONTACT_MIN_FILL_TIME_MS && elapsed <= CONTACT_MAX_FILL_TIME_MS));

  if (!hiddenFieldsAreValid) {
    return { ok: false, code: "invalid_submission", fieldErrors: {} };
  }

  return {
    ok: true,
    data: {
      name,
      organization,
      email,
      reason,
      subject,
      message,
      consent: true,
      submissionId,
      startedAt,
      website,
    },
  };
}
