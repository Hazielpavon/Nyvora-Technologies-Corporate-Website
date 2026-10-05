import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

vi.mock("next/navigation", () => ({
  usePathname: () => "/myke",
}));

describe("corporate navigation", () => {
  it("renders only the three approved primary routes and marks the current page", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", {
      name: /navegación principal/i,
    });
    expect(navigation).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Myke" })).toHaveAttribute("aria-current", "page");
    const brand = screen.getByRole("link", { name: /Nyvora Technologies, página principal/i });
    expect(brand.querySelector("img")?.getAttribute("src")).toContain("logo-light.png");

    const expectedLinks = [
      ["Empresa", "/"],
      ["Myke", "/myke"],
      ["Contacto", "/contact"],
    ];

    expect(navigation.querySelectorAll("a")).toHaveLength(expectedLinks.length);
    expect(
      Array.from(navigation.querySelectorAll("a"), (link) => [
        link.textContent?.trim(),
        link.getAttribute("href"),
      ]),
    ).toEqual(expectedLinks);
    expect(navigation.querySelector('a[href="/architecture"]')).not.toBeInTheDocument();
    expect(navigation.querySelector('a[href="/security"]')).not.toBeInTheDocument();
    expect(navigation.querySelector('a[href="/company"]')).not.toBeInTheDocument();
    expect(navigation.querySelector('a[href="/support"]')).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Support" })).not.toBeInTheDocument();
  });

  it("supports opening and closing the mobile menu with Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", { hidden: true });
    expect(menuButton).toHaveTextContent(/abrir navegación/i);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(menuButton).toHaveTextContent(/cerrar navegación/i);
    await user.keyboard("{Escape}");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();
  });

  it("exposes legal routes and approved mailbox labels without launching an email client", () => {
    const { container } = render(<SiteFooter />);

    ["/privacy", "/terms"].forEach((href) => {
      expect(container.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
    });
    ["/architecture", "/security", "/company", "/support"].forEach((href) => {
      expect(container.querySelector(`a[href="${href}"]`)).not.toBeInTheDocument();
    });
    expect(container).toHaveTextContent("contact@nyvoratechnologies.com");
    expect(container).toHaveTextContent("support@nyvoratechnologies.com");
    expect(container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/@nyvoratechnologies\.com\.test-/i);
    const brand = screen.getByRole("link", { name: /Nyvora Technologies, página principal/i });
    expect(brand.querySelector("img")?.getAttribute("src")).toContain("logo-light.png");
  });
});
