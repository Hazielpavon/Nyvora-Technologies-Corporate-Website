import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/Primitives";
import { createPageMetadata, SITE } from "@/lib/site";

// LEGAL REVIEW PENDING: confirm intellectual property, exclusions,
// liability limits, applicable law, venue, and dispute terms.
export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Términos de uso del sitio web",
    description:
      "Términos iniciales para el uso informativo del sitio web corporativo de Nyvora Technologies.",
    path: "/terms",
  }),
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal / Uso del sitio web"
      title="Términos de uso del sitio web"
      intro="Este documento preliminar regula el acceso y el uso informativo del sitio web corporativo de Nyvora Technologies. No constituye un acuerdo empresarial sobre productos ni una licencia."
    >
      <section id="agreement">
        <h2>1. Aceptación</h2>
        <p>
          Estos términos regulan el acceso y el uso del sitio web corporativo de Nyvora Technologies. Al utilizarlo, usted acepta estos términos. Si no está de acuerdo con ellos, no utilice el sitio.
        </p>
      </section>

      <section id="purpose">
        <h2>2. Finalidad del sitio web</h2>
        <p>
          El sitio ofrece información general de carácter corporativo y sobre productos. Su contenido es meramente descriptivo y no constituye asesoría financiera, jurídica, de inversión, regulatoria, de seguridad ni de otra naturaleza profesional.
        </p>
      </section>

      <section id="no-offer">
        <h2>3. Ausencia de oferta o acuerdo empresarial</h2>
        <p>
          Nada de lo publicado en este sitio constituye, por sí solo, una oferta, un compromiso o un contrato independiente sobre un producto o servicio. La disponibilidad, el alcance, las capacidades, la implementación, el soporte y las condiciones comerciales solo podrán establecerse mediante un acuerdo escrito suscrito por representantes autorizados.
        </p>
        <p>
          Estos términos del sitio web no son la licencia de Nyvora Myke, un acuerdo de servicios empresariales ni un acuerdo de implementación específico para una institución.
        </p>
      </section>

      <section id="intellectual-property">
        <h2>4. Propiedad intelectual</h2>
        <p>
          Salvo que se indique lo contrario, el sitio y sus textos, diseños, gráficos, software, nombres y signos originales se consideran propiedad de Nyvora Technologies o utilizados bajo licencia, sujetos a la confirmación jurídica correspondiente y a la legislación aplicable. No se otorga ningún derecho distinto del acceso y uso limitados del sitio conforme a estos términos.
        </p>
        <p>
          La titularidad y la situación registral de los nombres Nyvora y Myke deberán ser confirmadas por asesoría jurídica antes de la publicación en producción.
        </p>
      </section>

      <section id="permitted-use">
        <h2>5. Uso permitido</h2>
        <p>
          Puede utilizar el sitio con fines lícitos de información y evaluación empresarial. No puede interferir con su funcionamiento o seguridad, intentar obtener acceso no autorizado, introducir código dañino, atribuirse falsamente una relación con Nyvora Technologies ni utilizar el contenido en contravención de la legislación aplicable o de derechos de terceros.
        </p>
      </section>

      <section id="product-information">
        <h2>6. Información sobre productos</h2>
        <p>
          Las descripciones de productos son generales y pueden cambiar. La disponibilidad y el alcance de cualquier función se establecerán únicamente en el acuerdo escrito que corresponda. El contenido del sitio no constituye una certificación, una aprobación regulatoria ni un compromiso de disponibilidad.
        </p>
      </section>

      <section id="external-links">
        <h2>7. Enlaces externos</h2>
        <p>
          Podrían incluirse enlaces a sitios de terceros por conveniencia. Nyvora Technologies no controla esos sitios, y sus contenidos, prácticas de privacidad y términos se aplican de forma independiente.
        </p>
      </section>

      <section id="disclaimers">
        <h2>8. Disponibilidad y exclusiones</h2>
        <p>
          El sitio se proporciona con fines informativos generales y podría cambiar, contener errores o no estar disponible. En la medida permitida por la legislación aplicable, no se garantiza que el contenido descriptivo sea completo, esté actualizado o resulte adecuado para un fin particular. Los derechos que legalmente no puedan excluirse no se verán afectados.
        </p>
        <p>
          Esta sección requiere redacción aprobada por asesoría jurídica antes de la publicación en producción y no sustituye las condiciones de garantía que pudieran establecerse en un acuerdo empresarial firmado.
        </p>
      </section>

      <section id="liability">
        <h2>9. Limitaciones razonables</h2>
        <p>
          Los visitantes no deberían basar exclusivamente en este sitio descriptivo una decisión financiera, jurídica, de seguridad, contratación o implementación. Cualquier limitación de responsabilidad que se pretenda hacer exigible deberá ser proporcional, adaptarse a la entidad legal responsable y a la legislación aplicable, y someterse a revisión jurídica antes de la publicación en producción.
        </p>
      </section>

      <section id="governing-law">
        <h2>10. Legislación aplicable y controversias</h2>
        <p>
          La legislación aplicable, el foro competente y cualquier procedimiento para resolver controversias aún no se han definido. Asesoría jurídica hondureña deberá revisar y completar esta sección antes de la publicación en producción.
        </p>
      </section>

      <section id="changes">
        <h2>11. Cambios</h2>
        <p>
          Podríamos actualizar estos términos mediante la publicación de una versión revisada y su fecha de vigencia. El uso continuado después de una actualización quedará sujeto a la versión revisada, en la medida permitida por la legislación aplicable.
        </p>
      </section>

      <section id="contact">
        <h2>12. Contacto</h2>
        <p>
          Para formular consultas sobre estos términos, use <Link href="/contact">Contacto</Link>, seleccione «Asuntos legales» y envíe su mensaje. El canal se dirige a {SITE.emails.legal}.
        </p>
      </section>
    </LegalPage>
  );
}
