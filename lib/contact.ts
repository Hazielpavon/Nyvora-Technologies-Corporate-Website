import { SITE } from "@/lib/site";

export const contactReasons = [
  { value: "nyvora", label: "Información sobre Nyvora", channel: "contact" },
  { value: "myke", label: "Información sobre Myke", channel: "contact" },
  { value: "commercial", label: "Oportunidades comerciales", channel: "contact" },
  { value: "alliances", label: "Alianzas", channel: "contact" },
  { value: "support", label: "Soporte", channel: "support" },
  { value: "other", label: "Otro", channel: "contact" },
] as const;

export type ContactReason = (typeof contactReasons)[number]["value"];

export type ContactDraftInput = {
  name: string;
  organization: string;
  email: string;
  reason: ContactReason;
  message: string;
};

export function isContactReason(value: string): value is ContactReason {
  return contactReasons.some((reason) => reason.value === value);
}

export function createContactDraft(input: ContactDraftInput) {
  const reason = contactReasons.find((item) => item.value === input.reason);

  if (!reason) {
    throw new Error("Motivo de contacto no válido.");
  }

  const recipient = SITE.emails[reason.channel];
  const subject = `Consulta desde nyvoratechnologies.com — ${reason.label}`;
  const body = [
    `Nombre: ${input.name.trim()}`,
    `Organización: ${input.organization.trim()}`,
    `Correo de respuesta: ${input.email.trim()}`,
    `Motivo: ${reason.label}`,
    "",
    "Mensaje:",
    input.message.trim(),
  ].join("\r\n");
  const parameters = new URLSearchParams({ subject, body });

  return {
    recipient,
    href: `mailto:${recipient}?${parameters.toString()}`,
  };
}
