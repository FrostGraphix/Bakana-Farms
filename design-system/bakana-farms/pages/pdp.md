# Page Specification — Product Detail Page (`/products/[slug]`)

> Overrides and additions to `design-system/bakana-farms/MASTER.md`.

## 1. Ergonomics & Conversion Hierarchy
1. **Product Gallery:**
   - Mobile: Horizontal scroll-snap rail with pagination indicators.
   - Desktop: Main stage + thumbnail rail with keyboard accessibility.
   - Video and photography support with high-resolution artwork.
2. **BuyBox (Conversion Core):**
   - Direct radio buttons for sizes (not hidden in `<select>`).
   - Truthful stock ledger (`stockOnHand - stockReserved`). Low stock warning only when verified by database.
   - 44px comfort stepper buttons (`size-11`).
   - Dynamic currency formatting: NGN whole integers, USD 2 decimals via `formatMoney()`.
   - Add to Cart action provides immediate feedback via Cart Drawer or luxury Toast notification.
3. **Structured Data:**
   - Valid `Product` and `Offer` schema JSON-LD rendered for search engine rich snippets.
