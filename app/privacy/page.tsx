import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/Primitives";
import { createPageMetadata, SITE } from "@/lib/site";

// LEGAL REVIEW PENDING: confirm the responsible entity, legal bases,
// applicable rights, providers, transfers, and retention criteria.
export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Aviso de privacidad del sitio web",
    description:
      "Aviso inicial sobre el tratamiento de consultas e información técnica básica en el sitio web corporativo de Nyvora Technologies.",
    path: "/privacy",
  }),
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal / Privacidad del sitio web"
      title="Aviso de privacidad del sitio web"
      intro="Este aviso explica cómo Nyvora Technologies trata información personal relacionada con este sitio web corporativo y con las consultas enviadas mediante Contacto."
    >
      <section id="scope">
        <h2>1. Alcance</h2>
        <p>
          Este aviso se aplica únicamente al sitio web corporativo de Nyvora Technologies y a las consultas relacionadas con él. No regula el tratamiento de información en una eventual implementación de Nyvora Myke para una institución. Dicho tratamiento se regiría por los acuerdos, avisos y responsabilidades definidos para cada implementación.
        </p>
      </section>

      <section id="information">
        <h2>2. Información que podemos tratar</h2>
        <p>
          Cuando usted envía una consulta mediante Contacto, el sitio transmite a Nyvora el nombre, la organización, la dirección de correo, el motivo de contacto, el asunto y el mensaje que haya proporcionado. El formulario no solicita credenciales, información financiera ni registros de clientes.
        </p>
        <p>
          La infraestructura de alojamiento y seguridad del sitio podría tratar datos técnicos básicos, como la dirección IP, información del navegador o dispositivo, páginas solicitadas, marcas de tiempo y registros de diagnóstico o seguridad. Los datos concretos dependerán de la configuración y de los proveedores que finalmente se seleccionen.
        </p>
      </section>

      <section id="purposes">
        <h2>3. Cómo podríamos utilizar la información</h2>
        <p>Podríamos utilizar la información para:</p>
        <ul>
          <li>Atender y dirigir consultas</li>
          <li>Operar, proteger y diagnosticar problemas del sitio web</li>
          <li>Mantener los registros empresariales que resulten pertinentes</li>
          <li>Cumplir la legislación aplicable o proteger derechos y seguridad</li>
        </ul>
      </section>

      <section id="providers">
        <h2>4. Proveedores de servicios y divulgación</h2>
        <p>
          Vercel proporciona el alojamiento y la función que recibe la consulta. Resend presta el servicio de entrega transaccional que dirige el mensaje al canal correspondiente de Nyvora. Google Workspace proporciona el correo corporativo en el que se recibe y gestiona la consulta. Estos proveedores pueden tratar la información y los datos técnicos necesarios para prestar sus servicios, sujetos a sus condiciones y a los acuerdos aplicables.
        </p>
        <p>
          Nyvora también podría divulgar información cuando lo exija la ley o cuando sea razonablemente necesario para proteger derechos, integridad o seguridad. Este aviso deberá actualizarse antes de incorporar analítica, un sistema de gestión de relaciones u otro servicio adicional que trate datos.
        </p>
      </section>

      <section id="transfers">
        <h2>5. Tratamiento internacional</h2>
        <p>
          Es posible que determinados proveedores o destinatarios traten información en un país distinto de aquel donde se recopiló. Cuando la legislación aplicable exija salvaguardas para una transferencia internacional, la versión revisada de este aviso deberá identificar el mecanismo correspondiente.
        </p>
      </section>

      <section id="retention">
        <h2>6. Conservación</h2>
        <p>
          Nyvora no mantiene una base de datos separada de consultas dentro del sitio. Los proveedores que intervienen en la transmisión pueden conservar registros técnicos conforme a su configuración y condiciones, y los mensajes pueden permanecer en el buzón corporativo durante el tiempo razonablemente necesario para atenderlos y cumplir necesidades legales, de seguridad o de registro. No se publica un plazo fijo hasta completar la revisión jurídica y operativa correspondiente.
        </p>
      </section>

      <section id="security">
        <h2>7. Seguridad</h2>
        <p>
          El formulario transmite la consulta al sitio mediante HTTPS y limita los datos y el tamaño de los mensajes aceptados. Ningún método de transmisión o almacenamiento puede garantizarse como completamente seguro. Las medidas y su descripción deberán revisarse junto con el flujo de datos de producción.
        </p>
      </section>

      <section id="rights">
        <h2>8. Sus opciones y derechos</h2>
        <p>
          Según la legislación aplicable, usted podría tener derechos sobre su información personal, como solicitar acceso, corrección, eliminación o limitación, u oponerse a determinados tratamientos. Para formular una solicitud, use <Link href="/contact">Contacto</Link>, seleccione «Privacidad» e indique el contexto necesario. El canal se dirige a {SITE.emails.privacy}. Podría ser necesario verificar la identidad de la persona solicitante.
        </p>
      </section>

      <section id="updates">
        <h2>9. Actualizaciones de este aviso</h2>
        <p>
          Podríamos actualizar este aviso cuando cambien el sitio web, los proveedores o los requisitos legales. La fecha de vigencia indicada arriba identifica la versión vigente. Cualquier cambio material en producción deberá reflejarse aquí antes de habilitarse.
        </p>
      </section>

      <section id="contact">
        <h2>10. Contacto</h2>
        <p>
          Para consultas o solicitudes relacionadas con privacidad, use <Link href="/contact">Contacto</Link> y seleccione «Privacidad». El mensaje se dirige a {SITE.emails.privacy}. Nyvora Technologies, {SITE.location}.
        </p>
        <p>
          La revisión jurídica deberá confirmar la entidad legal responsable, las bases jurídicas aplicables, los derechos de los visitantes según su ubicación, las salvaguardas para transferencias internacionales, los criterios de conservación y el procedimiento aplicable a las solicitudes de privacidad.
        </p>
      </section>
    </LegalPage>
  );
}
