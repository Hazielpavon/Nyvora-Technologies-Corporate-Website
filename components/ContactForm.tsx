"use client";

import Link from "next/link";
import { useState } from "react";
import {
  contactReasons,
  createContactDraft,
  isContactReason,
  type ContactDraftInput,
} from "@/lib/contact";
import styles from "./ContactForm.module.css";

const fields = ["name", "organization", "email", "reason", "message", "consent"] as const;
type FieldName = (typeof fields)[number];
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = "idle" | "validating" | "error" | "ready";
type ContactDraft = ReturnType<typeof createContactDraft>;

function validate(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(formData.get("name") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const consent = formData.get("consent");

  if (name.length < 2) errors.name = "Ingrese su nombre.";
  if (organization.length < 2) errors.organization = "Ingrese el nombre de su organización.";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Ingrese un correo válido.";
  if (!isContactReason(reason)) errors.reason = "Seleccione un motivo de contacto.";
  if (message.length < 20) errors.message = "Incluya al menos 20 caracteres para explicar su interés.";
  if (message.length > 2000) errors.message = "El mensaje no puede superar los 2,000 caracteres.";
  if (consent !== "on") errors.consent = "Confirme que ha leído el Aviso de privacidad.";

  return errors;
}

function getDraftInput(formData: FormData): ContactDraftInput {
  const reason = String(formData.get("reason") ?? "");

  if (!isContactReason(reason)) {
    throw new Error("Motivo de contacto no válido.");
  }

  return {
    name: String(formData.get("name") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    email: String(formData.get("email") ?? ""),
    reason,
    message: String(formData.get("message") ?? ""),
  };
}

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [draft, setDraft] = useState<ContactDraft | null>(null);

  const clearError = (field: FieldName) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setDraft(null);
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("validating");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validate(formData);
    setErrors(nextErrors);

    const firstInvalidField = fields.find((field) => nextErrors[field]);
    if (firstInvalidField) {
      setDraft(null);
      setStatus("error");
      const element = form.elements.namedItem(firstInvalidField);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    setDraft(createContactDraft(getDraftInput(formData)));
    setStatus("ready");
  };

  const isBusy = status === "validating";

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.notice} role="note">
        <strong>Contacto por correo electrónico.</strong>
        <p>
          Este formulario prepara un borrador en su aplicación de correo. Nyvora no recibe el contenido hasta que usted revise el mensaje y decida enviarlo.
        </p>
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.field}>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            onInput={() => clearError("name")}
          />
          {errors.name ? <p id="name-error" className={styles.fieldError}>{errors.name}</p> : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="organization">Organización</label>
          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            required
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={errors.organization ? "organization-error" : undefined}
            onInput={() => clearError("organization")}
          />
          {errors.organization ? <p id="organization-error" className={styles.fieldError}>{errors.organization}</p> : null}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Correo</label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={`email-help${errors.email ? " email-error" : ""}`}
          onInput={() => clearError("email")}
        />
        <p id="email-help" className={styles.helper}>Use un correo en el que podamos responder sobre esta consulta.</p>
        {errors.email ? <p id="email-error" className={styles.fieldError}>{errors.email}</p> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="reason">Motivo de contacto</label>
        <select
          id="reason"
          name="reason"
          defaultValue=""
          required
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? "reason-error" : undefined}
          onChange={() => clearError("reason")}
        >
          <option value="" disabled>Seleccione una opción</option>
          {contactReasons.map((reason) => (
            <option key={reason.value} value={reason.value}>{reason.label}</option>
          ))}
        </select>
        {errors.reason ? <p id="reason-error" className={styles.fieldError}>{errors.reason}</p> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          rows={7}
          minLength={20}
          maxLength={2000}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`message-help${errors.message ? " message-error" : ""}`}
          onInput={() => clearError("message")}
        />
        <p id="message-help" className={styles.helper}>
          No incluya credenciales, datos financieros, registros de clientes, secretos ni otra información confidencial.
        </p>
        {errors.message ? <p id="message-error" className={styles.fieldError}>{errors.message}</p> : null}
      </div>

      <div className={styles.consentField}>
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          onChange={() => clearError("consent")}
        />
        <label htmlFor="consent">
          He leído el <Link href="/privacy">Aviso de privacidad del sitio web</Link> y comprendo cómo se usará la información incluida en el correo para responder a mi consulta.
        </label>
        {errors.consent ? <p id="consent-error" className={styles.fieldError}>{errors.consent}</p> : null}
      </div>

      <div
        className={`${styles.status} ${status === "error" ? styles.statusError : ""} ${status === "ready" ? styles.statusReady : ""}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {status === "idle" ? "Estado del formulario: listo para preparar un correo." : null}
        {status === "validating" ? "Revisando los campos requeridos…" : null}
        {status === "error"
          ? "Revise los campos señalados. No se ha preparado ningún correo."
          : null}
        {status === "ready" && draft
          ? `Borrador preparado para ${draft.recipient}. Nyvora aún no ha recibido el mensaje; ábralo y envíelo desde su aplicación de correo.`
          : null}
      </div>

      {draft ? (
        <a className={styles.submitButton} href={draft.href}>
          Abrir borrador en correo
          <span aria-hidden="true">→</span>
        </a>
      ) : (
        <button className={styles.submitButton} type="submit" disabled={isBusy}>
          {isBusy ? "Revisando…" : "Preparar correo"}
          <span aria-hidden="true">→</span>
        </button>
      )}
    </form>
  );
}
