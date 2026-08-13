import Link from "next/link";
import { SITE } from "@/lib/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`site-container ${styles.grid}`}>
        <div className={styles.identity}>
          <p className={styles.wordmark}>Nyvora Technologies</p>
          <p className={styles.statement}>
            Tecnología creada en Honduras para construir nuevas posibilidades.
          </p>
          <p className={styles.location}>{SITE.location}</p>
        </div>

        <nav className={styles.linkGroup} aria-label="Secciones principales">
          <p className={styles.linkHeading}>Nyvora</p>
          <Link href="/">Company</Link>
          <Link href="/myke">Myke</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <nav className={styles.linkGroup} aria-label="Enlaces legales">
          <p className={styles.linkHeading}>Legal</p>
          <Link href="/privacy">Privacidad</Link>
          <Link href="/terms">Términos de uso</Link>
        </nav>
      </div>
      <div className={`site-container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} Nyvora Technologies.</p>
        <p>Ideas claras. Tecnología útil.</p>
      </div>
    </footer>
  );
}
