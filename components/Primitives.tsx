import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

const actionBase =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 text-[0.9375rem] font-medium transition-[transform,background-color,border-color,color] duration-300 ease-out-expo active:translate-y-px active:scale-[0.98]";

const actionVariants = {
  primary: "bg-button text-button-ink hover:bg-[color-mix(in_oklab,var(--button)_86%,var(--accent))]",
  secondary:
    "border border-line bg-transparent text-ink hover:border-ink-muted hover:bg-surface",
} as const;

export function ActionLink({ href, children, variant = "primary" }: ActionLinkProps) {
  return (
    <Link className={`${actionBase} ${actionVariants[variant]}`} href={href}>
      <span>{children}</span>
      <ArrowRight
        aria-hidden="true"
        size={18}
        weight="bold"
        className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
      />
    </Link>
  );
}

type SectionIntroProps = {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  id?: string;
  className?: string;
};

/** Stacked section header: optional eyebrow, headline, then body below it. */
export function SectionIntro({ title, description, eyebrow, id, className = "" }: SectionIntroProps) {
  return (
    <header className={`max-w-3xl ${className}`}>
      {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
      <h2 id={id} className="text-3xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-ink-soft">{description}</p>
      ) : null}
    </header>
  );
}

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, aside }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="pb-16 pt-14 md:pb-24 md:pt-20">
      <div className="site-container grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          {eyebrow ? <p className="eyebrow mb-6">{eyebrow}</p> : null}
          <h1
            id="page-title"
            className="text-4xl font-semibold leading-[1.04] tracking-tight text-ink md:text-6xl"
          >
            {title}
          </h1>
          <p className="mt-7 max-w-[56ch] text-lg leading-relaxed text-ink-soft md:text-xl">{intro}</p>
        </div>
        {aside ? <div className="lg:col-span-5">{aside}</div> : null}
      </div>
    </section>
  );
}

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <div className="site-container grid gap-12 pb-24 pt-14 md:pt-20 lg:grid-cols-12">
      <header className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 leading-relaxed text-ink-soft">{intro}</p>
          <p className="mt-6 font-mono text-sm text-ink-muted">
            Fecha de vigencia:{" "}
            <time dateTime={SITE.legalEffectiveDate}>{SITE.legalEffectiveDateLabel}</time>
          </p>
          <aside
            aria-label="Aviso de revisión jurídica"
            className="mt-8 rounded-[20px] border border-line bg-surface p-5"
          >
            <span className="inline-flex rounded-full bg-accent-wash px-3 py-1 text-xs font-semibold text-accent-ink">
              Borrador
            </span>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Este documento requiere revisión jurídica antes de considerarse definitivo o jurídicamente aprobado.
            </p>
          </aside>
        </div>
      </header>
      <div className="prose-legal max-w-[68ch] lg:col-span-7 lg:col-start-6 [&>section:first-child>h2]:mt-0">
        {children}
      </div>
    </div>
  );
}
