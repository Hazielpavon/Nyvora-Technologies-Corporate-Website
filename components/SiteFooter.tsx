import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE } from "@/lib/site";

const linkClass = "text-ink-soft transition-colors hover:text-ink";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-line">
      <div className="site-container grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link
            className="-ml-1 inline-block rounded-md p-1"
            href="/"
            aria-label="Nyvora Technologies, página principal"
          >
            <BrandLogo className="w-44" sizes="176px" />
          </Link>
          <p className="mt-6 max-w-sm leading-relaxed text-ink-soft">
            Tecnología creada en Honduras para construir nuevas posibilidades.
          </p>
          <p className="mt-3 text-sm text-ink-muted">{SITE.location}</p>
        </div>

        <nav className="flex flex-col gap-3 text-[0.9375rem] md:col-span-2" aria-label="Secciones principales">
          <p className="mb-1 text-sm font-medium text-ink">Nyvora</p>
          <Link className={linkClass} href="/">Empresa</Link>
          <Link className={linkClass} href="/myke">Myke</Link>
          <Link className={linkClass} href="/contact">Contacto</Link>
        </nav>

        <nav className="flex flex-col gap-3 text-[0.9375rem] md:col-span-2" aria-label="Enlaces legales">
          <p className="mb-1 text-sm font-medium text-ink">Legal</p>
          <Link className={linkClass} href="/privacy">Privacidad</Link>
          <Link className={linkClass} href="/terms">Términos de uso</Link>
        </nav>

        <div className="flex flex-col gap-3 text-[0.9375rem] md:col-span-3">
          <p className="mb-1 text-sm font-medium text-ink">Correo</p>
          <span className="break-all text-ink-soft">{SITE.emails.contact}</span>
          <span className="break-all text-ink-soft">{SITE.emails.support}</span>
        </div>
      </div>
      <div className="site-container">
        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-ink-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Nyvora Technologies.</p>
          <p>Ideas claras. Tecnología útil.</p>
        </div>
      </div>
    </footer>
  );
}
