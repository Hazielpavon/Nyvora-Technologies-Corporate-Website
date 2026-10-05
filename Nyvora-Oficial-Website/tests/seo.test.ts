import { describe, expect, it } from "vitest";
import RootLayout, { metadata as rootMetadata } from "@/app/layout";
import { metadata as notFoundMetadata } from "@/app/not-found";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as mykeMetadata } from "@/app/myke/page";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as termsMetadata } from "@/app/terms/page";
import { SITE } from "@/lib/site";
import { serializeStructuredData } from "@/lib/structured-data";

describe("technical SEO", () => {
  const publicMetadata = [
    ["/", homeMetadata, /Nyvora Technologies|Tecnología/i],
    ["/myke", mykeMetadata, /Myke/i],
    ["/contact", contactMetadata, /Contacto/i],
    ["/privacy", privacyMetadata, /Privacidad/i],
    ["/terms", termsMetadata, /Términos de uso/i],
  ] as const;

  it("publishes only indexable corporate routes in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([
      SITE.url,
      `${SITE.url}/myke`,
      `${SITE.url}/contact`,
    ]);
    expect(urls).not.toContain(`${SITE.url}/privacy`);
    expect(urls).not.toContain(`${SITE.url}/terms`);
    expect(urls).not.toContain(`${SITE.url}/architecture`);
    expect(urls).not.toContain(`${SITE.url}/security`);
    expect(urls).not.toContain(`${SITE.url}/company`);
    expect(urls).not.toContain(`${SITE.url}/support`);
  });

  it("uses the production domain and a canonical for every public page", () => {
    expect(robots().sitemap).toBe(`${SITE.url}/sitemap.xml`);
    expect(robots().host).toBe(SITE.url);
    publicMetadata.forEach(([path, metadata]) => {
      expect(metadata.alternates?.canonical).toBe(path);
    });
  });

  it("declares Spanish document and corporate metadata", () => {
    const layout = RootLayout({ children: null });
    const serializedLayout = JSON.stringify(layout);
    expect(layout.props.lang).toBe("es");
    expect(JSON.stringify(rootMetadata.title)).toContain("Nyvora Technologies");
    expect(rootMetadata.description).toMatch(/\b(empresa|software|tecnología|instituciones|Honduras)\b/i);
    expect(rootMetadata.openGraph?.locale).toBe("es_HN");
    expect(JSON.stringify(rootMetadata)).not.toMatch(/enterprise software for financial institutions/i);
    expect(serializedLayout).toContain(SITE.emails.contact);
    expect(serializedLayout).toContain(SITE.emails.support);
    expect(serializedLayout).not.toMatch(/@nyvoratechnologies\.com\.test-/i);
  });

  it("uses Spanish metadata and the corporate social card on public pages", () => {
    publicMetadata.forEach(([, metadata, expectedTitle]) => {
      expect(JSON.stringify(metadata.title)).toMatch(expectedTitle);
      expect(metadata.description).toMatch(/\b(de|para|con|la|el|una|instituciones)\b/i);
      expect(JSON.stringify(metadata.openGraph?.images)).toContain("/og-es.png");
    });
  });

  it("keeps legal drafts out of search indexes until legal review", () => {
    [privacyMetadata, termsMetadata].forEach((metadata) => {
      expect(metadata.robots).toMatchObject({ index: false, follow: true });
    });
  });

  it("does not attach home canonical or social metadata to the 404 response", () => {
    expect(rootMetadata.robots).toBeUndefined();
    expect(notFoundMetadata.robots).toBeUndefined();
    expect(notFoundMetadata.alternates?.canonical).toBeNull();
    expect(notFoundMetadata.openGraph).toBeNull();
    expect(notFoundMetadata.twitter).toBeNull();
  });

  it("escapes markup boundaries in JSON-LD payloads", () => {
    const unsafeValue = "</script><script>alert('x')</script>";
    const serialized = serializeStructuredData({ value: unsafeValue });

    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
    expect(JSON.parse(serialized)).toEqual({ value: unsafeValue });
  });
});
