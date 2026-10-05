# DESIGN.md · Nyvora Technologies

Design system for nyvoratechnologies.com, written in the
[awesome-design-md](https://github.com/VoltAgent/awesome-design-md) format so any coding
agent can build UI that matches the brand. The source of truth for values is
`app/globals.css`; update both together.

## 1. Visual theme and atmosphere

Sober, confident B2B technology company from Honduras that sells to decision makers in
banking. Calm, spacious layouts, one brand accent, real product previews instead of
decorative illustrations. Feels precise and trustworthy, never playful or loud.

- Light and dark themes follow `prefers-color-scheme` automatically.
- Copy is in Spanish. Brand names (`Nyvora`, `Myke`) carry `translate="no"`.
- No numbered section labels (`01 / …`), no em dashes, one CTA label per intent
  ("Hablar con Nyvora", "Conocer Myke").

## 2. Color palette and roles

Palette comes from the official logo: navy ink plus brand cyan. Cyan is the only accent.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | `#f5f7fa` | `#070d17` | Page background |
| `--surface` | `#eaeff5` | `#0d1624` | Section bands, muted panels |
| `--surface-raised` | `#fbfcfd` | `#111c2d` | Cards, chat preview, form |
| `--ink` | `#0b1b33` | `#ebf1f7` | Headings, primary text |
| `--ink-soft` | `#33435a` | `#b9c6d6` | Body copy |
| `--ink-muted` | `#56657a` | `#8b9bb1` | Captions, metadata |
| `--line` | `#d6dee8` | `#1d2a3d` | Borders, dividers |
| `--accent` | `#00b4e6` | `#22c3f2` | Brand cyan: highlights, focus ring fill |
| `--accent-ink` | `#036494` | `#62d4f7` | Accent text and icons (AA contrast) |
| `--accent-wash` | `#dff4fb` | `#0c2638` | Tinted feature card |
| `--button` | `#0b1b33` | `#22c3f2` | Primary button background |
| `--button-ink` | `#f5f7fa` | `#04121f` | Primary button text |
| `--danger` | `#b42318` | `#ff8a7a` | Form errors |
| `--success` | `#067647` | `#5fd49a` | Form success |

Use Tailwind aliases (`bg-bg`, `bg-surface`, `bg-raised`, `text-ink`, `text-ink-soft`,
`text-ink-muted`, `border-line`, `text-accent-ink`, `bg-accent-wash`, `bg-button`) rather
than raw hex values. Never put `--accent` text on light backgrounds; use `--accent-ink`.

## 3. Typography

- Sans: **Geist** (self-hosted via `next/font`), fallback `ui-sans-serif, system-ui`.
- Mono: **Geist Mono**, used for eyebrows, data values and figures.

| Role | Classes |
| --- | --- |
| Hero H1 | `text-4xl md:text-6xl font-semibold leading-[1.04] tracking-tight` |
| Section H2 | `text-3xl md:text-5xl font-semibold leading-[1.08] tracking-tight` |
| Card title | `text-xl font-semibold tracking-tight` |
| Lead | `text-lg md:text-xl leading-relaxed text-ink-soft max-w-[56ch]` |
| Body | `leading-relaxed text-ink-soft` (max ~62ch) |
| Eyebrow | `.eyebrow`: mono, 12px, weight 500, `letter-spacing: .14em`, uppercase, `--accent-ink` |

Headline pattern: first clause in `--ink`, closing clause in `--ink-muted`
("Tecnología creada en Honduras *para construir nuevas posibilidades.*").

## 4. Components

- **Primary button:** full pill (`rounded-full`), `bg-button text-button-ink`, weight 600,
  trailing Phosphor arrow that nudges `translate-x-0.5` on hover.
- **Secondary button:** full pill, `border border-line`, transparent background.
- **Card:** `rounded-[20px] border border-line bg-raised p-7`. Feature variant uses
  `bg-accent-wash`; spotlight variant uses the dark hero imagery with light text.
- **Bento grid:** 12 columns on `lg`, cards spanning 5 / 7 columns.
- **Chat preview (Myke):** real component, user bubbles in `--button`, assistant bubbles in
  `--surface` with mono data rows, always captioned "Conversación ilustrativa".
- **Form inputs:** `rounded-xl` (12px), `border-line`, visible labels, inline errors in
  `--danger`.
- **Header:** sticky, blurred translucent background, pill nav; mobile menu below `md`.
- **Icons:** Phosphor (`@phosphor-icons/react`), regular weight, `text-accent-ink`.

## 5. Layout and spacing

- Container: `.site-container`, `max-width: 80rem`, inline padding 20px (32px from `sm`).
- Section rhythm: `py-24` to `py-32` on desktop, `pb-16 pt-14` on mobile.
- Two-column sections: copy in 5 columns, visual in 7 (or sticky heading in 4, content in 8).
- Radius scale: controls full pill, surfaces and media 20px, inputs 12px, focus ring 6px.
- No horizontal scroll from 320px to 1440px (covered by E2E).

## 6. Depth and elevation

Flat surfaces separated by `--line` borders. Shadows are soft and tinted with
`hsl(var(--shadow) / …)`, reserved for the hero visual and the chat preview.

## 7. Motion

- CSS scroll-driven reveals (`.reveal`, staggered with `--i`) that remain visible without JS.
- Motion (`motion/react`) only for hero parallax and the scroll-linked journey line.
- Easing `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`, durations 200 to 600ms.
- Everything is disabled under `prefers-reduced-motion: reduce`.

## 8. Do and don't

- Do show the product (chat preview, comparison, timeline) instead of describing it.
- Do keep one accent color and generous whitespace.
- Do meet WCAG 2.2 AA in both themes (axe runs in E2E).
- Don't add gradients, glows or neon beyond the existing hero imagery.
- Don't use stock photos, emoji or decorative illustrations.
- Don't invent metrics or client logos.

## 9. Agent prompt guide

> Build with Next.js App Router, Tailwind v4 tokens from `app/globals.css`, Geist, Phosphor
> icons. Navy ink on cool off-white (or deep navy in dark mode), brand cyan as the only
> accent, pill buttons, 20px cards with 1px borders, mono eyebrows, Spanish copy, subtle
> scroll reveals that respect reduced motion.
