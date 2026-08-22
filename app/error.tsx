"use client";

import Link from "next/link";
import styles from "./ErrorState.module.css";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  return (
    <section
      className={styles.errorSection}
      role="alert"
      aria-labelledby="app-error-title"
    >
      <div className={styles.errorCard}>
        <p className={styles.eyebrow}>Estado / Error inesperado</p>
        <h1 id="app-error-title">No pudimos mostrar esta página.</h1>
        <p className={styles.description}>
          Ocurrió un problema inesperado. Puede intentarlo nuevamente o volver al sitio
          corporativo.
        </p>
        <div className={styles.actions}>
          <button className={styles.retryButton} type="button" onClick={retry}>
            Intentar de nuevo
          </button>
          <Link className={styles.homeLink} href="/">
            Volver a Company
          </Link>
        </div>
      </div>
    </section>
  );
}
