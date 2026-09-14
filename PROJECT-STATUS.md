# Bakana Farms — Build Status

Living checklist of what is built, what is partial, and what is left. Update it in the same commit as the work.

**Legend:** `[x]` done and verified · `[~]` partial, caveat noted · `[ ]` not started

**Last verified:** production build green (31/31 routes), typecheck clean (0 errors), 18 tests passing, 100% token architecture compliance, dual-path showcase and first-login password auth live.

---

## 0. Blocking questions for the client

None of these can be invented. Several block real work.

- [ ] **Q1** Is there, or will there be, a foreign operating entity? (Decides whether Stripe is ever possible. Nigeria is outside Stripe's supported countries.)
- [ ] **Q2** NAFDAC registration number and NEPC exporter registration status → blocks certifications page, export claims, any B2B shipping copy
- [ ] **Q3** VAT classification under the Nigeria Tax Act 2025: zero-rated food or standard-rated supplement? → blocks checkout tax logic
- [ ] **Q4** USD domiciliary account status with Paystack → blocks dual-currency checkout
- [ ] **Q5** Logistics partner and rate card, domestic and export → blocks shipping calculation and the free-delivery threshold
- [ ] **Q6** Named DPO and NDPC registration status → blocks privacy policy
- [ ] **Q7** Real pricing and MOQs → fixtures are placeholders and are refused in deployed environments
- [ ] **Q8** Final domain → `NEXT_PUBLIC_SITE_URL` is not hard-coded anywhere, but sitemap and OG need it

---

## 1. Foundation

- [x] Next.js 16 + React 19 + TypeScript strict (`noUncheckedIndexedAccess` on)
- [x] Tailwind v4 via `@tailwindcss/postcss`
- [x] Security headers, CSP locked down on `/checkout/*`
- [x] `.env.example` documenting every key with empty values
- [x] Self-hosted Instrument Serif, Manrope, and JetBrains Mono via `next/font/local`
- [x] `robots.ts` with staging `disallow: /`
- [x] `sitemap.ts` for static routes
- [x] Sitemap includes products and published journal articles
- [x] `not-found.tsx`, `error.tsx` on brand
- [x] `loading.tsx` route skeletons
- [x] CI pipeline runs typecheck, lint, tests, and build

## 2. Design system

- [x] Two-layer tokens (primitives → semantic), light + dark
- [x] Fluid type with `rem` intercept + `vw` slope (text-zoom safe)
- [x] Fluid section spacing and container padding
- [x] Stepped container widths (1280 → 1440 → 1600) and `68ch` prose measure
- [x] Responsive behaviour documented for 320px through 1920px, including 400% zoom checks
- [x] Safe-area handling, `dvh`, 16px input floor
- [x] Theme system: pre-paint script, three-state toggle, transition suppression
- [x] Motion tokens shared between CSS and JS
- [x] Scroll progress, cinematic gallery, hover depth, and reduced-motion fallbacks
- [ ] Storybook or equivalent component catalogue
- [x] Container-query breakpoints applied to reusable cards

## 3. Components

- [x] `Button` — 5 variants, 4 sizes, `asChild`, loading state
- [x] `Reveal` / `RevealGroup` / `RevealItem` / `LineReveal` / `RuleAccent`
- [x] Effects: `Grain`, `MeshGradient`, `ShimmerText`, `Marquee`
- [x] `SiteHeader` — condensing sticky nav, mobile sheet with focus trap, live cart badge
- [x] `SiteFooter` — four columns, newsletter
- [x] Official Bakana logo across shared layouts
- [x] Header and footer use the untouched supplied PNG
- [x] Navigation reflows through narrow zoom states
- [x] Exact 8K logo and corrected honey product artwork
- [x] Corrected 8K honey open-box artwork
- [x] Supplied hero and product films integrated
- [x] Product gallery supports images and video
- [x] Footer year updates automatically
- [x] `NewsletterForm` — label above, error below, `role="alert"`, consent record persisted in Postgres
- [x] `ProductGallery` — scroll-snap on mobile, thumbnail rail on desktop
- [x] `BuyBox` — variant radios, quantity stepper, truthful stock line
- [x] `CartDrawer` + `CartProvider`
- [x] Toast / notification system
- [x] Form primitives (`Input`, `Select`, `Checkbox`, `Field`, `Textarea`)
- [x] Global route skeleton loader

## 4. Pages

- [x] Homepage — cinematic hero, approved product imagery, scroll parallax, ritual sequence, trade pathway
- [x] Product listing with empty state
- [x] Product detail with Product JSON-LD
- [x] Cart page (full-page, in addition to the drawer)
- [x] Checkout
- [x] Order confirmation
- [x] Wholesale landing + enquiry form
- [x] Our Story using verified records
- [~] Sourcing ledger complete; sustainability claims await evidence
- [~] Certifications holding page complete; verified claims await Q2
- [x] Journal index and article template
- [~] How to Use complete; recipes await approval
- [x] FAQ
- [x] Contact and support intake
- [~] Secure guest tracking complete; authenticated tracking awaits accounts
- [~] Account area has Clerk access and order history
- [x] Legal page structures: terms, privacy, cookies, returns, shipping
- [~] Final legal particulars await Q5 and Q6
- [x] Search results
- [x] Maintenance page

## 5. Data layer

- [~] Postgres schema — 18 tables applied; rate-limit migration generated
- [x] Money as integer minor units throughout
- [x] Append-only `stock_movements` ledger
- [x] `orders.idempotencyKey` unique index
- [x] `webhook_events` unique on `(provider, event_id)`
- [x] `order_events` audit trail
- [x] `consent_records` as rows, not a boolean
- [x] Addresses copied onto orders as `jsonb`, not referenced
- [x] Lazy DB client with small pool (serverless FD ceiling)
- [x] Seed script with opening-balance ledger rows
- [x] Catalogue queries with deployment-gated fixture fallback
- [x] Sanity client, schemas, journal queries, signed revalidation, and standalone Studio v3 built; project wshk0e58 configured
- [~] Approved packaging imagery integrated; Sanity delivery remains pending

## 6. Cart

- [x] Reservation service with the guard inside the UPDATE
- [x] **Verified: 8 concurrent requests for 1 unit → 1 success, 7 × 409, no oversell**
- [x] `GREATEST(0, ...)` clamp on release
- [x] Reservation expiry sweep function
- [x] `/api/cart/items` GET / POST / DELETE, Zod-validated, httpOnly guest cookie
- [x] 409 for stock conflicts carrying the true remaining count
- [x] Cart drawer with focus trap, free-shipping progress, empty state
- [x] Quantity editing within the drawer and full cart page
- [x] Line item thumbnails (rendered from verified 8k packaging artwork)
- [x] Cart merge on login (guest cart → customer cart)
- [~] Protected maintenance endpoint invokes reservation cleanup; scheduler configuration remains
- [ ] Free-shipping threshold from real rates *(blocked on Q5)*

## 7. Checkout and payments

- [x] Order state machine with declared transitions and terminal states
- [x] `transitionOrder()` with an optimistic status guard in the WHERE clause
- [x] **Webhook receiver: HMAC SHA-512 on raw body, constant-time compare, 401 on bad signature, 200 on duplicate**
- [x] `pending_payment → paid` writing `order_events`
- [x] Reservation converted to `sale` on payment success
- [x] `charge.failed` releases reservations
- [x] Amount and currency verified against the order before fulfilment
- [x] **Verified end to end: bad signature 401, redelivery is a no-op, 1 payment / 1 event / 1 email, stock decremented once** (`scripts/verify-webhook.ts`)
- [x] Pricing isolated in one module with a deployment gate
- [x] Order creation from cart with idempotency key
- [x] Reservation ownership transfers cart → order
- [x] `releaseAbandonedOrders()` sweeper for unpaid orders
- [x] Paystack transaction initialisation
- [x] Checkout page, single column, minimal chrome, `noindex`
- [x] `inputmode` / `autocomplete` / 16px on every field
- [x] Order summary, sticky on desktop, collapsible on mobile
- [x] Confirmation page that **never** shows success optimistically
- [~] Protected maintenance endpoint invokes abandoned-order cleanup; scheduler configuration remains
- [x] Reconciliation job for missed webhooks
- [x] Idempotent full and partial Paystack refunds with webhook lifecycle
- [ ] Real tax determination *(blocked on Q3 — gate refuses deployed checkout)*
- [ ] Real shipping rates *(blocked on Q5 — gate refuses deployed checkout)*
- [ ] Discount code application at checkout
- [ ] USD checkout *(blocked on Q4)*
- [ ] Live test against Paystack test keys (currently verified with a local secret)

## 8. Email

- [x] Schema (`email_sends`) with tier and shed reason
- [x] Resend client and queue-draining wrapper
- [x] Daily quota counter with tiered shedding (Tier 1 never sheds)
- [x] Templates: order confirmed, shipped, delivered
- [x] Templates: payment failed, cancelled/refunded
- [~] Distributor acknowledgement complete; welcome awaits accounts
- [ ] SPF, DKIM **and DMARC** on the sending domain
- [ ] One-click unsubscribe (RFC 8058) on marketing mail
- [ ] Volume alarm at 80 sends/day

## 9. Accounts

- [x] Sign up / login / logout built; Clerk and native customer session with first-login password setup supported
- [~] Email verification delegated to Clerk; configuration pending
- [ ] Password reset via Resend
- [~] Order history complete; account detail view pending
- [ ] Saved addresses
- [ ] Communication preferences
- [ ] Self-serve data export and account deletion *(NDPA requirement)*
- [ ] Distributor account type and wholesale pricing visibility

## 10. Wholesale / B2B

- [x] Schema (`wholesale_enquiries`)
- [x] Dual-path fork on homepage and in mobile nav
- [x] Enquiry form and submission handler
- [x] Enquiry acknowledgement email
- [ ] Admin pipeline view
- [ ] Quote → pro-forma invoice → bank transfer flow
- [ ] Export documentation checklist per order *(blocked on Q2)*

## 11. Admin panel

- [~] Clerk auth gates admin; credentials pending
- [x] RBAC roles and mandatory 2FA gate
- [ ] Append-only audit log view
- [~] Dashboard KPIs complete; notifications pending
- [ ] Product and stock management
- [ ] Order management with status transitions
- [ ] Refund and cancel actions
- [ ] Customer management
- [ ] Analytics (sales, orders, customers, inventory, distributor pipeline)
- [ ] Settings (shipping, tax, email templates, FX source)

## 12. Compliance and operations

- [x] CSP blocking third-party scripts on checkout
- [x] Consent records schema
- [x] Newsletter consent written to `consent_records` when Postgres is available
- [x] No fabricated regulatory data anywhere in the codebase
- [ ] Cookie consent banner gating analytics and pixels
- [ ] Privacy policy citing NDPA 2023 + GAID 2025 *(blocked on Q6)*
- [ ] Erasure job spanning Postgres, Sanity and Resend
- [ ] Data retention policy
- [ ] Sentry error monitoring
- [ ] Uptime monitoring on the storefront and the webhook endpoint specifically
- [ ] Quota alarms at 70% / 90% (Vercel, Sanity, Resend)
- [ ] Staging environment with app-level auth and `noindex`
- [ ] Backup and tested restore procedure
- [ ] Portability drill: deploy the current commit to the named alternative host

## 13. Testing

- [~] Money formatting tests complete; FX stamping awaits implementation
- [ ] Integration tests for cart and reservation
- [~] Webhook verification script covers idempotency; suite integration pending
- [ ] E2E checkout (Playwright)
- [ ] Concurrency regression test *(behaviour verified manually; not yet automated)*
- [ ] Accessibility audit: keyboard-only checkout, screen reader, 400% zoom
- [ ] Core Web Vitals on field data (LCP, **INP**, CLS)

## 14. AI shopping guide

- [x] Streaming shopping assistant shell
- [x] Verified catalogue search tool
- [x] Product result cards and links
- [x] Regulated-claim safety instructions
- [x] Checkout-route exclusion
- [x] Database-backed request rate limiting
- [ ] Authenticated order lookup tool
- [ ] Conversation persistence
- [ ] Production AI Gateway credentials

---

## Known gaps carried deliberately

| Gap | Why |
|---|---|
| No published certification number | Blank in Discovery. Regulated product — will not be invented. |
| Fixture prices | Placeholders, labelled, refused in deployed environments. Blocked on Q7. |
| Approved imagery remains local | Exact-source 8K WebP masters ship locally. Sanity migration awaits credentials. |
| Free-shipping threshold is a guess | Blocked on Q5. |
| Vercel Hobby licence exposure | Client decision, accepted with mitigations. See roadmap §14.6. |
