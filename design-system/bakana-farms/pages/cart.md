# Page Specification — Cart (`/cart` & `CartDrawer`)

> Overrides and additions to `design-system/bakana-farms/MASTER.md`.

## 1. Dual-Surface Cart Strategy
1. **Slide-Over Drawer:**
   - Desktop: Slides in from the right edge with backdrop scrim.
   - Mobile: Slides up as a bottom sheet.
   - Focus trapped while open; Escape key dismisses; focus returns to trigger.
2. **Dedicated Cart Page (`/cart`):**
   - Full review layout with line item breakdown, packaging thumbnail, unit price, quantity steppers, and order summary card.

## 2. Line Item Thumbnails & Micro-Interactions
- Every cart line renders verified 8k packaging photography (`/images/bakana-hero-product-8k.webp`) with `object-contain`.
- Inline steppers allow increment/decrement with real-time subtotal updates.
- 44px trash button (`size-11`) with clear focus visible ring.
- Stock conflicts display explicit server error messages with dismiss button.
