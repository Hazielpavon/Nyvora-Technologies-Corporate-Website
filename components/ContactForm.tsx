"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./ContactForm.module.css";

const fields = ["name", "organization", "email", "reason", "message", "consent"] as const;
type FieldName = (typeof fields)[number];
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = "idle" | "validating" | "error";

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
  if (!reason) errors.reason = "Seleccione un motivo de contacto.";
  if (message.length < 20) errors.message = "Incluya al menos 20 caracteres para explicar su interés.";
  if (message.length > 2000) errors.message = "El mensaje no puede superar los 2,000 caracteres.";
  if (consent !== "on") errors.consent = "Confirme que ha leído el Aviso de privacidad.";

  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const clearError = (field: FieldName) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("validating");

    const form = event.currentTarget;
    const nextErrors = validate(new FormData(form));
    setErrors(nextErrors);

    const firstInvalidField = fields.find((field) => nextErrors[field]);
    if (firstInvalidField) {
      setStatus("error");
      const element = form.elements.namedItem(firstInvalidField);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    setStatus("error");
  };

  const isBusy = status === "validating";

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.notice} role="note">
        <strong>El canal de contacto aún no está habilitado.</strong>
        <p>
          Nyvora todavía no recibe mensajes mediante este sitio. El formulario se conserva como preparación y no transmite información.
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
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? "reason-error" : undefined}
          onChange={() => clearError("reason")}
        >
          <option value="" disabled>Seleccione una opción</option>
          <option value="nyvora">Información sobre Nyvora</option>
          <option value="myke">Información sobre Myke</option>
          <option value="commercial">Oportunidades comerciales</option>
          <option value="alliances">Alianzas</option>
          <option value="support">Soporte</option>
          <option value="other">Otro</option>
        </select>
        {errors.reason ? <p id="reason-error" className={styles.fieldError}>{errors.reason}</p> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          rows={7}
          maxLength={2000}
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
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          onChange={() => clearError("consent")}
        />
        <label htmlFor="consent">
          He leído el <Link href="/privacy">Aviso de privacidad del sitio web</Link> y comprendo cómo se usaría esta información para responder a mi consulta.
        </label>
        {errors.consent ? <p id="consent-error" className={styles.fieldError}>{errors.consent}</p> : null}
      </div>

      <div
        className={`${styles.status} ${status === "error" ? styles.statusError : ""}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {status === "idle" ? "Estado del formulario: canal no habilitado." : null}
        {status === "validating" ? "Revisando los campos requeridos…" : null}
        {status === "error" && Object.keys(errors).length > 0
          ? "Revise los campos señalados. No se ha enviado información."
          : null}
        {status === "error" && Object.keys(errors).length === 0
          ? "Su mensaje no se ha enviado porque el canal de contacto aún no está disponible."
          : null}
      </div>

      <button className={styles.submitButton} type="submit" disabled={isBusy}>
        {isBusy ? "Revisando…" : "Revisar mensaje"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
