export function serializeStructuredData(value: unknown): string {
  const serialized = JSON.stringify(value);

  if (serialized === undefined) {
    throw new TypeError("Structured data must be JSON-serializable.");
  }

  return serialized.replace(/</g, "\\u003c");
}
