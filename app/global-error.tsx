"use client";

import Link from "next/link";
import styles from "./ErrorState.module.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body className={styles.globalBody}>
        <title>Error inesperado | Nyvora Technologies</title>
        <main className={styles.globalMain}>
          <section
            className={styles.errorCard}
            role="alert"
            aria-labelledby="global-error-title"
          >
            <p className={styles.eyebrow}>Nyvora Technologies / Error inesperado</p>
            <h1 id="global-error-title">No pudimos mostrar esta página.</h1>
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
          </section>
        </main>
      </body>
    </html>
  );
}
