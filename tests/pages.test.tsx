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
    [MykePage, "Myke", /enterprise conversational banking platform/i],
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

  it("explains Myke through concrete, conditional use cases", () => {
    render(<MykePage />);

    [
      "Consultar información",
      "Comprender movimientos",
      "Preparar solicitudes",
      "Encontrar el siguiente paso",
    ].forEach((capability) => {
      expect(screen.getByRole("heading", { level: 3, name: capability })).toBeInTheDocument();
    });
    expect(screen.getByText(/no sustituye las decisiones, autorizaciones ni canales/i)).toBeInTheDocument();
  });
});
