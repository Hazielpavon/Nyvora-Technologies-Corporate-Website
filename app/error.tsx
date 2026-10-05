"use client";

import { ErrorState } from "@/components/ErrorState";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  return <ErrorState headingId="app-error-title" retry={retry} />;
}
