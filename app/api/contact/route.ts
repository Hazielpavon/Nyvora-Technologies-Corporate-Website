import { NextResponse } from "next/server";
import { validateContactSubmission } from "@/lib/contact";
import { ContactEmailConfigurationError, sendContactEmail } from "@/lib/contact-email";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 12_000;

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return response({ ok: false, code: "unsupported_media_type" }, 415);
  }

  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return response({ ok: false, code: "invalid_origin" }, 403);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_SIZE) {
    return response({ ok: false, code: "payload_too_large" }, 413);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_SIZE) {
    return response({ ok: false, code: "payload_too_large" }, 413);
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return response({ ok: false, code: "invalid_json" }, 400);
  }

  const validation = validateContactSubmission(input);
  if (!validation.ok) {
    return response({ ok: false, code: "validation_error", fieldErrors: validation.fieldErrors }, 400);
  }

  const { website, ...submission } = validation.data;
  if (website) {
    return response({ ok: true }, 200);
  }

  try {
    await sendContactEmail(submission);
    return response({ ok: true }, 200);
  } catch (error) {
    if (error instanceof ContactEmailConfigurationError) {
      return response({ ok: false, code: "delivery_unavailable" }, 503);
    }

    return response({ ok: false, code: "delivery_failed" }, 502);
  }
}
