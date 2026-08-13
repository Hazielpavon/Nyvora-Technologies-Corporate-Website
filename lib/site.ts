import type { Metadata } from "next";

export const SITE = {
  name: "Nyvora Technologies",
  productName: "Nyvora Myke",
  url: "https://nyvoratechnologies.com",
  description:
    "Startup tecnológica hondureña dedicada al desarrollo de soluciones de software modernas, útiles y con potencial regional e internacional.",
  location: "Tegucigalpa, Honduras",
  legalEffectiveDate: "2026-08-12",
  legalEffectiveDateLabel: "12 de agosto de 2026",
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_HN",
      url: path,
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description,
      images: [
        {
          url: "/og-es.png",
          width: 1732,
          height: 908,
          alt: "Nyvora Technologies — Tecnología creada en Honduras.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: ["/og-es.png"],
    },
  };
}
