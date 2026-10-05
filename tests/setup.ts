import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/font is compiled by Next.js; in unit tests a stable stub is enough.
vi.mock("next/font/google", () => {
  const font = (variable: string) => () => ({ className: variable, variable, style: { fontFamily: variable } });
  return { Geist: font("--font-geist-sans"), Geist_Mono: font("--font-geist-mono") };
});

afterEach(() => cleanup());
