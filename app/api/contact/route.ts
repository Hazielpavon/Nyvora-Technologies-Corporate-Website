import { NextResponse } from "next/server";
import { validateContactSubmission } from "@/lib/contact";
import {
  ContactEmailConfigurationError,
  ContactEmailTimeoutError,
  sendContactEmail,
} from "@/lib/contact-email";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 12_000;

type BodyReadResult =
  | { ok: true; body: string }
  | { ok: false; reason: "invalid_encoding" | "payload_too_large" };

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readBodyWithinLimit(request: Request): Promise<BodyReadResult> {
  if (!request.body) return { ok: true, body: "" };

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const parts: string[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;
      if (size > MAX_BODY_SIZE) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: "payload_too_large" };
      }
      parts.push(decoder.decode(value, { stream: true }));
    }
    parts.push(decoder.decode());
    return { ok: true, body: parts.join("") };
  } catch {
    return { ok: false, reason: "invalid_encoding" };
  } finally {
    reader.releaseLock();
  }
}

function hasFilledHoneypot(input: unknown) {
  if (!input || typeof input !== "object") return false;
  const value = (input as Record<string, unknown>).website;
  return typeof value === "string" ? value.trim().length > 0 : value != null;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const mediaType = contentType.split(";", 1)[0].trim();
  if (mediaType !== "application/json") {
    return response({ ok: false, code: "unsupported_media_type" }, 415);
  }

  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return response({ ok: false, code: "invalid_origin" }, 403);
  }

  const declaredLengthHeader = request.headers.get("content-length");
  const declaredLength = declaredLengthHeader === null
    ? 0
    : Number(declaredLengthHeader);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_SIZE) {
    return response({ ok: false, code: "payload_too_large" }, 413);
  }

  const bodyRead = await readBodyWithinLimit(request);
  if (!bodyRead.ok && bodyRead.reason === "payload_too_large") {
    return response({ ok: false, code: "payload_too_large" }, 413);
  }
  if (!bodyRead.ok) {
    return response({ ok: false, code: "invalid_json" }, 400);
  }

  let input: unknown;
  try {
    input = JSON.parse(bodyRead.body);
  } catch {
    return response({ ok: false, code: "invalid_json" }, 400);
  }

  if (hasFilledHoneypot(input)) {
    return response({ ok: true }, 200);
  }

  const validation = validateContactSubmission(input);
  if (!validation.ok) {
    if (validation.code === "invalid_submission") {
      return response({ ok: false, code: "invalid_submission" }, 400);
    }
    return response(
      {
        ok: false,
        code: "validation_error",
        fieldErrors: validation.fieldErrors,
      },
      400,
    );
  }

  const { website, ...submission } = validation.data;
  void website;

  try {
    await sendContactEmail(submission);
    return response({ ok: true }, 200);
  } catch (error) {
    if (error instanceof ContactEmailConfigurationError) {
      return response({ ok: false, code: "delivery_unavailable" }, 503);
    }
    if (error instanceof ContactEmailTimeoutError) {
      return response({ ok: false, code: "delivery_timeout" }, 504);
    }

    return response({ ok: false, code: "delivery_failed" }, 502);
  }
}
