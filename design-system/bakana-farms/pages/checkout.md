# Page Specification — Checkout (`/checkout`)

> Overrides and additions to `design-system/bakana-farms/MASTER.md`.

## 1. Distraction-Free Flow
- Minimal header and footer (no unnecessary marketing navigation or banners).
- Single-column linear sequence on mobile devices to prevent form abandonment.

## 2. Security & PCI DSS SAQ A Isolation
- **Strictly zero third-party scripts:** No analytics, no Meta pixels, no chat widgets.
- The AI `ShoppingGuide` component explicitly unmounts on all `/checkout/*` paths.
- Card fields are strictly hosted by Paystack; no raw card numbers ever touch the application.

## 3. Ergonomics & Accessibility
- All fields declare explicit `inputMode` and `autoComplete` attributes.
- Labels are positioned strictly above inputs.
- Error alerts appear below fields with `role="alert"` and `aria-describedby`.
- 16px minimum font size floor prevents iOS Safari viewport zooming on focus.
