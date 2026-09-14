# Bakana Farms — Standalone Sanity Studio

Standalone Sanity Studio v3 for **Bakana Farms Limited**, managing editorial content for the e-commerce platform.

* **Project ID:** `wshk0e58`
* **Dataset:** `production`
* **Studio Host:** `bakana-farms.sanity.studio`

---

## The Data Boundary — Non-Negotiable (`AGENTS.md`)

**Postgres is the system of record. Sanity holds editorial content only.**

| Content in Sanity | Data in Postgres |
|---|---|
| Journal articles & guides | Orders, order lines, payments, refunds |
| Product names, marketing copy, tasting notes | Product **price**, **stock on hand**, **stock reserved**, SKU |
| Editorial photography & gallery assets | Inventory movements ledger (append-only) |
| Founder stories & provenance milestones | Customers, addresses, consent records |
| FAQs & Site announcements | Admin audit log & webhook events |

**Hard Prohibitions:**
* Never write or store customer, payment, order, price or stock data in Sanity.
* Never add an e-commerce price or inventory level schema field to this Studio.

---

## Getting Started

### 1. Install Dependencies
```bash
cd studio
npm install
```

### 2. Run Local Studio
```bash
npm run dev
```
The Studio will be accessible at `http://localhost:3333`.

### 3. Deploy Studio to Sanity Cloud
To make the Studio accessible directly at `https://bakana-farms.sanity.studio`:
```bash
npm run deploy
```
*(Requires `npx sanity login` with your Roman Frost / Bakana Farms Sanity account).*

---

## Schemas

* `article`: Journal articles with PortableText, responsive images, and SEO fields.
* `productEditorial`: Rich marketing copy, tasting notes, preparation rituals, and galleries.
* `siteSettings`: Global announcement banners, support notices, and sourcing statements.
* `faq`: Frequently asked questions organized by category.
* `founderStory`: Historical milestones, farm photos, and provenance stories.
