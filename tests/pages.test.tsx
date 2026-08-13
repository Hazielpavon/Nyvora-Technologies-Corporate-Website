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
    expect(container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/(?:support|security)@nyvoratechnologies\.com/i);
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
});
