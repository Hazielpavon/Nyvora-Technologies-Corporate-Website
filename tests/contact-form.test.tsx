import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/components/ContactForm";

async function completeForm(reason: "myke" | "support") {
  const user = userEvent.setup();
  render(<ContactForm />);

  await user.selectOptions(screen.getByLabelText("Motivo de contacto"), reason);
  await user.type(screen.getByLabelText("Nombre"), "Persona de prueba");
  await user.type(screen.getByLabelText("Organización"), "Institución de ejemplo");
  await user.type(screen.getByLabelText("Correo"), "persona@example.org");
  await user.type(
    screen.getByLabelText("Mensaje"),
    "Queremos conocer más sobre Nyvora y conversar sobre nuestras necesidades.",
  );
  await user.click(screen.getByRole("checkbox", { name: /aviso de privacidad/i }));

  return user;
}

describe("contact form", () => {
  it("shows the approved Spanish reasons and explains the email-draft flow", () => {
    const { container } = render(<ContactForm />);

    expect(screen.getByRole("note")).toHaveTextContent(/prepara un borrador/i);
    expect(screen.getByRole("note")).toHaveTextContent(/decida enviarlo/i);

    const reason = screen.getByLabelText("Motivo de contacto");
    const reasons = within(reason)
      .getAllByRole("option")
      .filter((option) => !(option as HTMLOptionElement).disabled)
      .map((option) => option.textContent?.trim() ?? "");

    expect(reasons).toEqual([
      "Información sobre Nyvora",
      "Información sobre Myke",
      "Oportunidades comerciales",
      "Alianzas",
      "Soporte",
      "Otro",
    ]);
    expect(screen.getByRole("option", { name: "Soporte" })).toHaveValue("support");
    expect(container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
  });

  it("associates required-field errors with accessible controls", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Preparar correo" }));

    const reason = screen.getByLabelText("Motivo de contacto");
    const name = screen.getByLabelText("Nombre");
    const organization = screen.getByLabelText("Organización");
    const email = screen.getByLabelText("Correo");
    const message = screen.getByLabelText("Mensaje");
    const consent = screen.getByRole("checkbox", { name: /aviso de privacidad/i });

    [reason, name, organization, email, message, consent].forEach((control) => {
      expect(control).toHaveAttribute("aria-invalid", "true");
      expect(control).toBeRequired();
    });
    expect(screen.getByText(/revise los campos señalados/i)).toBeInTheDocument();
    expect(name).toHaveFocus();
  });

  it.each([
    ["myke", "contact@nyvoratechnologies.com", "Información sobre Myke"],
    ["support", "support@nyvoratechnologies.com", "Soporte"],
  ] as const)("routes %s inquiries to the approved mailbox", async (reason, recipient, reasonLabel) => {
    const user = await completeForm(reason);

    await user.click(screen.getByRole("button", { name: "Preparar correo" }));

    const link = await screen.findByRole("link", { name: /abrir borrador en correo/i });
    const href = link.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(new RegExp(`^mailto:${recipient.replace(".", "\\.")}\\?`));

    const parameters = new URLSearchParams(href?.split("?")[1]);
    expect(parameters.get("subject")).toContain(reasonLabel);
    expect(parameters.get("body")).toContain("Nombre: Persona de prueba");
    expect(parameters.get("body")).toContain("Organización: Institución de ejemplo");
    expect(parameters.get("body")).toContain("Correo de respuesta: persona@example.org");
    expect(parameters.get("body")).toContain(`Motivo: ${reasonLabel}`);
    expect(parameters.get("body")).toContain("Queremos conocer más sobre Nyvora");
    expect(screen.getByText(new RegExp(`borrador preparado para ${recipient}`, "i"))).toHaveTextContent(
      /aún no ha recibido el mensaje/i,
    );
    expect(screen.queryByText(/enviado correctamente|mensaje recibido/i)).not.toBeInTheDocument();
  });

  it("invalidates a prepared draft when a field changes", async () => {
    const user = await completeForm("myke");
    await user.click(screen.getByRole("button", { name: "Preparar correo" }));
    expect(await screen.findByRole("link", { name: /abrir borrador en correo/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText("Nombre"), " A");

    expect(screen.queryByRole("link", { name: /abrir borrador en correo/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preparar correo" })).toBeInTheDocument();
  });
});
