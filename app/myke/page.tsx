import type { Metadata } from "next";
import { ActionLink, PageHero, SectionHeading } from "@/components/Primitives";
import { mykeBenefits, mykeCapabilities } from "@/content";
import { createPageMetadata, SITE } from "@/lib/site";
import styles from "../Pages.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Myke",
  description:
    "Myke es la plataforma de banca conversacional de Nyvora Technologies. Ayuda a consultar información, comprender movimientos y preparar solicitudes mediante interacciones naturales.",
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
            <h2>Una forma más directa de relacionarse con los servicios bancarios.</h2>
          </div>
          <div className={styles.prose}>
            <p>
              Myke es una plataforma de banca conversacional desarrollada por Nyvora Technologies. Permite que una persona plantee una necesidad bancaria con palabras cotidianas, sin tener que conocer de antemano dónde encontrar cada opción o cómo se denomina un proceso.
            </p>
            <p>
              La conversación ayuda a organizar esa necesidad y presentar la información de una forma comprensible. Según lo que cada institución habilite, Myke puede acompañar consultas, aportar contexto sobre movimientos y preparar solicitudes para que la persona entienda qué información necesita y cuál es el siguiente paso.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.sectionMuted}`}>
        <div className="site-container">
          <SectionHeading
            eyebrow="02 / Funcionalidad"
            title="Una conversación útil en distintos momentos de la experiencia bancaria."
            description="Myke busca ofrecer un punto de entrada más claro a los servicios que cada institución decida poner a disposición."
            align="split"
          />
          <ol className={styles.useCaseList}>
            {mykeCapabilities.map((capability, index) => (
              <li key={capability.title}>
                <span>0{index + 1}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </li>
            ))}
          </ol>
          <p className={styles.conditionalNote}>
            Myke no sustituye las decisiones, autorizaciones ni canales de la institución. Las funciones disponibles dependen de la información y los servicios que cada entidad defina y habilite.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <SectionHeading
            eyebrow="03 / Adaptación institucional"
            title="Una experiencia que responde al contexto de cada institución."
            description="El lenguaje, la identidad y el alcance de Myke pueden definirse de acuerdo con la experiencia y los servicios que cada institución desea ofrecer."
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
          <h2>Converse con Nyvora sobre el alcance de Myke para su institución.</h2>
          <ActionLink href="/contact">Solicitar información sobre Myke</ActionLink>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
