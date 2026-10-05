import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/ContactForm";

async function completeForm(reason = "support") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nombre"), "Persona de prueba");
  await user.type(screen.getByLabelText("Organización"), "Institución de ejemplo");
  await user.type(screen.getByLabelText("Correo"), "persona@example.org");
  await user.selectOptions(screen.getByLabelText("Motivo de contacto"), reason);
  await user.type(
    screen.getByLabelText("Asunto"),
    "Consulta institucional de prueba",
  );
  await user.type(
    screen.getByLabelText("Mensaje"),
    "Este es un mensaje suficientemente detallado para la consulta.",
  );
  await user.click(screen.getByRole("checkbox", { name: /aviso de privacidad/i }));
  return user;
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("contact form", () => {
  it("has a safe no-JavaScript fallback before hydration", () => {
    const html = renderToString(<ContactForm />);

    expect(html).toContain('action="/api/contact"');
    expect(html).toContain('method="post"');
    expect(html).toContain("<fieldset");
    expect(html).toContain("disabled");
    expect(html).toContain("<noscript>");
    expect(html).toContain("Active JavaScript");
    expect(html).toContain("Preparando…");
  });

  it("hydrates with a UUID, timing marker and approved reasons", () => {
    const { container } = render(<ContactForm />);

    expect(screen.getByRole("note")).toHaveTextContent(
      /envía su consulta directamente desde este sitio/i,
    );
    expect(screen.getByRole("note")).toHaveTextContent(
      /sin abrir una aplicación externa/i,
    );
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeEnabled();
    expect(container.querySelector("fieldset")).not.toBeDisabled();

    const submissionId = container.querySelector<HTMLInputElement>(
      'input[name="submissionId"]',
    );
    const startedAt = container.querySelector<HTMLInputElement>(
      'input[name="startedAt"]',
    );
    expect(submissionId?.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(Number(startedAt?.value)).toBeGreaterThan(0);

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

  it("validates every accessible required field without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    const controls = [
      screen.getByLabelText("Nombre"),
      screen.getByLabelText("Organización"),
      screen.getByLabelText("Correo"),
      screen.getByLabelText("Motivo de contacto"),
      screen.getByLabelText("Asunto"),
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

  it("posts a complete inquiry and rotates hidden identity after success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<ContactForm />);
    const originalId = container.querySelector<HTMLInputElement>(
      'input[name="submissionId"]',
    )?.value;
    const user = await completeForm("support");

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/aceptado para envío/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(url).toBe("/api/contact");
    expect(options.method).toBe("POST");
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(body).toMatchObject({
      name: "Persona de prueba",
      organization: "Institución de ejemplo",
      email: "persona@example.org",
      reason: "support",
      subject: "Consulta institucional de prueba",
      consent: true,
    });
    expect(body.submissionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(body.startedAt).toEqual(expect.any(Number));
    expect(body).not.toHaveProperty("recipient");
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
    expect(container.querySelector<HTMLInputElement>(
      'input[name="submissionId"]',
    )?.value).not.toBe(originalId);
  });

  it("applies server field errors and focuses the first invalid field", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        ok: false,
        code: "validation_error",
        fieldErrors: { subject: "El asunto no es válido." },
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    const user = await completeForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("El asunto no es válido.")).toBeInTheDocument();
    expect(screen.getByLabelText("Asunto")).toHaveFocus();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Persona de prueba");
  });

  it("shows a generic validation state for hidden-field rejection", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, code: "invalid_submission" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    const user = await completeForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/no pudimos validar el envío/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Persona de prueba");
  });

  it.each([
    [503, "delivery_unavailable", /temporalmente no disponible/i],
    [504, "delivery_timeout", /el envío tardó demasiado/i],
    [502, "delivery_failed", /no pudimos enviar el mensaje/i],
  ])("preserves the form for a %s server response", async (status, code, message) => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, code }), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    const user = await completeForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Persona de prueba");
    expect(screen.queryByText(/aceptado para envío/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeEnabled();
  });

  it("prevents duplicate submissions and exposes an accessible busy state", async () => {
    let resolveRequest!: (response: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(pendingResponse);
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<ContactForm />);
    const user = await completeForm();

    const submit = screen.getByRole("button", { name: "Enviar mensaje" });
    await user.click(submit);
    expect(container.querySelector("form")).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("fieldset")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
    fireEvent.submit(container.querySelector("form")!);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveRequest(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(await screen.findByText(/aceptado para envío/i)).toBeInTheDocument();
    expect(container.querySelector("form")).toHaveAttribute("aria-busy", "false");
    expect(container.querySelector("fieldset")).not.toBeDisabled();
  });

  it("handles network failure without clearing user data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const { container } = render(<ContactForm />);
    const user = await completeForm();
    const originalId = container.querySelector<HTMLInputElement>(
      'input[name="submissionId"]',
    )?.value;
    const originalStartedAt = container.querySelector<HTMLInputElement>(
      'input[name="startedAt"]',
    )?.value;

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/no pudimos conectar/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Persona de prueba");

    await user.type(screen.getByLabelText("Asunto"), " actualizado");
    expect(container.querySelector<HTMLInputElement>(
      'input[name="submissionId"]',
    )?.value).not.toBe(originalId);
    expect(container.querySelector<HTMLInputElement>(
      'input[name="startedAt"]',
    )?.value).toBe(originalStartedAt);
  });

  it("aborts a stalled browser request after the client timeout", async () => {
    const fetchMock = vi.fn((_url: string, options: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        options.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<ContactForm />);
    await completeForm();
    vi.useFakeTimers();

    fireEvent.submit(container.querySelector("form")!);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(15_000);
    });

    expect(screen.getByText(/la conexión tardó demasiado/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Persona de prueba");
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeEnabled();
  });
});
