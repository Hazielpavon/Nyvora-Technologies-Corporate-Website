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

export const contactFields = ["name", "organization", "email", "reason", "message", "consent"] as const;

export type ContactReason = (typeof contactReasons)[number]["value"];
export type ContactFieldName = (typeof contactFields)[number];
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export type ContactSubmission = {
  name: string;
  organization: string;
  email: string;
  reason: ContactReason;
  message: string;
  consent: true;
};

export type ContactRequestData = ContactSubmission & {
  website: string;
};

type ContactValidationResult =
  | { ok: true; data: ContactRequestData }
  | { ok: false; fieldErrors: ContactFieldErrors };

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
  if (value.length > 254 || /[\r\n\s,;]/.test(value)) return false;

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

export function validateContactSubmission(input: unknown): ContactValidationResult {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const name = typeof source.name === "string" ? source.name.trim() : "";
  const organization = typeof source.organization === "string" ? source.organization.trim() : "";
  const email = typeof source.email === "string" ? source.email.trim() : "";
  const reason = typeof source.reason === "string" ? source.reason.trim() : "";
  const message = typeof source.message === "string" ? source.message.trim() : "";
  const website = typeof source.website === "string" ? source.website.trim() : "";
  const errors: ContactFieldErrors = {};

  if (name.length < 2 || name.length > 100 || /[\r\n]/.test(name)) {
    errors.name = "Ingrese un nombre válido de hasta 100 caracteres.";
  }
  if (organization.length < 2 || organization.length > 120 || /[\r\n]/.test(organization)) {
    errors.organization = "Ingrese una organización válida de hasta 120 caracteres.";
  }
  if (!isValidEmailAddress(email)) {
    errors.email = "Ingrese un correo válido.";
  }
  if (!isContactReason(reason)) {
    errors.reason = "Seleccione un motivo de contacto.";
  }
  if (message.length < 20) {
    errors.message = "Incluya al menos 20 caracteres para explicar su consulta.";
  } else if (message.length > 2000) {
    errors.message = "El mensaje no puede superar los 2,000 caracteres.";
  }
  if (source.consent !== true) {
    errors.consent = "Confirme que ha leído el Aviso de privacidad.";
  }

  if (Object.keys(errors).length > 0 || !isContactReason(reason)) {
    return { ok: false, fieldErrors: errors };
  }

  return {
    ok: true,
    data: {
      name,
      organization,
      email,
      reason,
      message,
      consent: true,
      website,
    },
  };
}
