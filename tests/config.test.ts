import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnvironment = { ...process.env };

async function loadHeaders(vercelEnvironment?: string) {
  vi.resetModules();
  if (vercelEnvironment) {
    process.env.VERCEL_ENV = vercelEnvironment;
  } else {
    delete process.env.VERCEL_ENV;
  }

  const config = (await import("../next.config")).default;
  return await config.headers!();
}

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.resetModules();
});

describe("production headers", () => {
  it("keeps the contact endpoint uncached and uses a static-compatible CSP", async () => {
    const rules = await loadHeaders();
    const apiRule = rules.find((rule) => rule.source === "/api/contact");
    const globalRule = rules.find((rule) => rule.source === "/(.*)");
    const csp = globalRule?.headers.find(
      (header) => header.key === "Content-Security-Policy",
    )?.value;

    expect(apiRule?.headers).toContainEqual({ key: "Cache-Control", value: "no-store" });
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(globalRule?.headers.some(
      (header) => header.key === "Strict-Transport-Security",
    )).toBe(false);
  });

  it("adds HSTS only to the Vercel production environment", async () => {
    const previewRules = await loadHeaders("preview");
    const productionRules = await loadHeaders("production");
    const getHsts = (rules: Awaited<ReturnType<typeof loadHeaders>>) => rules
      .find((rule) => rule.source === "/(.*)")
      ?.headers.find((header) => header.key === "Strict-Transport-Security");

    expect(getHsts(previewRules)).toBeUndefined();
    expect(getHsts(productionRules)).toEqual({
      key: "Strict-Transport-Security",
      value: "max-age=31536000",
    });
  });
});
