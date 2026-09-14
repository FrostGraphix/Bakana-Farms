# Repository Agent Standards — Bakana Farms

Engineering standards for this codebase. Shared across all AI agents (Claude, Codex, Cursor). Every rule here is mandatory.

This is a premium wellness e-commerce platform for **Bakana Farms Limited**, a Nigerian agricultural company exporting a Moringa, Honey and Ginger blend. It is **B2B first, B2C second**. It handles money, personal data, and a NAFDAC-regulated food product. Most rules below exist because getting them wrong costs the client real money or real legal exposure, not because of style preference.

---

## Delivery Standard

A task is not complete until both pass:

```bash
./node_modules/.bin/tsc.cmd --noEmit      # types
./node_modules/.bin/next.cmd build        # production build
```

If a change cannot satisfy both, report the blocker instead of claiming completion.

**Do not use `npx tsc`.** On this machine `npx` resolves to a different `tsc` and fails with "This is not the tsc command you are looking for". Always call the local binary directly.

Typecheck takes seconds. Build takes about a minute. Run the typecheck constantly; run the build before declaring done.

---

## The Data Boundary — Non-Negotiable

**Postgres is the system of record. Sanity holds editorial content only.**

| Data | Store |
|---|---|
| Orders, order lines, payments, refunds | Postgres |
| Customers, addresses, consent records | Postgres |
| Product **price**, **stock**, SKU, variant, tax class | Postgres |
| Inventory movements | Postgres, append-only ledger |
| Admin audit log | Postgres, append-only |
| Founder story, blog, FAQ, homepage sections, page SEO | Sanity |
| Product name, description, imagery, marketing copy | Sanity |

Three reasons this boundary is absolute:

1. **Volume.** Sanity's free tier caps at 10,000 documents and Growth at 25k–50k. One order plus one customer document per transaction burns that quota within the first few thousand orders, and the fix is a migration, not a setting.
2. **Correctness.** Content Lake has no row locking and no serialisable transaction. "Check stock, then create order" is not atomic there, so two concurrent checkouts on the last unit both succeed.
3. **Erasure.** The NDPA and GAID 2025 require a real deletion path. Content stores are built to retain drafts and history, which is the opposite of what erasure needs.

### Hard prohibitions

- Writing an order, customer, payment, price or stock value to Sanity
- Reading a price or stock level from Sanity
- Adding a Sanity schema field that holds personal data
- Any "temporary" denormalisation of commerce data into the CMS

---

## Money

**Money is always an integer in minor units** (kobo, cents). Never `numeric`, never a float, never a formatted string in the database.

```ts
// ✅ correct
priceNgn: integer("price_ngn").notNull()   // 1200000 === ₦12,000

// ❌ forbidden
price: numeric("price", { precision: 10, scale: 2 })
```

`0.1 + 0.2 !== 0.3`. An order total off by one kobo is a reconciliation failure that costs more to find than it ever cost to prevent.

**Display rules differ per currency and must not be shared.** Use `formatMoney()` from `@/lib/utils`:

- **NGN** renders whole. Kobo is not in practical circulation and showing it reads as an error.
- **USD** keeps both decimals. Dropping them rounds the displayed price away from what the gateway actually charges.

Only the display is rounded. Never the arithmetic.

### FX

USD display is derived from a single named source, cached, and **stamped onto the order at the moment of charge** (`orders.fxRateMicros`, `orders.fxRateSource`). Never recompute a historical order's total at today's rate. The customer is owed the number they were charged at.

Never display a converted price the gateway will not honour.

---

## Inventory and the Reservation Race

This is the single most important correctness rule in the codebase.

**The stock guard lives inside the UPDATE statement**, never in a preceding read:

```ts
// ✅ correct — the database refuses to over-reserve
const reserved = await tx
  .update(schema.variants)
  .set({ stockReserved: sql`${schema.variants.stockReserved} + ${quantity}` })
  .where(and(
    eq(schema.variants.id, variantId),
    sql`${schema.variants.stockOnHand} - ${schema.variants.stockReserved} >= ${quantity}`
  ))
  .returning({ id: schema.variants.id });

if (reserved.length === 0) {
  // Someone took the stock between our read and our write.
}
```

```ts
// ❌ forbidden — two concurrent requests both pass this check
const variant = await db.query.variants.findFirst(...)
if (variant.stockOnHand >= quantity) { await db.update(...) }
```

Verified behaviour: 8 concurrent requests for 1 remaining unit produce exactly 1 × `200` and 7 × `409`. Any change to `src/server/cart/service.ts` must preserve that.

### Other inventory rules

- `stock_movements` is **append-only**. Never update or delete a row. `stockOnHand` is a cached derivation of it.
- Reservation releases clamp with `GREATEST(0, ...)`. A double-release must never drive the counter negative and corrupt availability.
- Reservations expire (`RESERVATION_MINUTES`). Without the sweep, an abandoned cart holds the last pack of a batch forever.
- **Scarcity messaging must be true.** "Only 9 left from this batch" is permitted only because the ledger can prove it. Manufactured urgency is out of bounds for this brand.

---

## Orders, Idempotency and Webhooks

### Order state machine

```
pending_payment → paid → processing → packed → shipped → delivered
```

with `payment_failed`, `cancelled`, `refunded`, `partially_refunded` as branches. Nothing skips ahead — an order cannot reach `shipped` without having passed `paid`.

Every transition writes a row to `order_events` and may fire **exactly one** email.

### Idempotency — both layers are required

1. **Checkout:** `orders.idempotencyKey` carries a unique index. A double-submit or retried request must not create two orders.
2. **Webhooks:** `webhook_events` is unique on `(provider, event_id)`. Persist the event, then process. Gateways **do** resend, and without this a duplicate delivery double-fulfils the order.

### Paystack webhook handling

```ts
// Verify BEFORE processing. Non-negotiable sequence:
// 1. HMAC SHA-512 of the RAW body, keyed with the secret key
// 2. Compare in constant time against the x-paystack-signature header
// 3. Return 200 immediately
// 4. Process asynchronously
```

SHA-512, not SHA-256. Against the **exact raw body**, not a re-serialised object.

A reconciliation job must exist that queries the gateway for transactions with no matching local order and repairs the gap. A silent webhook failure means an order was paid for and never recorded.

---

## Payments — Paystack Only

**Stripe is not available to a Nigerian-registered business.** Nigeria does not appear in Stripe's supported countries; it appears under "Extended network", which links to Paystack. Do not add a Stripe integration, a Stripe key, or a Stripe branch.

Paystack carries both NGN and USD for Nigerian merchants. USD requires a domiciliary account and international card acceptance requires compliance approval.

### PCI DSS

Card fields stay gateway-hosted and no raw card data touches our infrastructure. Necessary, but since **31 March 2025 no longer sufficient** — SAQ A eligibility also requires that the page framing the payment is not susceptible to script attacks.

Therefore, on `/checkout/*`:

- **No third-party scripts. None.** No GA4, no Meta/TikTok/Google pixels, no Hotjar or Clarity, no chat widget.
- The CSP in `next.config.ts` is the enforcement point. Do not widen it casually.
- Conversion on checkout steps is measured **server-side** from confirmed orders, not from an analytics script.

Store only `cardLast4` and `cardBrand`. Never a PAN, never a CVV, never a full expiry.

---

## Data Protection — NDPA, not NDPR

The **NDPR 2019 is repealed.** The governing law is the **Nigeria Data Protection Act 2023** plus the NDPC **General Application and Implementation Directive (GAID) 2025**, effective 19 September 2025. Do not cite the NDPR in code comments, privacy copy, or documentation.

- Consent is a **row in `consent_records`**, never a boolean on the customer. An audit asks "which notice did they agree to, and when" — a flag cannot answer that. Record purpose, notice version, source and timestamp.
- Erasure must actually delete across Postgres, Sanity and Resend. Financial records are retained only where law requires, with PII nulled and `anonymisedAt` set.
- Processing personal data of more than 200 data subjects in six months triggers DCPMI classification. A store with a newsletter crosses that quickly.

---

## Never Invent Client Data

Discovery left specific fields blank. These must **never** be fabricated, filled with a plausible-looking value, or used as a placeholder that could ship:

- NAFDAC registration number, certifications, lab results
- Nutritional panel figures
- Prices and MOQs (the fixtures are labelled placeholders and are refused in deployed environments)
- Company registration number, trading address, phone numbers
- Export destination markets, shipping rates
- Founder or team biography details beyond the Discovery workbook

This is a regulated food product. An invented NAFDAC number is a legal problem, not a TODO.

Where a value is missing, leave the section out and comment why. Do not render an empty shell that looks like a bug.

---

## Free-Tier Constraints Are Load-Bearing

The project runs on free tiers by explicit client decision. These are not theoretical limits.

| Constraint | Consequence for code |
|---|---|
| Vercel Hobby retains runtime logs **1 hour**, no log drains | Platform logs cannot answer "was this customer charged?" the next morning. **Every payment-relevant event is written to Postgres by the application itself.** `order_events` and `webhook_events` are the audit trail. |
| Vercel Hobby WAF: 3 custom rules | Rate limiting is **application-layer**, backed by Postgres. Do not depend on WAF rules. |
| Vercel quota breach = **30-day feature lockout**, no overage billing | Alarm at 70% and 90% of every quota. A traffic spike can disable part of the site for a month. |
| Vercel image transformations: 5,000/month | **Serve imagery from Sanity's CDN with transform params**, not `next/image`'s Vercel-side optimisation. |
| Resend free: **100 emails/day**, 1 domain | Lifecycle email is **tiered and shed** under load. Order confirmation never sheds. See below. |
| Sanity free: 10,000 documents, 250k uncached API requests | Storefront reads go through the **CDN-cached** API. |

### Email tiering

- **Tier 1, always send:** order confirmed, shipped, delivered
- **Tier 2, shed above 60% of daily quota:** processing/packed, out for delivery
- **Tier 3, always send:** payment failed, cancelled/refunded

Shedding is logged (`email_sends.shedReason`), never silent.

Before templates, the domain needs **SPF, DKIM and DMARC**. SPF and DKIM alone fail Gmail and Yahoo bulk requirements.

---

## Design System

`src/app/globals.css` is the source of truth. Tokens are **two-layer**.

```
primitives  (--color-forest, --color-gold)   ← fixed, NEVER referenced by a component
semantic    (--surface-page, --text-primary) ← the only thing components consume
```

Only the semantic layer flips between themes. A component that reads a primitive cannot be themed.

### Hard prohibitions

- ❌ A hex value in a component file
- ❌ A primitive token (`--color-gold`) in a component; use `--accent-line` or `--accent-text`
- ❌ Defining a colour **only** inside a media query or `[data-theme]` block. `:root` carries the complete light palette as baseline, or the token is undefined in the other state.
- ❌ A `body` without an explicit token background. The browser default leaks white at the edges in dark mode.

### Colour rules with measured values

- `gold` on `ivory` is **2.13:1**. It is a line and icon colour on light surfaces, **never text**.
- `gold-light` on `forest` is **8.79:1 (AAA)**. In dark mode the accent **can** carry text.
- `neutral-500` on `ivory` is **4.37:1 — it fails AA.** Use `neutral-700` (8.96:1) for anything a user must read.

### Typography

- Fluid steps use `clamp()` with a **`rem` intercept plus a `vw` slope**. A bare `vw` preferred value does not respond to browser text-zoom and fails **WCAG 1.4.4**. Never simplify these formulas.
- **Body text is fixed at 16px and inputs must never render below it.** Below 16px, iOS Safari auto-zooms the viewport on input focus, which is disorienting mid-checkout and a known conversion loss.

### Fonts are self-hosted

`next/font/local` reading from `src/app/fonts/`. Do **not** switch to `next/font/google`. It performs a network fetch at build time, which fails behind proxies that interfere with Node's TLS (it did here, and only passed locally because of a stale cache). Self-hosting also keeps visitor IPs away from a third-party CDN.

---

## Motion

- **Animate `transform` and `opacity` only.** Animating width, height, top or margin forces layout every frame and directly damages the INP ≤ 200ms target.
- **Never drive continuous values through React state.** Scroll progress, pointer position and parallax use `useMotionValue` / `useTransform` / `useScroll`. `useState` re-renders the tree on every frame.
- **`window.addEventListener("scroll")` is banned.** Use `useScroll`, `useMotionValueEvent`, or IntersectionObserver.
- **Every animation honours `prefers-reduced-motion`** with a real fallback, not just removal. The marquee becomes a scrollable strip; the shimmer settles to solid gold.
- **Budget: one marquee and one shimmer per page.** A sweep on every headline makes a premium brand look like a crypto site.
- Every animation must be justifiable in one sentence — hierarchy, sequence, feedback, or state change. "It looked good" is not one.
- **No scroll-triggered motion on the checkout route.**

---

## Accessibility

WCAG 2.2 AA is the floor.

- Touch targets: **24×24 CSS px is the AA minimum (SC 2.5.8)**; 44px is our comfort standard for primary mobile actions. The quantity stepper, gallery dots and close buttons are the usual offenders.
- Labels go **above** inputs. Placeholder is never a label.
- Errors go **below** the field, with `role="alert"` and `aria-describedby`.
- Modals, drawers and sheets: focus trapped, Escape closes, focus returns to the opener, body scroll locked.
- Colour is never the only signal. Stock states pair colour with words.
- Every page must pass at **400% browser zoom** (SC 1.4.10 Reflow), not merely at a narrow viewport. Wide tables scroll inside their own container; the page body never scrolls horizontally.

---

## Fixtures and Environment Gating

`src/server/catalog/fixtures.ts` carries **placeholder prices**. The guard in `queries.ts` refuses to serve them from a deployed environment.

The gate keys on a **deployment signal** (`VERCEL_ENV` / `DEPLOY_ENV`), **not `NODE_ENV`**. `next build` sets `NODE_ENV=production` for a local build too, so keying off it would block development while protecting nothing — a laptop build is not serving anyone.

`generateStaticParams` tolerates an unreachable database at build time and degrades to on-demand rendering. That tolerance is **confined to build time**. The runtime query stays strict so a live request never silently serves stale or fixture data.

---

## Secrets

- Never commit a real key. `.env.local` is git-ignored; `.env.example` documents the shape with empty values.
- Never expose a Sanity write token, a Paystack secret key, or a webhook secret to the browser. `NEXT_PUBLIC_*` is a public value by definition.
- Separate keys per environment. Test gateway keys only on staging.

---

## Local Database

Postgres runs in Docker on **port 5433** (avoids collision with any system Postgres).

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Two environment gotchas already solved — do not "fix" them back:

- The compose image is `public.ecr.aws/docker/library/postgres:17-alpine`, the **AWS mirror** of the official image. Docker Hub pulls stall indefinitely on this network.
- `drizzle.config.ts` and `seed.ts` load `.env.local` via `dotenv` explicitly. drizzle-kit runs outside the Next.js runtime and does not inherit it.

Schema changes go through migrations only: `npm run db:generate`, then `npm run db:migrate`. Never hand-edit a database.

---

## Component and File Placement

```
src/
  app/                    routes, layouts, route handlers
  components/
    ui/                   primitives (button, reveal)
    layout/               header, footer
    sections/             page-level composed sections
    product/              PDP-specific
    cart/                 cart provider + drawer
    effects/              grain, mesh, marquee, shimmer
    theme/                theme script + toggle
    forms/                form components
  lib/                    framework-free helpers (utils, motion tokens)
  server/
    db/                   schema, client, seed
    catalog/              product queries, types, fixtures
    cart/                 cart + reservation service
```

- Anything touching the database lives under `src/server/`. A `"use client"` component **never** imports from `src/server/db`.
- `src/lib/` stays framework-free and importable from either side.
- Client components fetch through `/api/` routes. They never query Postgres directly.

---

## TypeScript

- `strict` and `noUncheckedIndexedAccess` are on. Array access returns `T | undefined` — handle it, do not assert it away.
- No `any` unless there is no practical alternative, and remove it before finishing.
- No `@ts-nocheck`. No `@ts-ignore` without an inline reason.
- Do not disable a lint rule to avoid fixing the real problem.

---

## Commit Message Standard

- Format: `type: description`
- Single-line, lowercase subject, 72 characters or fewer, no trailing period
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

Good: `fix: clamp reservation release at zero`
Bad: `Fix: Clamp Reservation Release At Zero`

Never `--no-verify` on commit or push. Fix the underlying failure.

---

## Copy and Content Standards

The brand voice is warm, premium, honest, educational without being clinical. Discovery explicitly rejects anything that reads cheap, cluttered, pharmaceutical, or like generic "local herb" packaging.

- **No em dashes** in user-facing copy. Use a period, a comma, or restructure.
- No filler verbs: "elevate", "seamless", "unleash", "revolutionise".
- No fabricated precision. A number in the UI is real data or it does not appear.
- No fake urgency, no countdowns, no invented stock scarcity.
- Product imagery is real farm and product photography. Stock imagery is explicitly rejected by the client. Placeholders carry a `TODO` naming the shot required.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
