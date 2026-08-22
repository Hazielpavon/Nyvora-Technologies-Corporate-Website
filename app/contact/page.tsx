import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/Primitives";
import { createPageMetadata, SITE } from "@/lib/site";
import styles from "../Pages.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Contacto",
  description:
    "Punto de contacto de Nyvora Technologies para información sobre la empresa, Myke, oportunidades, alianzas y soporte.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact / Nyvora Technologies"
        title="Un solo punto de contacto."
        intro="Esta sección reúne las consultas sobre Nyvora Technologies, Myke, oportunidades, alianzas y soporte."
        aside={
          <p>
            Consultas generales
            <br />
            Oportunidades y alianzas
            <br />
            Soporte
          </p>
        }
      />

      <section className="section">
        <div className={`site-container ${styles.contactGrid}`}>
          <ContactForm />
          <aside className={styles.contactSidebar} aria-label="Información del canal de contacto">
            <div className={styles.contactBlock}>
              <h2>Consultas generales</h2>
              <p>
                Información sobre Nyvora, Myke, oportunidades comerciales y alianzas.
              </p>
              <p className={styles.contactEmail}>{SITE.emails.contact}</p>
            </div>
            <div className={styles.contactBlock}>
              <h2>Soporte</h2>
              <p>Ayuda relacionada con productos o servicios de Nyvora.</p>
              <p className={styles.contactEmail}>{SITE.emails.support}</p>
            </div>
            <div className={styles.contactBlock}>
              <h2>Ubicación</h2>
              <address>{SITE.location}</address>
            </div>
            <div className={styles.contactBlock}>
              <h2>Privacidad</h2>
              <p>Conozca cómo se trata la información compartida mediante el sitio.</p>
              <Link href="/privacy">Aviso de privacidad</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
