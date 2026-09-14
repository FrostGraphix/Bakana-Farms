# Responsive Design

## Ranges

| Range | Layout |
|---|---|
| 320-639px | Single column. Mobile sheet. Full-width actions. |
| 640-767px | Wider controls. Paired compact actions. |
| 768-1023px | Two-column checkout. Desktop cart drawer. |
| 1024-1279px | Desktop navigation. Editorial split layouts. |
| 1280-1535px | Standard 1280px content container. |
| 1536-1919px | 1440px content container. |
| 1920px and above | 1600px content container. |

## Rules

- No page-level horizontal scrolling.
- Body text stays 16px.
- Inputs stay 16px minimum.
- Mobile targets prefer 44px.
- Sticky bars clear safe areas.
- Wide data scrolls locally.
- Mobile navigation traps focus.
- Motion uses opacity and transform.
- Reduced motion keeps routes usable.
- Checkout avoids scroll motion.

## Required checks

Test 320px, 375px, 768px, 1024px, 1440px and 1920px.

Test light and dark themes.

Test 400% browser zoom.

Test keyboard-only navigation.

Test sticky purchase controls.

Test cart and checkout.

## Page behaviour

| Surface | Compact | Wide |
|---|---|---|
| Header | Cart, theme and menu. | Primary navigation and cart. |
| Home | Stacked hero and ledger. | Editorial split hero and ledger. |
| Product | Single purchase column. | Gallery beside buy box. |
| Cart | Full-screen bottom sheet. | Right-side drawer. |
| Checkout | Summary before form. | Sticky summary beside form. |

## Verification status

Local catalogue fixtures support viewport checks.
Production requires a configured database.

## Responsive implementation contract

Every current and future page follows these rules.

- Begin at 320 pixels.
- Scale through 375 pixels.
- Reflow at 640 pixels.
- Recompose at 768 pixels.
- Expand at 1024 pixels.
- Widen at 1280 pixels.
- Cap readable line lengths.
- Preserve browser zoom support.
- Keep inputs sixteen pixels.
- Keep targets forty-four pixels.
- Reserve all media dimensions.
- Avoid page-level horizontal scrolling.
- Wrap wide tables explicitly.
- Respect every safe area.
- Support portrait and landscape.
- Support four-hundred-percent zoom.
- Disable motion when requested.
