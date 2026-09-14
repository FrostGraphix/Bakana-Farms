# Claude Code Rules — Bakana Farms

All engineering standards for this codebase are defined in **`AGENTS.md`** at the project root. That file is the single source of truth shared across all AI agents (Claude, Codex, Cursor).

Read `AGENTS.md` fully before starting any task. Every rule there is mandatory.

Current build state and remaining scope live in **`PROJECT-STATUS.md`**. Check it before starting a feature so you do not rebuild something that exists or assume something exists that does not.

## The four rules that break the most things

> **1. Postgres is the system of record. Sanity is editorial content only.**
> Never write an order, customer, price or stock value to Sanity. Sanity's free tier caps at 10,000 documents, has no row locking, and cannot satisfy NDPA erasure.

> **2. Money is an integer in minor units.** Never a float, never `numeric`. `formatMoney()` handles per-currency display: NGN whole, USD two decimals.

> **3. The stock guard lives inside the UPDATE statement**, never in a preceding read. Read-then-write oversells the last unit under concurrency. `src/server/cart/service.ts` has the verified pattern.

> **4. No third-party scripts on `/checkout/*`.** No analytics, no pixels, no session replay, no chat. PCI DSS SAQ A eligibility depends on it. The CSP in `next.config.ts` enforces it.

## Verifying your work

Use the local binaries directly:

```bash
./node_modules/.bin/tsc.cmd --noEmit      # types, seconds
./node_modules/.bin/next.cmd build        # full build, about a minute
```

**`npx tsc` does not work here.** It resolves to a different `tsc` and fails with "This is not the tsc command you are looking for". Always call the local binary.

Typecheck constantly. Build before declaring a task done. Both must pass.

## Git and PR workflow

Never push directly to `main`. Always create a branch, commit according to the standard (`type: description`), push the branch, open a PR via GitHub (`gh pr create`), and merge into `main` (`gh pr merge`).

## Running the app

```bash
docker compose up -d      # Postgres on port 5433
npm run db:migrate
npm run db:seed
npm run dev
```

If the database is not running, the catalogue falls back to fixtures in development and the cart returns `503`. That is intended, not a bug.

## Things that look broken but are deliberate

- **Docker image is `public.ecr.aws/docker/library/postgres:17-alpine`**, not Docker Hub. Hub pulls stall indefinitely on this network.
- **Fonts are self-hosted** via `next/font/local`. Do not switch to `next/font/google` — it fetches at build time and fails behind this proxy.
- **`generateStaticParams` swallows a database error** and returns `[]`. Build-time only, so a transient outage degrades to on-demand rendering instead of failing a deploy. The runtime query stays strict.
- **The fixture guard keys on `VERCEL_ENV`, not `NODE_ENV`.** `next build` sets `NODE_ENV=production` locally too.
- **No certifications section, no nutritional panel, no NAFDAC number anywhere.** Those fields were blank in Discovery. They are not TODOs to fill with plausible values — this is a regulated food product.

## Do not invent client data

Prices, NAFDAC numbers, certifications, nutritional figures, addresses, phone numbers, registration numbers, export markets. If Discovery did not supply it, it does not go in the code, not even as a placeholder that could ship. Leave the section out and comment why.
