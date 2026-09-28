# Verification record

Mobile layout update (2026-09-29): 53 URLs (all 26 public routes in English and Khmer plus admin sign-in) passed 212 viewport checks at 320, 390, 768, and 1280 pixels. Visually inspected the mobile home, course filters, and Khmer registration pages; verified menu navigation and closing. Registration course changes retain server-formatted Khmer dates without the browser/server hydration mismatch. Mobile registration fields compute to 16px. ESLint and TypeScript checks pass. Authenticated admin and populated payment flows were not rerun for this update.

The responsive script now includes all public routes by default; `QA_WIDTHS` optionally selects comma-separated viewport widths.

Earlier verification, including the Kantumruy Pro font update:

- Production build compiles every public, admin and API route.
- TypeScript and ESLint pass; existing contact validation tests pass.
- Public route smoke coverage: 52 localized URLs and 58 discovered local links.
- Admin requests without a valid session redirect to sign-in.
- Unknown courses/people/pages return 404.
- Unprefixed routes retain their path and query during language redirects.
- Course → registration → checkout tested interactively with fictional data.
- KHQR and hosted-card mock screens tested; pending, failed, cancelled, retry and paid results exercised.
- Browser success URLs never grant paid status. Registration data and mutations are restricted to their booking session.
- Direct calls to the simulation server action fail when DEMO_MODE=false. Unverified webhooks return 401.
- CMS price and closed-course changes appear on the public course page. Original demo values restored after checking.
- Draft pages are hidden in both languages. Authenticated draft preview shows edited Khmer content; visitor preview access is denied.
- Mobile navigation opens, navigates to the correct route, and closes afterward.
- Language switching during checkout preserves registration information.
- Responsive checks at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 pixels cover public page families, course detail, registration, contact, authenticated checkout/results, dashboard, content/course editors, tables, payment detail/settings and media. No document-level horizontal overflow was detected. Tables scroll within their containers.
- Browser computed styles confirm Kantumruy Pro is loaded for Khmer body and headings; Khmer booking/page layouts were rechecked after the font change.

`npm run test:platform` checks routes and security boundaries. `npm run test:responsive` requires `AGENT_BROWSER_BIN` and uses a dedicated `tm-qa` session. See README for route overrides. `npm run test:payment-security` requires a production build, a pending fictional booking in the repository, demo-enabled port 3100 and demo-disabled port 3101; it tests the actual server-action transport and is only for local QA.

No external enquiries, real charges, live deployment, or production gateway verification were performed. Local JSON storage, demonstration authentication, sample course information and legal/Khmer copy need production integration and operator review before public launch.
