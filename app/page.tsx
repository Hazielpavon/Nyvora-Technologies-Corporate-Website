import type { Metadata } from "next";
import { ActionLink, SectionHeading } from "@/components/Primitives";
import { companyPrinciples, mykeBenefits } from "@/content";
import { createPageMetadata } from "@/lib/site";
import styles from "./Home.module.css";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Tecnología creada en Honduras",
    description:
      "Nyvora Technologies es una startup hondureña que desarrolla soluciones de software modernas, útiles y con potencial regional e internacional.",
    path: "/",
  }),
  title: "Nyvora Technologies | Tecnología creada en Honduras",
};

export default function HomePage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={`site-container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Company / Nyvora Technologies</p>
            <h1 id="home-title">Tecnología creada en Honduras para construir nuevas posibilidades.</h1>
            <p className={styles.heroIntro}>
              Nyvora Technologies es una startup hondureña dedicada al desarrollo de soluciones de software modernas, con el propósito de contribuir al crecimiento tecnológico de Honduras y crear productos con potencial regional e internacional.
            </p>
            <div className={styles.heroActions}>
              <ActionLink href="/myke">Conocer Myke</ActionLink>
              <ActionLink href="/contact" variant="secondary">
                Contactar a Nyvora
              </ActionLink>
            </div>
            <div className={styles.heroMeta} aria-label="Ubicación y enfoque de la empresa">
              <span>Tegucigalpa, Honduras</span>
              <span>Software con aplicación real</span>
            </div>
          </div>

          <aside className={styles.signalPanel} aria-label="Perspectiva de Nyvora Technologies">
            <div className={styles.signalHeader}>
              <span>Nyvora / Honduras</span>
              <span className={styles.liveMarker}>Etapa inicial</span>
            </div>
            <ol className={styles.signalFlow}>
              <li>
                <span>01</span>
                <strong>Origen</strong>
                <small>Honduras</small>
              </li>
              <li>
                <span>02</span>
                <strong>Propósito</strong>
                <small>Crecimiento tecnológico</small>
              </li>
              <li>
                <span>03</span>
                <strong>Proyección</strong>
                <small>Regional e internacional</small>
              </li>
            </ol>
            <p className={styles.signalNote}>
              Construimos una empresa con ambición de crecer, sin perder claridad sobre nuestro punto de partida.
            </p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <SectionHeading
            eyebrow="01 / Nuestro propósito"
            title="Crear tecnología útil desde Honduras."
            description="Nyvora busca aportar al desarrollo tecnológico del país mediante productos de software claros, modernos y preparados para evolucionar."
            align="split"
          />
          <ol className={styles.principleLedger}>
            {companyPrinciples.map((principle) => (
              <li key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${styles.companySection}`}>
        <div className={`site-container ${styles.editorialGrid}`}>
          <div>
            <p className="eyebrow">02 / Visión</p>
            <h2>Ideas complejas convertidas en productos claros.</h2>
          </div>
          <div className={styles.editorialCopy}>
            <p>
              Desarrollamos soluciones con una aplicación concreta y una experiencia comprensible. Nos interesa que la tecnología resuelva necesidades reales, no que añada complejidad innecesaria.
            </p>
            <p>
              Myke es nuestro producto principal en esta etapa, pero Nyvora nace para crear distintas soluciones y explorar nuevas oportunidades con el tiempo.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.productSection}`}>
        <div className="site-container">
          <article className={styles.productPanel}>
            <div className={styles.productRail} aria-hidden="true">
              <span>Producto 01</span>
              <span>Nyvora</span>
              <span>Myke</span>
            </div>
            <div className={styles.productBody}>
              <p className="eyebrow">Nyvora Myke</p>
              <h2>Una experiencia conversacional para la banca digital.</h2>
              <p>
                Myke ayuda a acercar servicios bancarios a las personas mediante conversaciones naturales y una experiencia adaptable a cada institución financiera.
              </p>
              <ul className={styles.capabilityTags} aria-label="Beneficios generales de Myke">
                {mykeBenefits.map((benefit) => (
                  <li key={benefit.title}>{benefit.title}</li>
                ))}
              </ul>
              <ActionLink href="/myke">Conocer Myke</ActionLink>
            </div>
          </article>
        </div>
      </section>

      <section className={`section ${styles.ctaSection}`}>
        <div className={`site-container ${styles.ctaGrid}`}>
          <div>
            <p className="eyebrow">03 / Contacto</p>
            <h2>Conversemos sobre nuevas posibilidades.</h2>
          </div>
          <div>
            <p>
              Si desea conocer más sobre Nyvora Technologies, Myke o una posible colaboración, comparta el contexto de su interés.
            </p>
            <ActionLink href="/contact">Iniciar una conversación</ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
