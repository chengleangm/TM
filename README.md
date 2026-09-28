# TM Cambodia — bilingual website, booking & CMS

A multi-page Next.js 16.3 App Router application with English (`/en`) and Khmer (`/km`), Kantumruy Pro Khmer typography, a course booking demonstration, and an authenticated admin workspace. The existing Cambodia imagery, dictionaries, and production contact integration are preserved.

## Run locally

Requires Node.js 24.

```sh
npm install
npm run dev
```

Open `/en` or `/km`. `/` defaults to Khmer and remembers the selected language. Unprefixed public routes (such as `/courses`) redirect to the equivalent localized route, preserving query parameters.

Development enables demo mode by default. Sign in at `/admin` with `tm-demo-admin` unless `ADMIN_PASSWORD` is set.

For a production-mode local preview, copy `.env.example` to `.env.local`, set `DEMO_MODE=true`, and choose a strong `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`, then run:

```sh
npm run build
npm start
```

The server `DEMO_MODE` flag is authoritative. `NEXT_PUBLIC_DEMO_MODE` alone never enables simulation. With `DEMO_MODE=false`, course registration and simulated payments are disabled. Production has no fallback admin password.

## Public routes

Each route below exists under both `/en` and `/km`:

- Home, `/about`, `/what-is-tm`, `/benefits`, `/learn`
- `/courses`, `/courses/[slug]`
- `/teachers`, `/teachers/[slug]`, `/centers`, `/centers/[slug]`
- `/testimonials`, `/videos`, `/faq`, `/contact`
- `/register`, `/checkout`
- `/payment/success`, `/payment/pending`, `/payment/failed`, `/payment/cancelled`
- `/privacy`, `/terms`

The language switch preserves the current route and booking/payment query. Course filters support search, location, type, date, availability, and language.

## Demo booking

1. Open a course, then **Register & pay**.
2. Enter fictional student details and accept the terms.
3. Review checkout and choose KHQR or card.
4. Use the clearly labeled controls to simulate success, pending, failure, or cancellation.
5. View the same registration and payments in `/admin`.

KHQR displays an actual QR encoding non-payment demo text. It cannot transfer money. Card checkout simulates a hosted gateway without requesting a card number, CVV, or PIN. No money is processed.

Registration and payment details are stored server-side. An HttpOnly booking cookie restricts access to the originating browser. Opening a success URL does not change payment status. All results are resolved from the server record; retries create separate attempts, successful payment transitions are idempotent, and confirmed registrations reduce seat availability. Prices and capacity are checked on the server.

## Admin workspace

`/admin` requires an authenticated, expiring, signed HttpOnly cookie. Every mutation separately checks authentication.

- Dashboard, courses, schedules, registrations and transaction details
- English and Khmer content editors for public pages, draft/publish, hero asset selection, SEO and authenticated previews
- Course pricing, dates, teachers, locations, capacity, duplicate and archive
- Teacher and center profile editors
- Demo contact inbox and read status
- Local media asset library and descriptions
- Header navigation, footer, general details, language overview, SEO and payment settings

Updates are reflected in the public site. Duplicate a course to create a new editable course. Payment state cannot be arbitrarily edited from registration administration.

## Storage and production integration

`src/services/repository.ts` is a **single-process local demo adapter**. It persists JSON at `.demo-data/repository.json`, serializes mutations, and uses atomic file replacement. The directory is gitignored. It is not suitable for multiple server instances or ephemeral/serverless filesystems. Only use fictional personal details.

Replace this adapter with a transactional database before live use. Add production identity management, durable sessions/rate limits, access roles, retention/deletion controls, backups, and audit logging. The demo login throttle is in-memory and is not a production abuse defense.

`src/services/payment/payment-provider.ts` defines `createPayment`, `createKhqrPayment`, `createCardCheckout`, `checkPayment`, `verifyCallback`, and `handleWebhook`. Only the demo adapter is implemented. Selecting Sandbox or Production in settings **disables checkout**; it does not activate a real gateway. `/api/payments/webhook` rejects every unverified callback until a provider is integrated.

Production merchant credentials must remain server-only:

```text
PAYMENT_MERCHANT_ID
PAYMENT_API_KEY
PAYMENT_SECRET
PAYMENT_WEBHOOK_SECRET
```

Use provider-hosted card collection, authenticated provider status verification, signed webhooks with replay protection, idempotency, and database transactions before collecting real payments. Confirm fees, settlement currency, refunds, schedules, venue details and teacher availability with the foundation.

## Contact

In demo mode the contact form saves to the admin inbox and explicitly says that no email is sent. Outside demo mode, the preserved `/api/contact` integration forwards to `CONTACT_WEBHOOK_URL` with `CONTACT_WEBHOOK_TOKEN` when configured; otherwise it reports that delivery is unavailable. It validates input and same-origin requests. No external messages were sent during implementation.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
# With an unconfigured contact receiver and local server running:
npm run test:smoke
# Full public routes, internal links and authentication boundaries:
node scripts/platform-smoke.mjs
```

Set `TEST_BASE_URL` for the server being tested (the platform smoke script defaults to port 3100). `scripts/responsive-qa.mjs` drives an isolated agent-browser session at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 pixels. Set `AGENT_BROWSER_BIN` to the CLI executable, and optionally `QA_ROUTES` to a comma-separated list including a session-owned checkout or payment URL. Reports are written under `.next/`.

## Content

See `CONTENT-SOURCES.md`. Course dates/prices and the Siem Reap venue are explicitly marked sample data. Stories summarize the existing official-site perspectives rather than fabricate local testimonials. Legal text is a draft demo notice. Have the foundation and a fluent Khmer editor approve content and translations before launch. Canonicals currently use `https://kh.tm.org`; previews should remain unindexed.
