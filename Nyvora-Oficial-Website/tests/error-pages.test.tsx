import type { ReactElement, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AppError from "@/app/error";
import GlobalError from "@/app/global-error";

const privateError = new Error("Private server implementation detail");

describe("error fallbacks", () => {
  it("offers an accessible retry without exposing internal details", async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const { container } = render(<AppError error={privateError} retry={retry} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "No pudimos mostrar esta página." }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent(privateError.message);
    expect(screen.getByRole("link", { name: "Volver a Company" })).toHaveAttribute("href", "/");

    await user.click(screen.getByRole("button", { name: "Intentar de nuevo" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("renders a complete Spanish document for root-layout failures", async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const document = GlobalError({ error: privateError, retry });
    const body = document.props.children as ReactElement<{ children: ReactNode }>;

    expect(document.type).toBe("html");
    expect(document.props.lang).toBe("es");
    expect(body.type).toBe("body");

    const { container } = render(<>{body.props.children}</>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(container).not.toHaveTextContent(privateError.message);
    expect(document.props.children.props.children).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Intentar de nuevo" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
