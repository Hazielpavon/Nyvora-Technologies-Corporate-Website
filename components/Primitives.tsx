import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import styles from "./Primitives.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, aside }: PageHeroProps) {
  return (
    <section className={styles.pageHero} aria-labelledby="page-title">
      <div className={`site-container ${styles.pageHeroGrid}`}>
        <div className={styles.pageHeroCopy}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          <p className={styles.pageHeroIntro}>{intro}</p>
        </div>
        {aside ? <aside className={styles.pageHeroAside}>{aside}</aside> : null}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "split";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <header className={`${styles.sectionHeading} ${align === "split" ? styles.split : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description ? <p>{description}</p> : null}
    </header>
  );
}

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
};

export function ActionLink({
  href,
  children,
  variant = "primary",
}: ActionLinkProps) {
  return (
    <Link className={`${styles.actionLink} ${styles[variant]}`} href={href}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
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
    <div className={styles.legalPage}>
      <header className={styles.legalHeader}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.legalIntro}>{intro}</p>
        <p className={styles.effectiveDate}>
          Fecha de vigencia: <time dateTime={SITE.legalEffectiveDate}>{SITE.legalEffectiveDateLabel}</time>
        </p>
      </header>
      <aside className={styles.reviewNotice} aria-label="Aviso de revisión jurídica">
        <span>Borrador</span>
        <p>
          Este documento requiere revisión jurídica antes de considerarse definitivo o jurídicamente aprobado.
        </p>
      </aside>
      <div className={styles.legalBody}>{children}</div>
    </div>
  );
}
