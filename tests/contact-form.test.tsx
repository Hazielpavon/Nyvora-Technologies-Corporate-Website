import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/ContactForm";

async function completeForm(reason = "myke") {
  const user = userEvent.setup();

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

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("contact form", () => {
  it("shows the approved reasons and explains direct website delivery", () => {
    const { container } = render(<ContactForm />);

    expect(screen.getByRole("note")).toHaveTextContent(
      /envía su consulta directamente desde este sitio/i,
    );
    expect(screen.getByRole("note")).toHaveTextContent(/sin abrir una aplicación externa/i);

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
      "Privacidad",
      "Asuntos legales",
      "Otro",
    ]);
    expect(container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
  });

  it("validates accessible required fields without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    const controls = [
      screen.getByLabelText("Motivo de contacto"),
      screen.getByLabelText("Nombre"),
      screen.getByLabelText("Organización"),
      screen.getByLabelText("Correo"),
      screen.getByLabelText("Mensaje"),
      screen.getByRole("checkbox", { name: /aviso de privacidad/i }),
    ];
    controls.forEach((control) => {
      expect(control).toHaveAttribute("aria-invalid", "true");
      expect(control).toBeRequired();
    });
    expect(screen.getByText(/revise los campos señalados/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts a valid inquiry and reports success only after the API accepts it", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    const user = await completeForm("support");

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/aceptado para envío/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(url).toBe("/api/contact");
    expect(options.method).toBe("POST");
    expect(body).toMatchObject({
      name: "Persona de prueba",
      organization: "Institución de ejemplo",
      email: "persona@example.org",
      reason: "support",
      consent: true,
    });
    expect(body).not.toHaveProperty("recipient");
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });

  it("preserves the form when delivery fails and never reports false success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, code: "delivery_failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    const user = await completeForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/no pudimos enviar el mensaje/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Persona de prueba");
    expect(screen.queryByText(/aceptado para envío/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeEnabled();
  });

  it("prevents duplicate submissions while a request is pending", async () => {
    let resolveRequest!: (response: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(pendingResponse);
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    const user = await completeForm();

    const submit = screen.getByRole("button", { name: "Enviar mensaje" });
    await user.click(submit);
    expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Enviando…" }));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveRequest(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(await screen.findByText(/aceptado para envío/i)).toBeInTheDocument();
  });
});
