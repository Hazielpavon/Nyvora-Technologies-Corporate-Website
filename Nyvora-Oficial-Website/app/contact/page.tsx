import { ChatsCircle, Lifebuoy, MapPin, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/Primitives";
import { createPageMetadata, SITE } from "@/lib/site";

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
        title="Un solo punto de contacto."
        intro="Consultas sobre Nyvora Technologies, Myke, oportunidades, alianzas y soporte, en un mismo lugar."
      />

      <section aria-label="Formulario y canales de contacto" className="pb-24 md:pb-32">
        <div className="site-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside
            className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9"
            aria-label="Información del canal de contacto"
          >
            <div>
              <ChatsCircle aria-hidden="true" size={26} weight="duotone" className="text-accent-ink" />
              <h2 className="mt-4 text-lg font-semibold text-ink">Consultas generales</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">
                Información sobre Nyvora, Myke, oportunidades comerciales y alianzas.
              </p>
              <p className="mt-3 break-all font-mono text-sm text-ink">{SITE.emails.contact}</p>
            </div>
            <div>
              <Lifebuoy aria-hidden="true" size={26} weight="duotone" className="text-accent-ink" />
              <h2 className="mt-4 text-lg font-semibold text-ink">Soporte</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">Ayuda relacionada con productos o servicios de Nyvora.</p>
              <p className="mt-3 break-all font-mono text-sm text-ink">{SITE.emails.support}</p>
            </div>
            <div>
              <MapPin aria-hidden="true" size={26} weight="duotone" className="text-accent-ink" />
              <h2 className="mt-4 text-lg font-semibold text-ink">Ubicación</h2>
              <address className="mt-2 not-italic text-ink-soft">{SITE.location}</address>
            </div>
            <div className="border-t border-line pt-8">
              <ShieldCheck aria-hidden="true" size={26} weight="duotone" className="text-accent-ink" />
              <h2 className="mt-4 text-lg font-semibold text-ink">Privacidad</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">
                Conozca cómo se trata la información compartida mediante el sitio.
              </p>
              <Link
                className="mt-3 inline-block text-accent-ink underline underline-offset-4"
                href="/privacy"
              >
                Aviso de privacidad
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
