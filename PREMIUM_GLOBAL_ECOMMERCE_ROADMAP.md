# Bakana Farms Premium Wellness Commerce Roadmap

## 1. Product north star

Build Bakana Farms into a warm, premium and trustworthy commerce platform for its Moringa, Honey and Ginger Blend. The site is **B2B first and B2C second**. It helps a buyer understand the product, select a pack, buy safely, and receive clear post-purchase care. It also gives prospective distributors an appropriate path to enquire without inventing export capability or terms.

Bakana Farms is not a generic fresh-produce marketplace. Launch scope is a regulated packaged food product, with fixed-weight variants, Nigeria-only consumer checkout, and wholesale enquiry. Farm boxes, variable-weight goods, subscriptions, delivery slots, other countries and additional products are future possibilities, not assumptions.

### Experience principles

1. **Trust before conversion.** Clearly show what is verified, the selected pack, truthful availability, price, delivery policy once confirmed, and secure payment before checkout.
2. **Education without health claims.** Explain ingredients, preparation and provenance in a warm, factual voice. Do not imply medical outcomes or invent nutrition, certification, test, NAFDAC, export or sustainability data.
3. **Premium restraint.** The experience should feel calm and deliberate, never pharmaceutical, cluttered, rustic or urgency-driven.
4. **Fast and accessible by default.** Mobile browsing must feel immediate. WCAG 2.2 AA, keyboard operation, 400% reflow, 16px input text and reduced-motion fallbacks are launch requirements.
5. **Correctness is part of the brand.** Price, stock, payment state and order status come from server-side transactional data. A polished interface must never promise a value the system cannot honour.

## 2. Non-negotiable architecture

| Concern | Decision | Why it is load-bearing |
|---|---|---|
| Storefront | Next.js App Router, React, TypeScript and Tailwind | Existing application foundation |
| Commerce system of record | PostgreSQL with Drizzle | Atomic inventory, durable orders, auditability and deletion paths |
| Editorial content | Sanity, when configured | Founder story, journal, FAQs, campaigns, SEO and product marketing copy only |
| Payments | Paystack only | The Nigerian business requires Paystack. Do not add Stripe or a payment-provider branch without an explicit business decision |
| Product media | Sanity CDN with transform parameters | Preserves Vercel free-tier image quota. Replace placeholders with real commissioned photography |
| Fonts | Self-hosted through `next/font/local` | No build-time Google fetches or third-party font requests |
| Email | Resend, queued and tiered | Transactional lifecycle messages must be auditable and protected under the daily free-tier limit |
| Operational data | Postgres, append-only where required | Orders, prices, stock, customers, consent, payments, refunds and audit records never belong in Sanity |

### Data boundary

Postgres owns products' SKU, fixed pack weight, price, stock, tax class, cart, order, payment, refund, customer, address, consent, inventory movement and admin audit data. Sanity owns editorial copy, imagery and page content. Product presentation joins the two at the server boundary.

Money is always stored and calculated as integer minor units. Order lines snapshot the purchased title, SKU, unit price, quantity, tax treatment, discounts and shipping address so historical receipts stay correct.

### Compliance and operational gates

Do not make a production claim or activate a workflow until the client supplies the relevant source data.

| Decision required | What remains gated |
|---|---|
| Real price and MOQ | Deployed catalogue and B2B pricing |
| VAT classification | Final tax calculation |
| Domestic logistics rate card | Final shipping and any free-delivery threshold |
| NAFDAC and exporter information | Certification and export claims |
| USD domiciliary account and approval | USD presentation and checkout |
| DPO and privacy inputs | Privacy policy and final data-rights workflow |
| Final domain and authenticated mail DNS | Production SEO and transactional email |

## 3. Design system and creative direction

`src/app/globals.css` is the design-system source of truth. It uses a two-layer token model:

```text
primitives: fixed forest, gold and neutral values
semantic: surface, text, border, action and status values consumed by components
```

Components consume semantic tokens only. Themes swap semantic values, never component-level hex values or primitive tokens.

### Visual direction

- Warm, editorial and modern. Farm and product photography should carry most of the atmosphere.
- Use real Bakana Farms photography only. Existing image placeholders carry a TODO for the shot required and cannot ship as stock imagery.
- Keep product price, variants, stock and purchase actions on solid, high-contrast surfaces.
- Gold is an accent line or icon on light surfaces, not readable body text. Use the dark-mode light-gold pairing only where contrast supports text.
- Keep glass or translucency for transient UI only, such as navigation, cart and an eventual search overlay. Every layer needs an opaque accessible fallback.
- Use Lora for display moments and Geist for interface/body text. Body and form controls never drop below 16px.
- One marquee and one shimmer maximum per page. Animate transform and opacity only. Checkout has no scroll-triggered motion.

### Premium commerce reference qualities

The target is a premium global-commerce standard expressed through Bakana Farms' own brand, content and interface. These are interaction and quality references, not permission to reproduce another brand's identity, layouts, copy, assets or trade dress.

| Layer | Best references to cherry-pick | Bakana Farms interpretation | Scope |
|---|---|---|---|
| Premium visual language | Apple and Aesop | Calm layouts, precise typography, tactile detail, cinematic real product storytelling and disciplined component craft | Launch |
| Fashion and editorial browsing | Nike and Zara | Image-led category discovery, seasonal editorial modules and look-based storytelling translated into farm, preparation and routine content | Launch with approved photography and editorial content |
| Product discovery | Sephora | Ingredient education, search, filters, comparison, review moderation, approved bundles and loyalty. The blend catalog stays simple until more products make these tools useful | Search, reviews, bundles and loyalty are later |
| Conversion and trust | Amazon | Explicit price and delivery breakdown, truthful availability, helpful complementary products, confirmed order states, recovery from payment interruption and reorder flow | Core confidence flows at launch. Recommendations and reorder evolve later |
| Product customization | Tesla and Warby Parker | Guided, visual pack-size, quantity and approved bundle choices. Every decision updates real server-provided price and stock. The ingredients are never silently altered or treated as a build-your-own formula | Launch for variants. Bundles follow approved pricing and stock rules |
| Complex catalogue and omnichannel | IKEA | Context-rich product education, stock visibility, practical packaging information, planning tools and fulfilment clarity | Stock and packaging clarity at launch. Pickup, planning tools and omnichannel need a confirmed operating model |
| Customer account and loyalty | Starbucks and Sephora | Saved packs, preparation preferences, purchase history, reorder, communication controls and genuinely useful offers | Accounts first. Rewards and offers require approved terms, consent and financial rules |
| International commerce | Airbnb-style localization and Shopify Markets | Country-aware currency, language, payment method, catalogue, taxes and delivery rules, each set server-side and preserved through checkout | Future expansion after approved markets, logistics, tax, USD capability and export compliance |

### Interaction patterns to apply

- **Editorial-to-commerce handoff:** a campaign or journal story always lands on a clear product, preparation or wholesale action.
- **Progressive product decision:** select pack size, see price and availability, then add to cart. Avoid exposing a dense wall of options for a simple product.
- **Persistent purchase clarity:** on longer product pages, retain a compact purchase summary on desktop and a mobile-safe purchase action without obscuring content.
- **Confidence signals through facts:** surface the chosen variant, item count, price breakdown, secure payment provider and real order state. Never substitute generic trust badges, countdowns or fabricated reviews.
- **Loyalty through service:** save a preferred pack, reorder, track orders and manage communication preferences once accounts are implemented. Do not gate core purchase behind membership.

### Shared component standards

Every async component supplies loading, empty and error states. Every modal, drawer and overlay traps focus, closes with Escape, returns focus to the opener and locks body scroll. All controls meet a 24px minimum target, with 44px preferred for primary mobile actions.

## 4. Experience roadmap

| Phase | Outcome | Main deliverables | Exit criteria |
|---|---|---|---|
| 0. Decision gates | A verified launch scope | Price/MOQ, tax, domestic rate card, legal and regulatory inputs, launch domain | No buyer-facing fact is fabricated |
| 1. Brand shell | A credible, accessible storefront | Theme tokens, self-hosted fonts, header, footer, skip link, error states, cookie-consent design | Keyboard navigation and light/dark themes pass |
| 2. Product discovery | Shoppers can understand the blend | Home, product listing, PDP, imagery, editorial story, preparation guidance and FAQs | Presentation content is real or intentionally absent |
| 3. Safe conversion | Guest purchase works correctly | Cart, checkout, Paystack handoff, confirmation and webhook flow | Inventory race, idempotency and payment lifecycle proven end to end |
| 4. B2B conversion | Distributors have a trustworthy path | Wholesale landing, enquiry form, acknowledgement and staff workflow | No unverified MOQ, export or certification claim appears |
| 5. Customer care | Customers can self-serve safely | Transactional email, order tracking, accounts, preferences and data-rights requests | Authorization, consent and retention rules verified |
| 6. Operations | Team can operate with confidence | Admin roles, stock management, order transitions, refunds and audit view | Every sensitive mutation is audited |
| 7. Growth and resilience | Measured, maintainable commerce | Search, consent-aware analytics, editorial CMS, monitoring, backups and test automation | Core journeys, accessibility and recovery plans pass |

## 5. Component inventory

### A. Foundation and navigation

| Component | Requirements |
|---|---|
| App shell | Pre-paint theme selection, semantic tokens, skip link, error boundary, cookie preferences when analytics is introduced, no hard-coded component colours |
| Header | Sticky desktop navigation, accessible mobile sheet, product and wholesale paths, cart count, theme toggle. Account and search appear only when their underlying services exist |
| Footer | Newsletter capture, real policy links once legally approved, editorial navigation and only verified contact/social information |
| Toast system | Accessible status updates for cart and forms, including a non-colour success/error signal. Build before adding more client-side flows |
| Search overlay, later | Cmd/Ctrl+K discovery surface with keyboard navigation, recent searches and accessible result states. It must degrade to standard browsing if the search service fails |

### B. Product discovery and editorial commerce

| Component | Requirements |
|---|---|
| Editorial home | Hero, product path, wholesale path, provenance storytelling, journal teaser and newsletter. Use restrained campaign motion and real photography |
| Product listing | Product grid, clear availability state, empty state and server-provided price. Add filtering only when a multi-product catalogue makes it useful |
| Product card | Responsive image, name, selected starting price and availability. Do not add fake badges, ratings, discount claims or urgency |
| Product detail | Gallery, selected fixed-weight variant, price, truthful stock message, preparation, ingredients and editorial product information. Structured data reflects only verified fields |
| Pack configurator | A focused selector for approved pack size, quantity and later approved bundles. It updates only from server-provided price and availability, preserves selection in cart and clearly explains unavailable options |
| Provenance and preparation panel | Ingredient source, production method, preparation and storage guidance sourced from approved content. Omit unknown harvest, nutrition, certification or shelf-life fields |
| Editorial modules | Founder story, journal, recipes and FAQs managed in Sanity. Recipes can add existing fixed variants to cart without overwriting a shopper's cart |
| Recommendation rail, later | Complementary or recently viewed products with graceful fallback. Never block page rendering or fabricate personalization |

### C. Cart, checkout and post-purchase

| Component | Requirements |
|---|---|
| Cart drawer | Focus-trapped drawer with remove, stock-aware subtotal, truthful delivery note and checkout action. Add quantity editing, line-item images and undo next |
| Cart page | Full-page order review, line edits, clear price/shipping/tax breakdown, stock messages and persistent checkout CTA. Activate only after the rate card and tax determination permit final totals |
| Checkout | Minimal chrome, no third-party analytics or widgets, labelled address fields, 16px inputs, Paystack redirect and a stable idempotency key per attempt |
| Order summary | Server-calculated subtotal, shipping, tax, discount and total. Provisional information is never chargeable in deployment |
| Confirmation | Never trust a redirect alone. Verify server-side payment state and display only confirmed payment/order information with a support path |
| Order tracking, later | Guest lookup and authenticated view using the order reference plus secure ownership verification. Show the real state machine, never an invented delivery ETA |
| Returns/refunds, later | Server-side eligibility, explicit refund confirmation, Paystack refund integration and an immutable order timeline |

### D. B2B and customer care

| Component | Requirements |
|---|---|
| Wholesale landing | Clear distributor proposition and enquiry CTA. It must not display a price, MOQ, destination market or export-document claim until confirmed |
| Wholesale enquiry | Validated form, consent record, acknowledgement email and staff-visible pipeline. Store personal information in Postgres only |
| Account centre, later | Secure profile, addresses, order history, saved packs/reorder, communication preferences, export/deletion request and distributor access controls |
| Newsletter | Explicit purpose-based consent, notice version and source. Marketing mail supports one-click unsubscribe and never shares a consent boolean with transactional mail |
| Support entry | Approved FAQ and contextual contact paths. Do not expose personal staff or delivery contact data publicly |

### E. Operations and growth

| Component | Requirements |
|---|---|
| Admin dashboard | Role-safe order, stock and enquiry overview with empty/error states. Require mandatory 2FA before release |
| Order workspace | Payment and fulfilment timeline, controlled state transitions, notes, refund/cancellation actions and append-only audit events |
| Inventory console | On-hand, reserved and available stock. Adjustments require a reason and append an inventory movement. Never update the movement ledger |
| Content workflow | Sanity schemas and preview for editorial content only. Commerce fields remain in Postgres |
| Analytics, later | Typed, consent-aware server-side event layer. Checkout conversion is recorded from confirmed orders, never a checkout pixel |

## 6. Server modules and required behaviour

| Module | Responsibilities | Non-negotiable behaviour |
|---|---|---|
| Catalogue | Postgres price, stock, SKU and variants plus Sanity editorial join | Fixture data is refused in deployed environments |
| Inventory | Reservations, release, sales and adjustments | The availability check lives inside the conditional `UPDATE`; movements are append-only |
| Pricing | Tax, shipping, discounts and later FX | Server calculated. Final deployed checkout is disabled until tax and shipping are confirmed |
| Cart | Guest cart, reservation ownership and stock conflicts | Client never holds inventory authority. Releases are clamped at zero |
| Checkout | Cart-to-order creation and Paystack initialization | Idempotency key is unique, historical line/item/address values are snapped, and cart hold transfers safely |
| Orders | State transitions, refunds, audit events and status emails | Transitions have optimistic guards and follow the declared state machine |
| Payments | Paystack initialization, verification, webhook deduplication and reconciliation | SHA-512 HMAC over the raw body, constant-time comparison, unique provider event record and no redirect-only success |
| Notifications | Queued transactional and marketing email | Tier 1 order mails never shed; quota shedding is recorded rather than silent |
| Content | Sanity read client, schemas, preview and CDN images | No personal or commerce data in Sanity |
| Identity, later | Customer accounts, role-based staff access and privacy actions | Server-side authorization, records of consent and real erasure/anonymisation paths |

### Required background jobs

- Cart reservation expiry and unpaid-order reservation release.
- Paystack reconciliation for paid transactions without a matching local order.
- Transactional email queue draining, daily quota accounting and shedding logs.
- Once Sanity is live, cache invalidation for editorial changes.
- Once search is justified, asynchronous index updates that cannot block browsing.
- Data-retention and erasure processing across Postgres, Sanity and Resend.

## 7. Data model evolution

```text
Product -> Variant -> StockMovement
Product -> SanityEditorialDocument / Media / FAQ / JournalContent
Cart -> CartItem -> Reservation
Order -> OrderItem -> Payment / OrderEvent / EmailSend
Customer -> Address / ConsentRecord / AccountPreference
WholesaleEnquiry -> StaffWorkflow
StaffUser -> Role -> AdminAuditEvent
```

Future entities need an explicit product and operating-model decision before implementation. Examples include `DeliveryZone`, `DeliverySlot`, `SourceLot`, `Subscription`, `Wishlist`, `Promotion`, `Recipe`, `FarmBox` and multi-currency `PriceSet`. They do not belong in launch scope simply because they are common ecommerce features.

## 8. API and integration standards

- Validate every mutation with Zod and return intentional field-level errors.
- Require idempotency for checkout, payment initiation, refund and staff actions that may retry.
- Keep client components behind `/api/` routes. They do not import the database or server modules directly.
- Verify and deduplicate webhooks before applying fulfilment side effects.
- Queue non-critical work such as email and analytics. Checkout must not wait for it.
- Rate-limit sensitive routes in the application layer and retain payment-relevant application events in Postgres.
- Use adapters at the boundary when a confirmed new provider is introduced. Do not add speculative integrations.

## 9. Quality gates

### Performance

- Sanity CDN images use transform parameters rather than Vercel image optimization.
- Cache public catalogue/editorial reads. Never publicly cache cart, customer, payment or order data.
- Test the product page and checkout on a constrained mobile network.
- Maintain LCP, INP and CLS budgets per template. Animate transform/opacity only.

### Accessibility

- WCAG 2.2 AA is the floor, including keyboard use, visible focus, semantic headings, above-field labels, alerts below invalid fields, colour-independent state and 400% zoom reflow.
- Audit header, product variant selection, cart drawer and checkout with keyboard and screen reader before launch.

### Security and privacy

- Card data stays in Paystack-hosted fields. Store only permitted payment metadata such as last four digits and card brand.
- The checkout CSP remains narrow. Do not add analytics, pixels, chat or other third-party scripts to `/checkout/*`.
- Meet the Nigeria Data Protection Act 2023 and GAID 2025. Do not cite repealed NDPR guidance.
- Retain financial records where law requires, anonymise personal data when appropriate and preserve a real cross-system erasure path.

### Test plan

- Unit: money formatting, pricing gates, tax calculation, order state machine and status transitions.
- Integration: cart reservation concurrency, releases, Paystack webhook verification/deduplication and refund handling.
- End to end: guest checkout, payment failure recovery, confirmed purchase and guest order tracking when implemented.
- Visual and accessibility: both themes, responsive breakpoints, empty/loading/error states, keyboard paths and 400% zoom.

## 10. Delivery sequence

1. Close Q1 through Q8 in `PROJECT-STATUS.md`, prioritising real prices, VAT, domestic logistics and regulatory approvals.
2. Complete the immediate conversion gaps: drawer quantity editing, image data, full cart page and scheduled reservation cleanup.
3. Connect Sanity for approved editorial content and replace placeholder photography with commissioned assets.
4. Implement Resend's queue, template set, quota controls and DNS prerequisites.
5. Build wholesale enquiry and the minimum staff workflow before exposing B2B conversion claims.
6. Add reconciliation, refund handling, testing, monitoring and launch operations.
7. Add accounts, search, promotions, tracking, analytics and any global-market features only after their policy, data and operational dependencies are signed off.

## 11. Decisions required before expansion

1. Real pack sizes, prices, MOQ and wholesale pricing rules.
2. NAFDAC status, lab results and permissible food/product claims.
3. Domestic logistics partner, serviceable areas, rates, lead times, return handling and free-delivery policy.
4. Tax advice for each product tax class.
5. Exact B2B operating model, export registration and permitted markets.
6. Paystack USD/domiciliary-account status before enabling USD.
7. Authentication and staff-access approach, including mandatory 2FA for administration.
8. Sanity project ownership, editorial workflow and approved photography.
9. Any new product class that would require variable weight, lots, delivery slots, substitutions, subscriptions or a different fulfilment model.
