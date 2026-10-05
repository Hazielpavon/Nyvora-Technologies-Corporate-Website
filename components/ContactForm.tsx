"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  contactFields,
  contactReasons,
  validateContactSubmission,
  type ContactFieldErrors,
  type ContactFieldName,
} from "@/lib/contact";
import { ArrowRight } from "@phosphor-icons/react";

type FormStatus = "idle" | "submitting" | "success" | "error";
type SubmissionIdentity = {
  submissionId: string;
  startedAt: number;
};

const fieldClass =
  "grid gap-2 [&_label]:text-sm [&_label]:font-medium [&_label]:text-ink [&_input]:min-h-12 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-line [&_input]:bg-bg [&_input]:px-4 [&_input]:text-base [&_input]:text-ink [&_select]:min-h-12 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-line [&_select]:bg-bg [&_select]:px-4 [&_select]:text-base [&_select]:text-ink [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-line [&_textarea]:bg-bg [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-base [&_textarea]:text-ink [&_[aria-invalid=true]]:border-danger";

const CLIENT_REQUEST_TIMEOUT_MS = 15_000;
const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function createSubmissionIdentity(): SubmissionIdentity {
  return {
    submissionId: globalThis.crypto.randomUUID(),
    startedAt: Date.now(),
  };
}

function getRequestData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    email: String(formData.get("email") ?? ""),
    reason: String(formData.get("reason") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") === "on",
    website: String(formData.get("website") ?? ""),
    submissionId: String(formData.get("submissionId") ?? ""),
    startedAt: Number(formData.get("startedAt") ?? Number.NaN),
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
  const formRef = useRef<HTMLFormElement>(null);
  const submissionInProgress = useRef(false);
  const pendingFocusErrors = useRef<ContactFieldErrors | null>(null);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [submissionIdentity, setSubmissionIdentity] = useState(
    createSubmissionIdentity,
  );
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
    if (status === "submitting" || status === "error") {
      setSubmissionIdentity((current) => ({
        ...current,
        submissionId: globalThis.crypto.randomUUID(),
      }));
    }
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

  useEffect(() => {
    const fieldErrors = pendingFocusErrors.current;
    const form = formRef.current;
    if (status !== "error" || !fieldErrors || !form) return;

    pendingFocusErrors.current = null;
    focusFirstInvalidField(form, fieldErrors);
  }, [status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInProgress.current) return;

    const form = event.currentTarget;
    const requestData = getRequestData(new FormData(form));
    const validation = validateContactSubmission(requestData, {
      enforceTiming: false,
    });

    if (!validation.ok) {
      setErrors(validation.fieldErrors);
      setStatus("error");
      setStatusMessage("Revise los campos señalados. El mensaje no se ha enviado.");
      focusFirstInvalidField(form, validation.fieldErrors);
      return;
    }

    setErrors({});
    pendingFocusErrors.current = null;
    submissionInProgress.current = true;
    setStatus("submitting");
    setStatusMessage("Enviando su mensaje…");
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      CLIENT_REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null) as
        | { ok?: boolean; code?: string; fieldErrors?: unknown }
        | null;

      if (response.ok && result?.ok === true) {
        form.reset();
        setSubmissionIdentity(createSubmissionIdentity());
        setStatus("success");
        setStatusMessage(
          "Su mensaje fue aceptado para envío a Nyvora.",
        );
        return;
      }

      if (response.status === 400) {
        const serverErrors = getServerFieldErrors(result?.fieldErrors);
        pendingFocusErrors.current = serverErrors;
        setErrors(serverErrors);
        setStatus("error");
        if (Object.keys(serverErrors).length > 0) {
          setStatusMessage("Revise los campos señalados. El mensaje no se ha enviado.");
        } else {
          setStatusMessage(
            "No pudimos validar el envío. Revise la información e intente nuevamente.",
          );
        }
        return;
      }

      setStatus("error");
      setStatusMessage(
        response.status === 503
          ? "El canal de envío está temporalmente no disponible. Intente nuevamente más tarde."
          : response.status === 504
            ? "El envío tardó demasiado. Sus datos permanecen en el formulario para que pueda intentarlo de nuevo."
            : "No pudimos enviar el mensaje. Sus datos permanecen en el formulario para que pueda intentarlo de nuevo.",
      );
    } catch {
      setStatus("error");
      setStatusMessage(
        controller.signal.aborted
          ? "La conexión tardó demasiado. Sus datos permanecen en el formulario para que pueda intentarlo de nuevo."
          : "No pudimos conectar con el canal de envío. Sus datos permanecen en el formulario para que pueda intentarlo de nuevo.",
      );
    } finally {
      window.clearTimeout(timeout);
      submissionInProgress.current = false;
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <form
      ref={formRef}
      action="/api/contact"
      method="post"
      className="rounded-[20px] border border-line bg-raised p-6 sm:p-8 md:p-10"
      noValidate
      aria-busy={isSubmitting}
      aria-describedby="contact-form-status"
      onSubmit={handleSubmit}
    >
      <noscript>
        <p className="mb-6 rounded-xl bg-surface p-4 text-sm text-ink">
          Active JavaScript para enviar este formulario de forma segura desde el sitio.
        </p>
      </noscript>

      <fieldset
        className="grid min-w-0 gap-6 disabled:opacity-70"
        disabled={!hydrated || isSubmitting}
        aria-disabled={!hydrated || isSubmitting}
      >
        <div className="rounded-xl bg-accent-wash p-4 text-sm leading-relaxed text-ink [&_p]:mt-1 [&_p]:text-ink-soft" role="note">
          <strong>Contacto directo con Nyvora.</strong>
          <p>
            El formulario envía su consulta directamente desde este sitio al canal correspondiente, sin abrir una aplicación externa.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className={fieldClass}>
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
            {errors.name ? <p id="name-error" className="text-sm font-medium text-danger">{errors.name}</p> : null}
          </div>

          <div className={fieldClass}>
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
            {errors.organization ? <p id="organization-error" className="text-sm font-medium text-danger">{errors.organization}</p> : null}
          </div>
        </div>

        <div className={fieldClass}>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            spellCheck={false}
            autoComplete="email"
            maxLength={254}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={`email-help${errors.email ? " email-error" : ""}`}
            onInput={() => clearError("email")}
          />
          <p id="email-help" className="text-sm text-ink-muted">Use un correo en el que podamos responder sobre esta consulta.</p>
          {errors.email ? <p id="email-error" className="text-sm font-medium text-danger">{errors.email}</p> : null}
        </div>

        <div className={fieldClass}>
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
          {errors.reason ? <p id="reason-error" className="text-sm font-medium text-danger">{errors.reason}</p> : null}
        </div>

        <div className={fieldClass}>
          <label htmlFor="subject">Asunto</label>
          <input
            id="subject"
            name="subject"
            type="text"
            minLength={4}
            maxLength={120}
            required
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            onInput={() => clearError("subject")}
          />
          {errors.subject ? <p id="subject-error" className="text-sm font-medium text-danger">{errors.subject}</p> : null}
        </div>

        <div className={fieldClass}>
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
          <p id="message-help" className="text-sm text-ink-muted">
            No incluya credenciales, datos financieros, registros de clientes, secretos ni otra información confidencial.
          </p>
          {errors.message ? <p id="message-error" className="text-sm font-medium text-danger">{errors.message}</p> : null}
        </div>

        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Sitio web</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input
          name="submissionId"
          type="hidden"
          value={hydrated ? submissionIdentity.submissionId : ""}
          readOnly
        />
        <input
          name="startedAt"
          type="hidden"
          value={hydrated ? submissionIdentity.startedAt : ""}
          readOnly
        />

        <div className="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-2 text-sm leading-relaxed text-ink-soft [&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-2 [&_input]:mt-1 [&_input]:size-[1.125rem] [&_input]:accent-[var(--accent-ink)] [&_p]:col-span-2">
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
          {errors.consent ? <p id="consent-error" className="text-sm font-medium text-danger">{errors.consent}</p> : null}
        </div>

        <div
          id="contact-form-status"
          className={`rounded-xl px-4 py-3 text-sm ${status === "error" ? "bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] text-danger" : status === "success" ? "bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-success" : "bg-surface text-ink-soft"}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {statusMessage}
        </div>

        <button
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-button px-7 text-[0.9375rem] font-medium text-button-ink transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed sm:w-auto sm:justify-self-start"
          type="submit"
          disabled={!hydrated || isSubmitting}
        >
          {!hydrated ? "Preparando…" : isSubmitting ? "Enviando…" : "Enviar mensaje"}
          <ArrowRight aria-hidden="true" size={18} weight="bold" />
        </button>
      </fieldset>
    </form>
  );
}
