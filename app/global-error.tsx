"use client";

import { ErrorState } from "@/components/ErrorState";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body className="min-h-[100dvh] bg-bg font-sans text-ink">
        <title>Error inesperado | Nyvora Technologies</title>
        <main>
          <ErrorState headingId="global-error-title" retry={retry} />
        </main>
      </body>
    </html>
  );
}
