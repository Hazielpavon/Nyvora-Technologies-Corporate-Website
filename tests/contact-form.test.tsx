import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/components/ContactForm";

describe("contact form", () => {
  it("shows Spanish contact reasons and discloses that online delivery is disabled", () => {
    const { container } = render(<ContactForm />);

    expect(screen.getByRole("note")).toHaveTextContent(
      /el canal de contacto aún no está habilitado/i,
    );

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
    expect(container).not.toHaveTextContent(/(?:support|security)@nyvoratechnologies\.com/i);
  });

  it("associates required-field errors with accessible controls", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Revisar mensaje" }));

    const reason = screen.getByLabelText("Motivo de contacto");
    const name = screen.getByLabelText("Nombre");
    const organization = screen.getByLabelText("Organización");
    const email = screen.getByLabelText("Correo");
    const message = screen.getByLabelText("Mensaje");
    const consent = screen.getByRole("checkbox", { name: /aviso de privacidad/i });

    [reason, name, organization, email, message, consent].forEach((control) => {
      expect(control).toHaveAttribute("aria-invalid", "true");
    });
    expect(screen.getByText(/revis[ae] los campos señalados/i)).toBeInTheDocument();
    expect(name).toHaveFocus();
  });

  it("reviews a complete inquiry but never reports false delivery", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const reason = screen.getByLabelText("Motivo de contacto");
    const firstReason = within(reason)
      .getAllByRole("option")
      .find((option) => {
        const candidate = option as HTMLOptionElement;
        return !candidate.disabled && candidate.value !== "";
      }) as HTMLOptionElement;

    await user.selectOptions(reason, firstReason.value);
    await user.type(screen.getByLabelText("Nombre"), "Persona de prueba");
    await user.type(screen.getByLabelText("Organización"), "Institución de ejemplo");
    await user.type(screen.getByLabelText("Correo"), "persona@example.org");
    await user.type(
      screen.getByLabelText("Mensaje"),
      "Queremos conocer más sobre Myke y conversar sobre nuestras necesidades.",
    );
    await user.click(screen.getByRole("checkbox", { name: /aviso de privacidad/i }));
    await user.click(screen.getByRole("button", { name: "Revisar mensaje" }));

    expect(await screen.findByText(/no se ha enviado|no fue enviado/i)).toHaveTextContent(
      /canal de contacto aún no está disponible/i,
    );
    expect(screen.queryByText(/mensaje (ha sido )?recibido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/enviado correctamente/i)).not.toBeInTheDocument();
  });
});
