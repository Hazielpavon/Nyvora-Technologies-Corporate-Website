import {
  Check,
  Compass,
  Lightbulb,
  MapPin,
  Target,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ChatPreview } from "@/components/ChatPreview";
import { HeroVisual } from "@/components/HeroVisual";
import { ActionLink, SectionIntro } from "@/components/Primitives";
import { companyPrinciples, mykeBenefits } from "@/content";
import { createPageMetadata, SITE } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Tecnología creada en Honduras",
    description:
      "Nyvora Technologies es una startup hondureña que desarrolla soluciones de software modernas, útiles y con potencial regional e internacional.",
    path: "/",
  }),
  title: "Nyvora Technologies | Tecnología creada en Honduras",
};

const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

const [fromHonduras, realNeeds, clarity, broadVision] = companyPrinciples;

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="home-title" className="overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16">
        <div className="site-container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h1
              id="home-title"
              className="rise text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.75rem]"
            >
              Tecnología creada en Honduras{" "}
              <span className="text-ink-muted">para construir nuevas posibilidades.</span>
            </h1>
            <p
              className="rise mt-7 max-w-[46ch] text-lg leading-relaxed text-ink-soft md:text-xl"
              style={stagger(1)}
            >
              Somos una startup hondureña que desarrolla software moderno y útil, con potencial regional e internacional.
            </p>
            <div className="rise mt-10 flex flex-wrap gap-3" style={stagger(2)}>
              <ActionLink href="/myke">Conocer Myke</ActionLink>
              <ActionLink href="/contact" variant="secondary">
                Hablar con Nyvora
              </ActionLink>
            </div>
          </div>
          <div className="rise lg:col-span-5" style={stagger(2)}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section aria-labelledby="purpose-title" className="py-20 md:py-28">
        <div className="site-container">
          <SectionIntro
            id="purpose-title"
            eyebrow="Nuestro propósito"
            title="Crear tecnología útil desde Honduras."
            description="Nyvora busca aportar al desarrollo tecnológico del país mediante productos de software claros, modernos y preparados para evolucionar."
          />

          <ul className="mt-14 grid gap-4 md:grid-cols-12 md:gap-5">
            <li className="reveal relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[20px] bg-accent-wash p-7 md:col-span-7 md:row-span-2 md:p-10">
              <MapPin aria-hidden="true" size={40} weight="duotone" className="text-accent-ink" />
              <div className="mt-16">
                <p className="font-mono text-sm text-accent-ink">{SITE.location}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                  {fromHonduras.title}
                </h3>
                <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
                  {fromHonduras.description}
                </p>
              </div>
            </li>
            <li className="reveal rounded-[20px] border border-line bg-raised p-7 md:col-span-5">
              <Target aria-hidden="true" size={28} weight="duotone" className="text-accent-ink" />
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">{realNeeds.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{realNeeds.description}</p>
            </li>
            <li className="reveal rounded-[20px] border border-line bg-raised p-7 md:col-span-5">
              <Lightbulb aria-hidden="true" size={28} weight="duotone" className="text-accent-ink" />
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">{clarity.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{clarity.description}</p>
            </li>
            <li className="reveal relative isolate min-h-64 overflow-hidden rounded-[20px] bg-[#050b14] p-7 md:col-span-12 md:p-10">
              <Image
                src="/brand/hero-signal.webp"
                alt=""
                fill
                sizes="100vw"
                className="-z-10 object-cover object-[50%_70%] opacity-80"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-r from-[#050b14] via-[#050b14]/85 to-[#050b14]/10"
              />
              <Compass aria-hidden="true" size={28} weight="duotone" className="text-[#62d4f7]" />
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#ebf1f7]">{broadVision.title}</h3>
              <p className="mt-3 max-w-[48ch] leading-relaxed text-[#c3cfdc]">{broadVision.description}</p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="vision-title" className="border-y border-line bg-surface py-24 md:py-32">
        <div className="site-container">
          <h2
            id="vision-title"
            className="reveal max-w-5xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-6xl lg:text-7xl"
          >
            Ideas complejas convertidas en productos claros.
          </h2>
          <div className="mt-14 grid gap-8 border-t border-line pt-10 text-lg leading-relaxed text-ink-soft md:grid-cols-2 md:gap-14">
            <p className="reveal">
              Desarrollamos soluciones con una aplicación concreta y una experiencia comprensible. Nos interesa que la tecnología resuelva necesidades reales, no que añada complejidad innecesaria.
            </p>
            <p className="reveal">
              Myke es nuestro producto principal en esta etapa, pero Nyvora nace para crear distintas soluciones y explorar nuevas oportunidades con el tiempo.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="myke-title" className="py-24 md:py-32">
        <div className="site-container grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-5" translate="no">Nyvora Myke</p>
            <h2
              id="myke-title"
              className="text-3xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl"
            >
              Una experiencia conversacional para la banca digital.
            </h2>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              Myke ayuda a acercar servicios bancarios a las personas mediante conversaciones naturales y una experiencia adaptable a cada institución financiera.
            </p>
            <ul
              className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2"
              aria-label="Beneficios generales de Myke"
            >
              {mykeBenefits.map((benefit) => (
                <li key={benefit.title} className="flex items-center gap-3 text-ink">
                  <Check aria-hidden="true" size={18} weight="bold" className="shrink-0 text-accent-ink" />
                  {benefit.title}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <ActionLink href="/myke">Conocer Myke</ActionLink>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <ChatPreview />
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="pb-24 md:pb-32">
        <div className="site-container">
          <div className="reveal flex flex-col items-start gap-8 rounded-[20px] border border-line bg-raised px-7 py-14 md:items-center md:px-14 md:py-20 md:text-center">
            <h2
              id="cta-title"
              className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl"
            >
              Conversemos sobre nuevas posibilidades.
            </h2>
            <p className="max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              Si desea conocer más sobre Nyvora Technologies, Myke o una posible colaboración, comparta el contexto de su interés.
            </p>
            <ActionLink href="/contact">Hablar con Nyvora</ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
