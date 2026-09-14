# Page Specification — Authentication (`/sign-in`, `/sign-up`, `/account`)

> Overrides and additions to `design-system/bakana-farms/MASTER.md`.

## 1. Editorial Split Architecture
- **Desktop (`lg` and above):** 2-column balanced split (`lg:grid-cols-[1.1fr_1fr]`).
  - **Left Surface (Brand Showcase & Member Privileges):**
    - High-resolution packaging artwork (`/images/bakana-hero-product-8k.webp`) in an elevated glass frame.
    - Verified provenance statements: estate harvesting in Rivers State, certified organic batch records, direct export logistics.
    - Three core member benefit cards: Batch Verification, Wholesale Export Portals, and Express Dispatch.
  - **Right Surface (Precision Glass Auth Card):**
    - `glass-card rounded-[var(--radius-lg)] border border-[var(--border-subtle)] shadow-[var(--elevation-raised)]`.
    - Gold accent line top border (`border-t-2 border-t-[var(--accent-line)]`).
    - Pill segmented control for instant switching between "Sign In" and "Create Account".
- **Mobile (`< 1024px`):** Single-column stacked layout where the brand showcase renders as an elegant header banner, and the form takes full comfortable width (`p-6 sm:p-8`).

## 2. Interactive Ergonomics & Form Containment
- **Zero Horizontal Blowout:** Strict containment on every container (`w-full min-w-0 max-w-full overflow-hidden`).
- **Accessible Linking:** Every `<Field id="...">` propagates its explicit ID down through `FieldContext` to `<FieldLabel>`, `<Input>`, and `<FieldError>`.
- **Password UX:**
  - Password visibility toggle (`Eye` / `EyeSlash`) with 44px touch target and clear ARIA label.
  - Real-time password criteria checklist:
    - Minimum 8 characters.
    - Contains both letters and numbers.
    - Passwords match (in registration & password setup modes).
- **First-Time Login Transition:**
  - Seamlessly detects accounts created via guest checkout without passwords.
  - Presents an informative banner guiding the customer to set their own secure password.

## 3. Compliance & Security
- **Nigeria Data Protection Act (NDPA) 2023:** Clear consent and privacy notice (NDPR is repealed and never cited).
- **PCI DSS SAQ A Eligibility:** No third-party tracking or analytics scripts on auth surfaces.
- **Session Security:** Signed HTTP-only session cookies with scrypt cryptographic hashing.
