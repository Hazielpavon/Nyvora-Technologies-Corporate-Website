"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  contactFields,
  contactReasons,
  validateContactSubmission,
  type ContactFieldErrors,
  type ContactFieldName,
} from "@/lib/contact";
import styles from "./ContactForm.module.css";

type FormStatus = "idle" | "submitting" | "success" | "error";

function getRequestData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    email: String(formData.get("email") ?? ""),
    reason: String(formData.get("reason") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") === "on",
    website: String(formData.get("website") ?? ""),
  };
}

function getServerFieldErrors(value: unknown): ContactFieldErrors {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const errors: ContactFieldErrors = {};

  contactFields.forEach((field) => {
    if (typeof source[field] === "string") errors[field] = source[field];
  });

  return errors;
}

export function ContactForm() {
  const submissionInProgress = useRef(false);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Complete los campos para enviar su consulta a Nyvora.",
  );

  const clearError = (field: ContactFieldName) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status !== "idle" && status !== "submitting") {
      setStatus("idle");
      setStatusMessage("Complete los campos para enviar su consulta a Nyvora.");
    }
  };

  const focusFirstInvalidField = (
    form: HTMLFormElement,
    fieldErrors: ContactFieldErrors,
  ) => {
    const firstInvalidField = contactFields.find((field) => fieldErrors[field]);
    if (!firstInvalidField) return;
    const element = form.elements.namedItem(firstInvalidField);
    if (element instanceof HTMLElement) element.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInProgress.current) return;

    const form = event.currentTarget;
    const requestData = getRequestData(new FormData(form));
    const validation = validateContactSubmission(requestData);

    if (!validation.ok) {
      setErrors(validation.fieldErrors);
      setStatus("error");
      setStatusMessage("Revise los campos señalados. El mensaje no se ha enviado.");
      focusFirstInvalidField(form, validation.fieldErrors);
      return;
    }

    setErrors({});
    submissionInProgress.current = true;
    setStatus("submitting");
    setStatusMessage("Enviando su mensaje…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json().catch(() => null) as
        | { ok?: boolean; code?: string; fieldErrors?: unknown }
        | null;

      if (response.ok && result?.ok === true) {
        form.reset();
        setStatus("success");
        setStatusMessage(
          "Su mensaje fue aceptado para envío a Nyvora.",
        );
        return;
      }

      if (response.status === 400) {
        const serverErrors = getServerFieldErrors(result?.fieldErrors);
        setErrors(serverErrors);
        setStatus("error");
        setStatusMessage("Revise los campos señalados. El mensaje no se ha enviado.");
        focusFirstInvalidField(form, serverErrors);
        return;
      }

      setStatus("error");
      setStatusMessage(
        response.status === 503
          ? "El canal de envío está temporalmente no disponible. Intente nuevamente más tarde."
          : "No pudimos enviar el mensaje. Sus datos permanecen en el formulario para que pueda intentarlo de nuevo.",
      );
    } catch {
      setStatus("error");
      setStatusMessage(
        "No pudimos conectar con el canal de envío. Sus datos permanecen en el formulario para que pueda intentarlo de nuevo.",
      );
    } finally {
      submissionInProgress.current = false;
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.notice} role="note">
        <strong>Contacto directo con Nyvora.</strong>
        <p>
          El formulario envía su consulta directamente desde este sitio al canal correspondiente, sin abrir una aplicación externa.
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
            maxLength={100}
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
            maxLength={120}
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
          maxLength={254}
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

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
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
          He leído el <Link href="/privacy">Aviso de privacidad del sitio web</Link> y acepto que Nyvora trate la información proporcionada para atender mi consulta.
        </label>
        {errors.consent ? <p id="consent-error" className={styles.fieldError}>{errors.consent}</p> : null}
      </div>

      <div
        className={`${styles.status} ${status === "error" ? styles.statusError : ""} ${status === "success" ? styles.statusReady : ""}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage}
      </div>

      <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando…" : "Enviar mensaje"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
