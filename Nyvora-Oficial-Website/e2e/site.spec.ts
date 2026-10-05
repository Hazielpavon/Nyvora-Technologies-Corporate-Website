import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const contentRoutes = ["/", "/myke", "/contact", "/privacy", "/terms"] as const;
const viewports = [
  { width: 320, height: 720 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
] as const;

function captureCriticalConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("critical routes render with one primary heading and no console failures", async ({ page }) => {
  const consoleErrors = captureCriticalConsoleErrors(page);

  for (const route of contentRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), route).toHaveCount(1);
  }

  expect(consoleErrors).toEqual([]);
});

test("primary navigation works on desktop and mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const desktopNavigation = page.getByRole("navigation", { name: "Navegación principal" });
  await expect(desktopNavigation.getByRole("link")).toHaveCount(3);
  await desktopNavigation.getByRole("link", { name: "Myke" }).click();
  await expect(page).toHaveURL(/\/myke$/);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: /navegación/ });
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  const mobileNavigation = page.getByRole("navigation", { name: "Navegación principal" });
  await expect(mobileNavigation.getByRole("link", { name: "Company" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("main content stays inside all required viewport widths", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const route of ["/", "/myke", "/contact"] as const) {
      await page.goto(route);
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(hasHorizontalOverflow, `${route} at ${viewport.width}px`).toBe(false);
    }
  }
});

test("contact validation is accessible and a mocked delivery submits only once", async ({ page }) => {
  let requests = 0;
  let submittedBody: Record<string, unknown> | undefined;
  await page.route("**/api/contact", async (route) => {
    requests += 1;
    submittedBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/contact");
  const submit = page.getByRole("button", { name: "Enviar mensaje" });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByLabel("Nombre")).toBeFocused();
  await expect(page.getByText(/revise los campos señalados/i)).toBeVisible();
  expect(requests).toBe(0);

  await page.getByLabel("Nombre").fill("Persona de prueba");
  await page.getByLabel("Organización").fill("Institución de ejemplo");
  await page.getByLabel("Correo").fill("persona@example.org");
  await page.getByLabel("Motivo de contacto").selectOption("myke");
  await page.getByLabel("Asunto").fill("Consulta institucional sobre Myke");
  await page.getByLabel("Mensaje").fill(
    "Queremos conocer el alcance general de Myke para nuestra institución.",
  );
  await page.getByRole("checkbox", { name: /aviso de privacidad/i }).check();

  await submit.dblclick();
  await expect(page.getByText(/aceptado para envío/i)).toBeVisible();
  expect(requests).toBe(1);
  expect(submittedBody).toMatchObject({ reason: "myke", consent: true });
  expect(submittedBody).not.toHaveProperty("recipient");
  expect(submittedBody).not.toHaveProperty("apiKey");
  await expect(page.getByLabel("Nombre")).toHaveValue("");
});

test("draft legal pages are noindex and unknown routes return the custom 404", async ({ page }) => {
  for (const route of ["/privacy", "/terms"] as const) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
    await expect(page.getByText("Borrador", { exact: true })).toBeVisible();
  }

  const response = await page.goto("/route-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No encontramos esta página.");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("important routes have no automated WCAG A or AA violations in light and dark mode", async ({ page }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const route of ["/", "/myke", "/contact", "/privacy"] as const) {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations, `${route} (${colorScheme})`).toEqual([]);
    }
  }
});

test("the official logo follows the visitor's color scheme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const brand = page.getByRole("link", { name: /Nyvora Technologies, página principal/i }).first();
  await expect(brand.locator("img.logo-on-light")).toBeVisible();
  await expect(brand.locator("img.logo-on-dark")).toBeHidden();

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(brand.locator("img.logo-on-dark")).toBeVisible();
  await expect(brand.locator("img.logo-on-light")).toBeHidden();
});

test("unsupported contact methods are rejected", async ({ request }) => {
  const response = await request.get("/api/contact");
  expect(response.status()).toBe(405);
  expect(response.headers()["cache-control"]).toContain("no-store");
});
