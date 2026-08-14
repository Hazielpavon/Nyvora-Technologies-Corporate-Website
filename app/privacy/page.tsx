import type { Metadata } from "next";
import { LegalPage } from "@/components/Primitives";
import { createPageMetadata, SITE } from "@/lib/site";

// REVISIÓN JURÍDICA PENDIENTE: confirmar entidad responsable, bases jurídicas,
// derechos aplicables, proveedores, transferencias y criterios de conservación.
export const metadata: Metadata = createPageMetadata({
  title: "Aviso de privacidad del sitio web",
  description:
    "Aviso inicial sobre el posible tratamiento de consultas e información técnica básica en el sitio web corporativo de Nyvora Technologies.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal / Privacidad del sitio web"
      title="Aviso de privacidad del sitio web"
      intro="Este aviso explica cómo Nyvora Technologies podría tratar información personal relacionada con este sitio web corporativo y con los mensajes que usted decida enviar por correo electrónico desde Contact."
    >
      <section id="scope">
        <h2>1. Alcance</h2>
        <p>
          Este aviso se aplica únicamente al sitio web corporativo de Nyvora Technologies y a las consultas relacionadas con él. No regula el tratamiento de información en una eventual implementación de Nyvora Myke para una institución. Dicho tratamiento se regiría por los acuerdos, avisos y responsabilidades definidos para cada implementación.
        </p>
      </section>

      <section id="information">
        <h2>2. Información que podríamos tratar</h2>
        <p>
          El sitio no procesa ni almacena directamente los campos del formulario. Contact prepara un borrador en la aplicación de correo del visitante. La información solo se remite a Nyvora cuando la persona decide enviar ese correo; en ese momento podríamos recibir su nombre, organización, dirección de correo, motivo de contacto y mensaje.
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
          La entrega, recepción y almacenamiento de los mensajes puede involucrar a los servicios de correo utilizados por el remitente y por Nyvora, sujetos a las condiciones que correspondan. También podríamos facilitar información a proveedores que apoyen el alojamiento, la seguridad o las comunicaciones empresariales, o divulgarla cuando lo exija la ley o sea razonablemente necesario para proteger derechos, integridad o seguridad.
        </p>
        <p>
          Los proveedores definitivos no se han confirmado para todas las funciones. Este aviso deberá actualizarse antes de conectar un envío directo desde el sitio, una herramienta de analítica, un sistema de gestión de relaciones o cualquier otro servicio adicional que trate datos.
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
          Nuestra intención es conservar la información solo durante el tiempo razonablemente necesario para los fines descritos, incluidas las necesidades legales, de seguridad y de registro que resulten aplicables. La conservación podrá variar según el tipo de registro. Los plazos específicos deberán definirse cuando se confirmen el flujo de datos y los proveedores de producción.
        </p>
      </section>

      <section id="security">
        <h2>7. Seguridad</h2>
        <p>
          Las medidas aplicables dependerán de la información tratada y de los servicios que finalmente se utilicen. Antes de publicar el sitio, estas medidas y su descripción deberán revisarse junto con el flujo de datos confirmado.
        </p>
      </section>

      <section id="rights">
        <h2>8. Sus opciones y derechos</h2>
        <p>
          Según la legislación aplicable, usted podría tener derechos sobre su información personal, como solicitar acceso, corrección, eliminación o limitación, u oponerse a determinados tratamientos. Para formular una solicitud, escriba a <a href={`mailto:${SITE.emails.privacy}?subject=Solicitud%20de%20privacidad`}>{SITE.emails.privacy}</a>. Podría ser necesario verificar la identidad de la persona solicitante.
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
          Para consultas o solicitudes relacionadas con privacidad, escriba a <a href={`mailto:${SITE.emails.privacy}?subject=Solicitud%20de%20privacidad`}>{SITE.emails.privacy}</a>. Nyvora Technologies, {SITE.location}.
        </p>
        <p>
          La revisión jurídica deberá confirmar la entidad legal responsable, las bases jurídicas aplicables, los derechos de los visitantes según su ubicación, las salvaguardas para transferencias internacionales, los criterios de conservación y el procedimiento aplicable a las solicitudes de privacidad.
        </p>
      </section>
    </LegalPage>
  );
}
