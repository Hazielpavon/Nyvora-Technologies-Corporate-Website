# Nyvora Technologies corporate website

Official corporate website for Nyvora Technologies and its principal product, Nyvora Myke. The site is intentionally separate from Myke's application repository and runtime.

## Technology

- Next.js 16 with the App Router
- React 19 and strict TypeScript
- CSS Modules with a small global token layer
- A server-side contact route delivered through Google Workspace SMTP
- ESLint and Vitest + Testing Library
- Static prerendering for every public content route

The public content routes are statically rendered. Contact uses a Vercel Function and server-only SMTP credentials; no database, authentication, analytics, or client-side email application is required.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
Copy-Item .env.example .env.local
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

## Contact delivery

The form validates in the browser and again in `POST /api/contact`. The server derives the destination from an internal allowlist: general inquiries go to `contact@nyvoratechnologies.com`, support to `support@nyvoratechnologies.com`, privacy to `privacy@nyvoratechnologies.com`, and legal matters to `legal@nyvoratechnologies.com`. The browser cannot choose an arbitrary recipient.

Delivery requires the server-only values documented in `.env.example`. For Google Workspace, `SMTP_USER` must be the real account that can authenticate and `SMTP_PASSWORD` must be an App Password or equivalent approved credential. Never commit or paste credentials into source files.

## Vercel deployment readiness

The project uses the standard Next.js build and start scripts and requires no custom Vercel adapter. Add the SMTP values to the Vercel environment before deploying the contact route, then validate delivery in a preview deployment before promoting it.

Domain and DNS configuration are managed outside this repository.

## Before production

- Obtain qualified legal review of the Website Privacy Notice and Website Terms of Use.
- Confirm the responsible legal entity, governing law, controller details, intellectual-property ownership, providers, transfers, and retention.
- Confirm ongoing monitoring for the contact, support, legal, and privacy mailboxes.
- Configure the SMTP credential directly in Vercel and verify a real delivery plus `Reply-To` behavior.
- Confirm that the authenticated Workspace account does not expose any temporary alias in message headers.
- Complete production browser, accessibility, security-header, and domain verification on the actual Vercel deployment.
