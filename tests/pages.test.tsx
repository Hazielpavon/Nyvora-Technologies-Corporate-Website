import { access } from "node:fs/promises";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactPage from "@/app/contact/page";
import HomePage from "@/app/page";
import MykePage from "@/app/myke/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";

describe("critical page rendering", () => {
  const pages = [
    [
      HomePage,
      "Tecnología creada en Honduras para construir nuevas posibilidades.",
      /enterprise intelligence for modern financial institutions/i,
    ],
    [
      MykePage,
      "La banca digital empieza por lo que la persona necesita.",
      /enterprise conversational banking platform/i,
    ],
    [ContactPage, "Un solo punto de contacto.", /start a conversation/i],
    [PrivacyPage, /aviso de privacidad del sitio web/i, /website privacy notice/i],
    [TermsPage, /términos de uso del sitio web/i, /website terms of use/i],
  ] as const;

  it.each(pages)("renders Spanish-first content and one accessible h1", (Page, name, retiredHeading) => {
    const { container } = render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.queryByText(retiredHeading)).not.toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/@nyvoratechnologies\.com\.test-|security@nyvoratechnologies\.com/i);
  });

  it("routes public contact contexts through the website without mailto links", () => {
    const contact = render(<ContactPage />);
    expect(contact.container).toHaveTextContent("contact@nyvoratechnologies.com");
    expect(contact.container).toHaveTextContent("support@nyvoratechnologies.com");
    expect(contact.container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    contact.unmount();

    const privacy = render(<PrivacyPage />);
    expect(privacy.container).toHaveTextContent("privacy@nyvoratechnologies.com");
    expect(privacy.container.querySelector('a[href="/contact"]')).toBeInTheDocument();
    expect(privacy.container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    privacy.unmount();

    const terms = render(<TermsPage />);
    expect(terms.container).toHaveTextContent("legal@nyvoratechnologies.com");
    expect(terms.container.querySelector('a[href="/contact"]')).toBeInTheDocument();
    expect(terms.container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    terms.unmount();
  });

  it("does not expose a public Support route", async () => {
    await expect(
      access(new URL("../app/support/page.tsx", import.meta.url)),
    ).rejects.toThrow();
  });

  it("presents the company location on Company", () => {
    render(<HomePage />);

    expect(screen.getAllByText(/Tegucigalpa, Honduras/i).length).toBeGreaterThan(0);
  });

  it("explains Myke through a clear, conditional institutional narrative", () => {
    const { container } = render(<MykePage />);

    expect(
      Array.from(container.querySelectorAll("dt"), (term) => term.textContent),
    ).toEqual(["Qué es", "Para quién", "Qué cambia"]);

    expect(
      screen.getAllByText(/^0[1-5] \/ /).map((label) => label.textContent),
    ).toEqual([
      "01 / El punto de partida",
      "02 / Qué hace Myke",
      "03 / Junto a la banca existente",
      "04 / Del lenguaje a una acción comprensible",
      "05 / Diseñado para diferentes instituciones",
    ]);

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      "Primero la necesidad. Después, el camino.",
      "Una conversación para consultar, comprender y avanzar.",
      "Una capa conversacional que convive con la banca digital existente.",
      "De una solicitud amplia a un siguiente paso claro.",
      "Una base común, adaptada a cada realidad.",
      "Conozca cómo Myke puede integrarse a su experiencia digital.",
    ]);

    [
      "Consultar información",
      "Comprender movimientos",
      "Explorar y preparar",
      "Continuar con orientación",
    ].forEach((capability) => {
      expect(screen.getByRole("heading", { level: 3, name: capability })).toBeInTheDocument();
    });

    expect(container).toHaveTextContent("¿Cuánto tengo disponible?");
    expect(container).toHaveTextContent("Quiero hacer una transferencia");
    expect(container).toHaveTextContent(/no pretende sustituir los sistemas centrales/i);
    expect(container).toHaveTextContent(/el control permanece en la institución/i);
    expect(container).toHaveTextContent(/no mueve fondos por sí solo/i);
    expect(container).toHaveTextContent(/depende de la información, los servicios y los procesos habilitados/i);
    expect(screen.getByRole("link", { name: /hablar con nyvora/i })).toHaveAttribute("href", "/contact");

    expect(container.textContent).not.toMatch(
      /(?:ROI|24\/7|bank-grade|military-grade|cero fraude|automatización total|revolucionario|disruptivo|game changer|OpenAI|Gemini|Ollama|Qwen|ConversationService|OperationService|BankAttempt|idempotencia|outbox|confidence score)/i,
    );
  });
});
