# Nyvora Technologies corporate website

Official corporate website for Nyvora Technologies and its principal product, Nyvora Myke. The site is intentionally separate from Myke's application repository and runtime.

## Technology

- Next.js 16 with the App Router
- React 19 and strict TypeScript
- CSS Modules with a small global token layer
- ESLint and Vitest + Testing Library
- Static prerendering for every public content route

No environment variables, database, authentication, analytics, or third-party form provider are required in this version. Contact uses the organization's confirmed corporate email aliases through `mailto:` links.

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

## Contact flow

The form performs client-side validation and prepares a prefilled email draft. General inquiries are addressed to `contact@nyvoratechnologies.com`; support requests are addressed to `support@nyvoratechnologies.com`. The website does not transmit or store the form contents, and it never reports delivery: the visitor must send the draft from their own email application.

## Vercel deployment readiness

The project uses the standard Next.js build and start scripts and requires no custom Vercel adapter. A future deployment should import this repository into Vercel, keep the detected Next.js settings, deploy to a preview URL first, validate every route and header, and only then promote a reviewed release.

The custom domain and GoDaddy DNS are intentionally not configured in this repository. Domain connection should happen only after production content, legal text, the corporate contact channels, and monitoring are approved.

## Before production

- Obtain qualified legal review of the Website Privacy Notice and Website Terms of Use.
- Confirm the responsible legal entity, governing law, controller details, intellectual-property ownership, providers, transfers, and retention.
- Confirm ongoing monitoring for the contact, support, legal, and privacy mailboxes.
- Select an approved delivery provider and update the privacy notice before replacing the current `mailto:` flow with direct website submission.
- Complete production browser, accessibility, security-header, and domain verification on the actual Vercel deployment.
