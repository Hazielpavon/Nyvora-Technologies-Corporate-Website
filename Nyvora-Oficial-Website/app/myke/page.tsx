import {
  CaretRight,
  ClipboardText,
  Fingerprint,
  ListMagnifyingGlass,
  Plus,
  Receipt,
  Signpost,
  SlidersHorizontal,
  Stairs,
  Translate,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { ChatPreview } from "@/components/ChatPreview";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { ActionLink, SectionIntro } from "@/components/Primitives";
import {
  mykeBenefits,
  mykeCapabilities,
  mykeHeroFacts,
  mykeJourneySteps,
} from "@/content";
import { createPageMetadata, SITE } from "@/lib/site";
import { serializeStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Myke, banca conversacional",
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

const capabilityIcons = [ListMagnifyingGlass, Receipt, ClipboardText, Signpost];
const capabilityLayout = [
  "md:col-span-4 bg-accent-wash",
  "md:col-span-2 border border-line bg-raised",
  "md:col-span-2 border border-line bg-raised",
  "md:col-span-4 bg-surface",
];
const benefitIcons = [Fingerprint, SlidersHorizontal, Translate, Stairs];
const conventionalPath = ["Inicio", "Cuentas", "Ahorro", "Movimientos", "Filtrar fechas"];

export default function MykePage() {
  return (
    <>
      <section aria-labelledby="page-title" className="pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="site-container grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow rise mb-6" translate="no">Nyvora Myke</p>
            <h1
              id="page-title"
              className="rise text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.5rem]"
            >
              La banca digital empieza por lo que la persona necesita.
            </h1>
            <p className="rise mt-7 max-w-[46ch] text-lg leading-relaxed text-ink-soft md:text-xl">
              Banca conversacional para instituciones financieras. La persona pregunta con sus palabras; el banco decide qué habilita.
            </p>
            <div className="rise mt-10">
              <ActionLink href="/contact">Hablar con Nyvora</ActionLink>
            </div>
          </div>
          <div className="rise lg:col-span-5 lg:col-start-8">
            <ChatPreview />
          </div>
        </div>

        <div className="site-container mt-20">
          <dl data-myke-facts className="grid gap-8 border-t border-line pt-10 md:grid-cols-3 md:gap-10">
            {mykeHeroFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-sm text-accent-ink">{fact.label}</dt>
                <dd className="mt-3 leading-relaxed text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="start-title" className="border-y border-line bg-surface py-24 md:py-32">
        <div className="site-container">
          <SectionIntro id="start-title" title="Primero la necesidad. Después, el camino." />

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <figure className="reveal rounded-[20px] border border-line bg-raised p-7 md:p-9">
              <figcaption className="text-sm font-medium text-ink-muted">Recorrido convencional</figcaption>
              <ol className="mt-6 flex flex-wrap items-center gap-2" aria-label="Pasos de navegación por menús">
                {conventionalPath.map((step, index) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft">
                      {step}
                    </span>
                    {index < conventionalPath.length - 1 ? (
                      <CaretRight aria-hidden="true" size={14} className="text-ink-muted" />
                    ) : null}
                  </li>
                ))}
              </ol>
              <p className="mt-8 leading-relaxed text-ink-soft">
                En una experiencia bancaria convencional, la persona suele tener que localizar una función, recorrer menús y reconocer términos específicos antes de avanzar. Cuando la información está distribuida entre distintas pantallas, una consulta sencilla puede exigir más navegación de la esperada.
              </p>
            </figure>

            <figure className="reveal rounded-[20px] bg-accent-wash p-7 md:p-9">
              <figcaption className="text-sm font-medium text-accent-ink">Con Myke</figcaption>
              <p className="mt-6 inline-flex rounded-[18px] rounded-br-md bg-button px-4 py-2.5 text-[0.9375rem] text-button-ink">
                «Muéstrame mis movimientos recientes»
              </p>
              <p className="mt-8 leading-relaxed text-ink-soft">
                Myke invierte ese orden. La interacción comienza con una pregunta o una tarea expresada de manera natural. Desde ahí, la conversación presenta las opciones y la información que el banco haya decidido ofrecer.
              </p>
            </figure>
          </div>
        </div>
      </section>

      <section aria-labelledby="capabilities-title" className="py-24 md:py-32">
        <div className="site-container">
          <SectionIntro
            id="capabilities-title"
            title="Una conversación para consultar, comprender y avanzar."
            description="La propuesta no termina en responder preguntas aisladas. Según el alcance definido por cada entidad, Myke puede acompañar desde una consulta puntual hasta una gestión más estructurada."
          />
          <ul className="mt-14 grid gap-4 md:grid-cols-6 md:gap-5">
            {mykeCapabilities.map((capability, index) => {
              const Icon = capabilityIcons[index];
              return (
                <li
                  key={capability.title}
                  className={`reveal flex flex-col rounded-[20px] p-7 md:p-9 ${capabilityLayout[index]}`}
                >
                  <Icon aria-hidden="true" size={30} weight="duotone" className="text-accent-ink" />
                  <h3 className="mt-8 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                    {capability.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] leading-relaxed text-ink-soft">{capability.description}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 max-w-[70ch] text-sm leading-relaxed text-ink-muted">
            Los ejemplos son ilustrativos. La disponibilidad de cada consulta o gestión depende de la información, los servicios y los procesos habilitados por la institución.
          </p>
        </div>
      </section>

      <section aria-labelledby="coexist-title" className="border-y border-line bg-surface py-24 md:py-32">
        <div className="site-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="coexist-title"
              className="text-3xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl lg:sticky lg:top-28"
            >
              Una capa conversacional que convive con la banca digital existente.
            </h2>
          </div>
          <div className="space-y-8 text-lg leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
            <p className="reveal">
              Myke no pretende sustituir los sistemas centrales de una entidad ni exige reemplazar su aplicación. Está diseñado para formar parte de la experiencia digital existente y trabajar junto a los servicios que el banco decida incorporar.
            </p>
            <p className="reveal border-l-2 border-accent pl-6 text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              El control permanece en la institución.
            </p>
            <p className="reveal">
              La entidad define qué información se muestra, qué funciones están disponibles y cuándo una persona debe continuar por un canal o proceso ya establecido. Myke ofrece una nueva puerta de entrada sin cambiar quién decide cómo opera cada servicio.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-title" className="py-24 md:py-32">
        <div className="site-container">
          <SectionIntro
            id="journey-title"
            title="De una solicitud amplia a un siguiente paso claro."
            description="La interacción se vuelve más específica sin exigir que la persona conozca de antemano el recorrido."
          />
          <p className="reveal mt-10 inline-flex rounded-[18px] rounded-br-md bg-button px-5 py-3 text-lg text-button-ink">
            «Quiero hacer una transferencia»
          </p>
          <div className="mt-14">
            <JourneyTimeline steps={mykeJourneySteps} />
          </div>
          <p className="mt-12 max-w-[70ch] text-sm leading-relaxed text-ink-muted">
            Myke organiza la interacción y prepara el recorrido; no mueve fondos por sí solo. La gestión continúa únicamente mediante las funciones y los procesos que la entidad haya habilitado.
          </p>
        </div>
      </section>

      <section aria-labelledby="adapt-title" className="border-t border-line py-24 md:py-32">
        <div className="site-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro
              id="adapt-title"
              title="Una base común, adaptada a cada realidad."
              description="Cada banco tiene una identidad, una oferta y una forma propia de atender a sus clientes. Myke se ajusta al lenguaje, la presentación, los servicios y los mercados que la entidad configure."
            />
            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              La configuración concreta depende de las necesidades, los servicios disponibles y las decisiones de cada institución.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {mykeBenefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <details
                  key={benefit.title}
                  className="group border-b border-line first:border-t"
                  open={index === 0}
                >
                  <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <Icon aria-hidden="true" size={24} weight="duotone" className="shrink-0 text-accent-ink" />
                    <span className="flex-1 text-xl font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent-ink">
                      {benefit.title}
                    </span>
                    <Plus
                      aria-hidden="true"
                      size={18}
                      className="shrink-0 text-ink-muted transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-[52ch] pb-6 pl-10 leading-relaxed text-ink-soft">{benefit.description}</p>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="myke-cta-title" className="pb-24 md:pb-32">
        <div className="site-container">
          <div className="reveal flex flex-col items-start gap-8 rounded-[20px] border border-line bg-raised px-7 py-14 md:items-center md:px-14 md:py-20 md:text-center">
            <h2
              id="myke-cta-title"
              className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl"
            >
              Conozca cómo Myke puede integrarse a su experiencia digital.
            </h2>
            <p className="max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              Conversemos sobre los servicios y procesos que su institución desea acercar a sus clientes mediante una interacción más natural.
            </p>
            <ActionLink href="/contact">Hablar con Nyvora</ActionLink>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(productSchema) }}
      />
    </>
  );
}
