import type { CSSProperties } from "react";

type Turn =
  | { from: "person"; text: string }
  | { from: "myke"; text: string; detail?: { label: string; value: string }[] };

const currency = new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" });
const shortDate = new Intl.DateTimeFormat("es-HN", { day: "numeric", month: "short", timeZone: "UTC" });
const sampleChargeDate = new Date(Date.UTC(2026, 9, 2));

// Illustrative conversation. Figures are sample data, not real account information.
const conversation: Turn[] = [
  { from: "person", text: "¿Cuánto tengo disponible?" },
  {
    from: "myke",
    text: "Este es el saldo disponible de tu cuenta de ahorro.",
    detail: [{ label: "Disponible", value: currency.format(18240.55) }],
  },
  { from: "person", text: "¿Qué fue este cobro?" },
  {
    from: "myke",
    text: "Es el pago de tu tarjeta. Te muestro la fecha y la referencia.",
    detail: [
      { label: "Fecha", value: shortDate.format(sampleChargeDate) },
      { label: "Referencia", value: "PT-48213" },
    ],
  },
];

export function ChatPreview() {
  return (
    <figure className="w-full">
      <div className="rounded-[20px] border border-line bg-raised p-4 shadow-[0_24px_48px_-32px_hsl(var(--shadow)/0.35)] sm:p-6">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full bg-accent-wash font-mono text-sm font-semibold text-accent-ink"
          >
            M
          </span>
          <div>
            <p className="text-sm font-medium text-ink" translate="no">Myke</p>
            <p className="text-xs text-ink-muted">Asistente de su banco</p>
          </div>
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {conversation.map((turn, index) => (
            <li
              key={turn.text}
              style={{ "--i": index } as CSSProperties}
              className={`chat-turn flex ${turn.from === "person" ? "justify-end" : "justify-start"}`}
            >
              {turn.from === "person" ? (
                <p className="max-w-[80%] rounded-[18px] rounded-br-md bg-button px-4 py-2.5 text-[0.9375rem] text-button-ink">
                  {turn.text}
                </p>
              ) : (
                <div className="max-w-[88%] rounded-[18px] rounded-bl-md bg-surface px-4 py-3">
                  <p className="text-[0.9375rem] leading-relaxed text-ink">{turn.text}</p>
                  {turn.detail ? (
                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-3">
                      {turn.detail.map((item) => (
                        <div key={item.label}>
                          <dt className="text-xs text-ink-muted">{item.label}</dt>
                          <dd className="font-mono text-sm font-medium tabular-nums text-ink">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-sm text-ink-muted">
        Conversación ilustrativa. Los datos mostrados son de ejemplo.
      </figcaption>
    </figure>
  );
}
