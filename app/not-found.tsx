import type { Metadata } from "next";
import { ActionLink } from "@/components/Primitives";
import styles from "./NotFound.module.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className={styles.notFound} aria-labelledby="not-found-title">
      <div className={`site-container ${styles.inner}`}>
        <div className={styles.code} aria-hidden="true">404</div>
        <div>
          <p className="eyebrow">Navegación / Ruta no disponible</p>
          <h1 id="not-found-title">No encontramos esta página.</h1>
          <p>
            Es posible que la dirección haya cambiado o que la página ya no exista. Regrese al sitio corporativo para continuar.
          </p>
          <ActionLink href="/">Volver a Company</ActionLink>
        </div>
      </div>
    </section>
  );
}
