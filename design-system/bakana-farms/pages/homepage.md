# Page Specification — Homepage (`/`)

> Overrides and additions to `design-system/bakana-farms/MASTER.md`.

## 1. Structure & Visual Sequence
1. **Cinematic Hero:**
   - Background video autoplay with poster image fallback (`/images/bakana-moringa-honey-ginger-hero-8k.webp`).
   - Dark gradient overlay ensuring text contrast passes AAA on `--scene-text`.
   - Brand title stagger animation with `overflow-hidden` line reveals.
   - Primary CTA: "Shop Bakana" pointing to `/products`.
2. **Product Study (Cinematic Gallery):**
   - Horizontal snap scroll on mobile (`snap-x snap-mandatory`).
   - High-resolution framing with subtle hover scale (`scale-[1.045]`, `transform` only).
   - Figcaption with subtle typography and index numbering.
3. **The Daily Ritual:**
   - 3-step ritual sequence (Boil, Steep, Sip).
   - High contrast cards (`--ritual-card`) with smooth border illumination on hover.
4. **Provenance & Trade Pathway:**
   - Provenance marquee (single infinite loop, converts to static strip under `prefers-reduced-motion`).
   - Dual-path card split: Direct Consumer vs. Wholesale Partner inquiry.

## 2. Accessibility & Performance
- Hero video must include `playsInline`, `muted`, and respect `useReducedMotion()`.
- Maximum 1 Marquee instance on the entire page.
