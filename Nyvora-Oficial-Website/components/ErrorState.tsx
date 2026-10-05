import Link from "next/link";

type ErrorStateProps = {
  headingId: string;
  retry: () => void;
};

/** Shared, framework-agnostic fallback used by the route and root error boundaries. */
export function ErrorState({ headingId, retry }: ErrorStateProps) {
  return (
    <section
      role="alert"
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-2xl px-5 py-24 md:py-32"
    >
      <h1 id={headingId} className="text-4xl font-semibold leading-[1.06] tracking-tight text-ink md:text-5xl">
        No pudimos mostrar esta página.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        Ocurrió un problema inesperado. Puede intentarlo nuevamente o volver al sitio corporativo.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={retry}
          className="inline-flex min-h-12 items-center rounded-full bg-button px-6 font-medium text-button-ink transition-transform active:scale-[0.98]"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-full border border-line px-6 font-medium text-ink hover:bg-surface"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
