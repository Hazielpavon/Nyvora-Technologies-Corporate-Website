import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";
import { serializeStructuredData } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Nyvora Technologies | Tecnología creada en Honduras",
    template: "%s | Nyvora Technologies",
  },
  description: SITE.description,
  applicationName: SITE.name,
  category: "tecnología",
  keywords: [
    "Nyvora Technologies",
    "startup tecnológica hondureña",
    "desarrollo de software Honduras",
    "soluciones de software",
    "Nyvora Myke",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_HN",
    url: "/",
    siteName: SITE.name,
    title: "Nyvora Technologies | Tecnología creada en Honduras",
    description: SITE.description,
    images: [
      {
        url: "/og-es.png",
        width: 1732,
        height: 908,
        alt: "Nyvora Technologies. Tecnología creada en Honduras.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyvora Technologies | Tecnología creada en Honduras",
    description: SITE.description,
    images: ["/og-es.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#070d17" },
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  email: SITE.emails.contact,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "general inquiries",
      email: SITE.emails.contact,
      availableLanguage: ["es"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.emails.support,
      availableLanguage: ["es"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tegucigalpa",
    addressCountry: "HN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-[100dvh]">
        <a className="skip-link" href="#main-content">
          Ir al contenido principal
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeStructuredData(organizationSchema) }}
        />
      </body>
    </html>
  );
}
