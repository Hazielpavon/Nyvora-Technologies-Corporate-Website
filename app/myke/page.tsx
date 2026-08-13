import type { Metadata } from "next";
import { ActionLink, PageHero, SectionHeading } from "@/components/Primitives";
import { mykeBenefits } from "@/content";
import { createPageMetadata, SITE } from "@/lib/site";
import styles from "../Pages.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Myke",
  description:
    "Myke es una plataforma de banca conversacional desarrollada por Nyvora Technologies para crear experiencias digitales más naturales y comprensibles.",
  path: "/myke",
});

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.productName,
  applicationCategory: "FinanceApplication",
  description:
    "Plataforma de banca conversacional desarrollada por Nyvora Technologies.",
  provider: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  },
};

export default function MykePage() {
  return (
    <>
      <PageHero
        eyebrow="Producto / Nyvora Myke"
        title="Myke"
        intro="Una experiencia conversacional diseñada para acercar la banca digital a las personas."
        aside={
          <p>
            Desarrollado por Nyvora
            <br />
            Conversaciones naturales
            <br />
            Experiencia adaptable
          </p>
        }
      />

      <section className="section">
        <div className={`site-container ${styles.introGrid}`}>
          <div>
            <p className="eyebrow">01 / Una idea sencilla</p>
            <h2>Hablar con la banca de una forma más natural.</h2>
          </div>
          <div className={styles.prose}>
            <p>
              Myke es una plataforma de banca conversacional desarrollada por Nyvora Technologies. Permite que las personas interactúen con servicios bancarios mediante conversaciones naturales y una experiencia fácil de comprender.
            </p>
            <p>
              Puede ayudar a consultar información, comprender movimientos, preparar solicitudes y simplificar procesos. Las funciones disponibles dependen de las necesidades, capacidades y servicios habilitados por cada institución financiera.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.sectionMuted}`}>
        <div className="site-container">
          <SectionHeading
            eyebrow="02 / Beneficios"
            title="Una experiencia pensada para ser clara y adaptable."
            description="Myke busca facilitar la interacción sin imponer una experiencia idéntica a todas las instituciones."
            align="split"
          />
          <div className={styles.featureGrid}>
            {mykeBenefits.map((benefit, index) => (
              <article key={benefit.title}>
                <span className={styles.featureNumber}>0{index + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
          <p className={styles.conditionalNote}>
            La disponibilidad y el alcance de cada función dependen de la institución y de los acuerdos correspondientes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className={`site-container ${styles.finalCta}`}>
          <h2>Conozca Myke en el contexto de su institución.</h2>
          <ActionLink href="/contact">Solicitar información</ActionLink>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
