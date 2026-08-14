export const navigation = [
  { href: "/", label: "Company" },
  { href: "/myke", label: "Myke" },
  { href: "/contact", label: "Contact" },
] as const;

export const companyPrinciples = [
  {
    number: "01",
    title: "Crear desde Honduras",
    description:
      "Desarrollamos tecnología desde nuestro país con la intención de aportar a su crecimiento y abrir nuevas posibilidades.",
  },
  {
    number: "02",
    title: "Resolver necesidades reales",
    description:
      "Buscamos que cada producto tenga una aplicación clara y sea útil para las personas y organizaciones que lo adopten.",
  },
  {
    number: "03",
    title: "Convertir complejidad en claridad",
    description:
      "Transformamos ideas y retos complejos en experiencias de software comprensibles, enfocadas y fáciles de utilizar.",
  },
  {
    number: "04",
    title: "Crecer con visión amplia",
    description:
      "Construimos una empresa con raíces hondureñas y una visión de crecimiento regional e internacional.",
  },
] as const;

export const mykeHeroFacts = [
  {
    label: "Qué es",
    value: "Una experiencia digital para interactuar con servicios bancarios mediante una conversación.",
  },
  {
    label: "Para quién",
    value: "Instituciones financieras y las personas que utilizan sus servicios.",
  },
  {
    label: "Qué aporta",
    value: "Ayuda a consultar información, comprender movimientos y preparar solicitudes con mayor claridad.",
  },
] as const;

export const mykeBenefits = [
  {
    title: "Conversaciones naturales",
    description:
      "Permite expresar necesidades bancarias con palabras cotidianas dentro de una experiencia conversacional.",
  },
  {
    title: "Experiencia adaptable",
    description:
      "Puede ajustarse a la identidad y a las necesidades definidas por cada institución financiera.",
  },
  {
    title: "Procesos más claros",
    description:
      "Ayuda a presentar información y preparar solicitudes de una forma más comprensible para las personas.",
  },
  {
    title: "Integración institucional",
    description:
      "Funciona junto con los servicios y capacidades que cada institución decida habilitar.",
  },
] as const;

export const mykeCapabilities = [
  {
    title: "Consultar información",
    description:
      "Permite formular preguntas con palabras cotidianas y recibir la información que la institución haya habilitado dentro de la experiencia.",
  },
  {
    title: "Comprender movimientos",
    description:
      "Ayuda a presentar conceptos, fechas y referencias de forma ordenada para facilitar la interpretación de la información disponible.",
  },
  {
    title: "Preparar solicitudes",
    description:
      "Acompaña la recopilación de los datos necesarios y ayuda a identificar información pendiente antes de continuar con una solicitud.",
  },
  {
    title: "Encontrar el siguiente paso",
    description:
      "Orienta a la persona hacia las opciones disponibles o hacia el canal correspondiente cuando una gestión requiere atención de la institución.",
  },
] as const;
