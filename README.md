# Nyvora Technologies corporate website

Official corporate website for Nyvora Technologies and its principal product, Nyvora Myke. The site is intentionally separate from Myke's application repository and runtime.

## Technology

- Next.js 16 with the App Router
- React 19 and strict TypeScript
- CSS Modules with a small global token layer
- A server-side contact route delivered through the Resend Email API
- ESLint and Vitest + Testing Library
- Static prerendering for every public content route

The public content routes are statically rendered. Contact uses a Vercel Function and server-only Resend credentials; no database, authentication, analytics, or client-side email application is required.

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

Delivery requires the server-only values documented in `.env.example`. `RESEND_API_KEY` authenticates the request and `RESEND_EMAIL_DOMAIN` identifies the verified sending domain. Messages are sent as `Nyvora Website <website@RESEND_EMAIL_DOMAIN>` and keep the visitor's address only as `Reply-To`. Never commit or paste the API key into source files.

## Vercel deployment readiness

The project uses the standard Next.js build and start scripts and requires no custom Vercel adapter. Confirm that the Resend integration provides `RESEND_API_KEY` and add `RESEND_EMAIL_DOMAIN=nyvoratechnologies.com` manually in the target Vercel environment, then validate delivery in a preview deployment before promoting it.

Domain and DNS configuration are managed outside this repository.

## Before production

- Obtain qualified legal review of the Website Privacy Notice and Website Terms of Use.
- Confirm the responsible legal entity, governing law, controller details, intellectual-property ownership, providers, transfers, and retention.
- Confirm ongoing monitoring for the contact, support, legal, and privacy mailboxes.
- Confirm that the Resend sending domain is verified and that its API key has only the permissions required to send email.
- Verify a real delivery, the `Reply-To` behavior and the `Nyvora Website` sender identity.
- Complete production browser, accessibility, security-header, and domain verification on the actual Vercel deployment.
