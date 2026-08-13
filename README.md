# Nyvora Technologies corporate website

Official corporate website for Nyvora Technologies and its principal product, Nyvora Myke. The site is intentionally separate from Myke's application repository and runtime.

## Technology

- Next.js 16 with the App Router
- React 19 and strict TypeScript
- CSS Modules with a small global token layer
- ESLint and Vitest + Testing Library
- Static prerendering for every public content route

No environment variables, database, authentication, analytics, or third-party form provider are required in this version.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Contact form status

The form performs client-side validation but does not transmit or store information. `components/ContactForm.tsx` contains the documented integration boundary for a future approved server-side endpoint and delivery provider. Do not enable a success state until the single corporate contact channel, delivery, retention, anti-abuse controls, monitoring, and the privacy notice have all been verified.

## Vercel deployment readiness

The project uses the standard Next.js build and start scripts and requires no custom Vercel adapter. A future deployment should import this repository into Vercel, keep the detected Next.js settings, deploy to a preview URL first, validate every route and header, and only then promote a reviewed release.

The custom domain and GoDaddy DNS are intentionally not configured in this repository. Domain connection should happen only after production content, legal text, the single corporate contact channel, and monitoring are approved.

## Before production

- Obtain qualified legal review of the Website Privacy Notice and Website Terms of Use.
- Confirm the responsible legal entity, governing law, controller details, intellectual-property ownership, providers, transfers, and retention.
- Create and monitor the single corporate email address before displaying it anywhere on the site.
- Select an approved contact delivery provider and update the privacy notice before enabling submission.
- Complete production browser, accessibility, security-header, and domain verification on the actual Vercel deployment.
