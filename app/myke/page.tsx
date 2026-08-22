import type { Metadata } from "next";
import { ActionLink, PageHero, SectionHeading } from "@/components/Primitives";
import {
  mykeBenefits,
  mykeCapabilities,
  mykeHeroFacts,
  mykeJourneySteps,
} from "@/content";
import { createPageMetadata, SITE } from "@/lib/site";
import { serializeStructuredData } from "@/lib/structured-data";
import styles from "../Pages.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Myke — Banca conversacional",
  description:
    "Myke es la plataforma de banca conversacional de Nyvora Technologies. La persona empieza por lo que necesita y el banco decide qué servicios habilita.",
  path: "/myke",
});

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.productName,
  applicationCategory: "FinanceApplication",
  description:
    "Plataforma de banca conversacional para instituciones financieras, desarrollada por Nyvora Technologies.",
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
        eyebrow="Nyvora Myke / Banca conversacional"
        title="La banca digital empieza por lo que la persona necesita."
        intro="Myke es una plataforma de banca conversacional para instituciones financieras. Convierte necesidades expresadas con palabras cotidianas en una interacción más directa con la información, los servicios y los procesos que cada banco decida habilitar."
        aside={
          <dl className={styles.heroFacts}>
            {mykeHeroFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section className="section">
        <div className={`site-container ${styles.introGrid}`}>
          <div>
            <p className="eyebrow">01 / El punto de partida</p>
            <h2>Primero la necesidad. Después, el camino.</h2>
          </div>
          <div className={styles.prose}>
            <p>
              En una experiencia bancaria convencional, la persona suele tener que localizar una función, recorrer menús y reconocer términos específicos antes de avanzar. Cuando la información está distribuida entre distintas pantallas, una consulta sencilla puede exigir más navegación de la esperada.
            </p>
            <p>
              Myke invierte ese orden. La interacción comienza con una pregunta o una tarea expresada de manera natural. Desde ahí, la conversación presenta las opciones y la información que el banco haya decidido ofrecer.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.sectionMuted}`}>
        <div className="site-container">
          <SectionHeading
            eyebrow="02 / Qué hace Myke"
            title="Una conversación para consultar, comprender y avanzar."
            description="La propuesta no termina en responder preguntas aisladas. Según el alcance definido por cada entidad, Myke puede acompañar desde una consulta puntual hasta una gestión más estructurada."
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
            Los ejemplos son ilustrativos. La disponibilidad de cada consulta o gestión depende de la información, los servicios y los procesos habilitados por la institución.
          </p>
        </div>
      </section>

      <section className="section">
        <div className={`site-container ${styles.introGrid}`}>
          <div>
            <p className="eyebrow">03 / Junto a la banca existente</p>
            <h2>Una capa conversacional que convive con la banca digital existente.</h2>
          </div>
          <div className={styles.prose}>
            <p>
              Myke no pretende sustituir los sistemas centrales de una entidad ni exige reemplazar su aplicación. Está diseñado para formar parte de la experiencia digital existente y trabajar junto a los servicios que el banco decida incorporar.
            </p>
            <p>
              El control permanece en la institución: define qué información se muestra, qué funciones están disponibles y cuándo una persona debe continuar por un canal o proceso ya establecido. Myke ofrece una nueva puerta de entrada sin cambiar quién decide cómo opera cada servicio.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.sectionMuted}`}>
        <div className="site-container">
          <SectionHeading
            eyebrow="04 / Del lenguaje a una acción comprensible"
            title="De una solicitud amplia a un siguiente paso claro."
            description="Una conversación puede comenzar con «Quiero hacer una transferencia». A partir de ahí, la interacción se vuelve más específica sin exigir que la persona conozca de antemano el recorrido."
            align="split"
          />
          <ol className={styles.journeyFlow}>
            {mykeJourneySteps.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          <p className={styles.conditionalNote}>
            Myke organiza la interacción y prepara el recorrido; no mueve fondos por sí solo. La gestión continúa únicamente mediante las funciones y los procesos que la entidad haya habilitado.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <SectionHeading
            eyebrow="05 / Diseñado para diferentes instituciones"
            title="Una base común, adaptada a cada realidad."
            description="Cada banco tiene una identidad, una oferta y una forma propia de atender a sus clientes. Myke puede ajustarse al lenguaje, la presentación, los servicios y el contexto de los mercados que la entidad configure."
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
            La configuración concreta depende de las necesidades, los servicios disponibles y las decisiones de cada institución.
          </p>
        </div>
      </section>

      <section className="section">
        <div className={`site-container ${styles.finalCta}`}>
          <div className={styles.finalCtaCopy}>
            <p className="eyebrow">Myke para su institución</p>
            <h2>Conozca cómo Myke puede integrarse a su experiencia digital.</h2>
            <p className={styles.finalCtaIntro}>
              Conversemos sobre los servicios y procesos que su institución desea acercar a sus clientes mediante una interacción más natural.
            </p>
          </div>
          <ActionLink href="/contact">Hablar con Nyvora</ActionLink>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(productSchema) }}
      />
    </>
  );
}
