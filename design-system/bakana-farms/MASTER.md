# Bakana Farms — Master Design System (Global Source of Truth)

> **HIERARCHY & USAGE:**
> When building or refactoring a specific page, check `design-system/bakana-farms/pages/[page-name].md` first.
> If a page file exists, its rules **override** this Master file. If not, follow this Master specification strictly.

---

**Project:** Bakana Farms Limited  
**Category:** Premium B2B/B2C Luxury Wellness E-Commerce (Moringa, Honey and Ginger Blend)  
**Standard:** WCAG 2.2 AA (Floor), AAA where feasible  
**Enforcement:** `src/app/globals.css` is the runtime system of record  

---

## 1. Two-Layer Token Architecture

Tokens are **two-layer**. Primitives name fixed values and are **never** consumed by components. Semantic tokens name roles and are the only tokens components consume.

### 1.1 Primitives (`@theme`)

```css
/* Core Brand */
--color-forest:       #1b2e22; /* Primary dark container */
--color-forest-light: #26402f; /* Dark hover surface */
--color-forest-deep:  #16251b; /* Dark backdrop */
--color-gold:         #c9a24b; /* Accent line / icon / dark primary fill */
--color-gold-light:   #e4c878; /* High-contrast text on forest (8.79:1 AAA) */
--color-gold-dark:    #a6813a; /* Accent text on ivory (4.62:1 AA) */
--color-ivory:        #f6f1e7; /* Primary light page background */
--color-sand:         #e9dfc8; /* Secondary light surface */
--color-ginger:       #b85c2e; /* Warm tertiary accent */
--color-bark:         #241a12; /* Primary high-contrast light text (14.5:1) */

/* Neutrals */
--color-neutral-900:  #1c1917;
--color-neutral-700:  #4a4038; /* Secondary light text (8.96:1 AAA) */
--color-neutral-500:  #796f64; /* Banned for normal text on ivory (4.37:1 fails AA) */
--color-neutral-300:  #d8cfb8; /* Subtle border */
--color-neutral-100:  #efe8d8;
--color-neutral-0:    #ffffff;
```

### 1.2 Semantic Pairings & Contrast

| Semantic Token | Light Mode Value | Dark Mode Value | Measured Contrast Ratio |
|---|---|---|:---:|
| `--surface-page` | `var(--color-ivory)` | `var(--color-forest)` | System canvas |
| `--surface-subtle` | `var(--color-sand)` | `var(--color-forest-deep)` | Alternating rows |
| `--surface-raised` | `var(--color-neutral-0)` | `var(--color-forest-light)` | Cards & inputs |
| `--text-primary` | `var(--color-bark)` | `var(--color-ivory)` | **14.5:1** (L) / **12.77:1** (D) |
| `--text-secondary` | `var(--color-neutral-700)` | `var(--color-sand)` | **8.96:1** (L) / **10.85:1** (D) |
| `--text-accent` | `var(--color-forest)` | `var(--color-gold-light)` | **8.79:1** on Forest (AAA) |
| `--accent-line` | `var(--color-gold)` | `var(--color-gold)` | Accent lines & icons |
| `--border-subtle` | `var(--color-neutral-300)` | `rgb(246 241 231 / 0.12)` | Clean boundary |
| `--border-focus` | `var(--color-gold-dark)` | `var(--color-gold-light)` | 2px outline |

---

## 2. Typography

All fonts are **self-hosted** via `next/font/local` in `src/app/fonts/`. Never switch to Google CDN.

- **Display:** Instrument Serif (`--font-display`)
- **Body:** Manrope (`--font-body`)
- **Mono / Numbers:** JetBrains Mono (`--font-mono`)

### 2.1 Fluid Type Scale (WCAG 1.4.4 Zoom-Safe)

All steps use a `rem` intercept + `vw` slope. Bare `vw` preferred values are strictly forbidden.

```css
--text-display-xl: clamp(2.5rem, 1.671rem + 3.536vw, 4.5rem);
--text-display-lg: clamp(2rem, 1.586rem + 1.768vw, 3rem);
--text-display-md: clamp(1.75rem, 1.543rem + 0.884vw, 2.25rem);
--text-h1:         clamp(1.5rem, 1.345rem + 0.663vw, 1.875rem);
--text-h2:         clamp(1.25rem, 1.146rem + 0.442vw, 1.5rem);
--text-h3:         clamp(1.125rem, 1.073rem + 0.221vw, 1.25rem);
--text-body-lg:    clamp(1.0625rem, 1.037rem + 0.111vw, 1.125rem);
--text-body:       1rem; /* 16px minimum floor — strictly enforced on inputs */
--text-body-sm:    0.875rem;
--text-caption:    0.75rem;
--text-eyebrow:    0.6875rem;
```

---

## 3. Motion & Micro-Interactions

- **Compositor Only:** Animate `transform` and `opacity` exclusively. Never animate `width`, `height`, `top`, or `margin`.
- **Brand Timing Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` with durations 120ms (micro), 220ms (standard), 400ms (entrance).
- **Reduced Motion:** Every animation must provide a graceful fallback via `useReducedMotion()` or `@media (prefers-reduced-motion: reduce)`.
- **Motion Budget:** Maximum 1 marquee and 1 shimmer per page.

---

## 4. Interaction & Accessibility Standards

- **Comfort Target (44×44px):** All primary touch actions, steppers, and icon buttons must provide a minimum 44px hit target (`size-11` or `h-12`).
- **Form Ergonomics:**
  - Label is always placed **above** the input (placeholder is never a label).
  - Error messages are placed **below** the field with `role="alert"` and `aria-describedby`.
  - Minimum font size on all text inputs is `16px` (`1rem`) to prevent iOS viewport auto-zoom.
- **Modals & Drawers:** Focus trapped, Escape key closes, focus restored to opener, body scroll locked.

---

## 5. Global Anti-Patterns

❌ No raw hex colors in components (semantic tokens only).  
❌ No emoji characters as UI icons (Phosphor SVG icons only).  
❌ No third-party scripts on `/checkout/*` (PCI DSS SAQ A requirement).  
❌ No manufactured stock urgency or fake countdown timers.  
❌ No Google Fonts network fetch at build or runtime.  
