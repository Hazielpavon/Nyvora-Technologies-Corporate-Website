import type { Metadata } from "next";
import { ActionLink } from "@/components/Primitives";

export const metadata: Metadata = {
  title: "Página no encontrada",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="py-24 md:py-36">
      <div className="site-container grid gap-10 md:grid-cols-12 md:items-end">
        <p
          aria-hidden="true"
          className="font-mono text-7xl font-medium tracking-tight text-accent-ink md:col-span-4 md:text-9xl"
        >
          404
        </p>
        <div className="md:col-span-7 md:col-start-6">
          <h1
            id="not-found-title"
            className="text-4xl font-semibold leading-[1.06] tracking-tight text-ink md:text-5xl"
          >
            No encontramos esta página.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
            Es posible que la dirección haya cambiado o que la página ya no exista. Regrese al sitio corporativo para continuar.
          </p>
          <div className="mt-10">
            <ActionLink href="/">Volver a Company</ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
