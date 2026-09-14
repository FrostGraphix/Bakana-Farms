import type { Currency } from "@/lib/utils";

/**
 * Order pricing: tax and shipping.
 *
 * Everything that turns a subtotal into a total lives here, so
 * when the two open client questions are answered the change is
 * one file and not a hunt through the codebase.
 *
 * BLOCKED, Q3 — VAT classification.
 *   Nigerian VAT is governed by the Nigeria Tax Act 2025 (in force
 *   1 Jan 2026). The standard rate is 7.5%, but food and basic
 *   consumables are ZERO-RATED. Whether a moringa, honey and
 *   ginger blend is a zero-rated food or a standard-rated
 *   supplement materially changes what the customer is charged,
 *   and it is a determination for the client's tax adviser. It is
 *   not a guess an engineer gets to make.
 *
 * BLOCKED, Q5 — shipping rates.
 *   Domestic zones and export rates come from the client's
 *   logistics partner. The rate card does not exist yet.
 *
 * Until both are configured, `assertPricingConfigured()` refuses
 * to run in a deployed environment. A checkout that silently
 * charges the wrong tax is a worse outcome than a checkout that
 * is not live yet.
 */

/** Basis points, so 750 === 7.5%. Integer maths only. */
export type BasisPoints = number;

export const VAT_STANDARD_BPS: BasisPoints = 750;
export const VAT_ZERO_BPS: BasisPoints = 0;

export type TaxClass = "standard" | "zero_rated" | "exempt";

export type PricingInput = {
  subtotal: number;
  currency: Currency;
  taxClass: TaxClass;
  countryCode: string;
  totalWeightGrams: number;
  discountAmount?: number;
};

export type PricingResult = {
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  taxRateBps: BasisPoints;
  total: number;
  /**
   * True when either determination is still a placeholder. The UI
   * must surface this rather than presenting a total as final.
   */
  provisional: boolean;
  notes: string[];
};

export class PricingNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PricingNotConfiguredError";
  }
}

function isDeployed(): boolean {
  return Boolean(process.env.VERCEL_ENV ?? process.env.DEPLOY_ENV);
}

/** True once the client has answered Q3. */
export function isTaxConfigured(): boolean {
  return process.env.TAX_DETERMINATION_CONFIRMED === "true";
}

/** True once the client has answered Q5. */
export function isShippingConfigured(): boolean {
  return process.env.SHIPPING_RATES_CONFIRMED === "true";
}

/**
 * Call at the top of any path that can take money.
 *
 * The gate keys on a DEPLOYMENT signal, not NODE_ENV, because
 * `next build` sets NODE_ENV=production for a local build too.
 */
export function assertPricingConfigured(): void {
  if (!isDeployed()) return;

  const missing: string[] = [];
  if (!isTaxConfigured()) missing.push("tax determination (Q3)");
  if (!isShippingConfigured()) missing.push("shipping rates (Q5)");

  if (missing.length > 0) {
    throw new PricingNotConfiguredError(
      `Checkout is disabled in a deployed environment until these are confirmed: ${missing.join(", ")}. ` +
        `Refusing to charge a customer a provisional total.`
    );
  }
}

/**
 * VAT for a line's tax class.
 *
 * Deliberately takes the class per product rather than applying a
 * single global rate, because the catalogue will eventually hold
 * both zero-rated and standard-rated goods.
 */
export function taxRateFor(taxClass: TaxClass): BasisPoints {
  switch (taxClass) {
    case "zero_rated":
    case "exempt":
      return VAT_ZERO_BPS;
    case "standard":
      return VAT_STANDARD_BPS;
  }
}

/**
 * Shipping.
 *
 * PLACEHOLDER. Returns a flat domestic figure and refuses
 * international entirely, because shipping a NAFDAC-regulated
 * product abroad needs the export chain (NEPC registration, NXP
 * form, phytosanitary certificate) that Q2 has not confirmed.
 * International orders go through the wholesale quote flow.
 */
export function calculateShipping(params: {
  countryCode: string;
  totalWeightGrams: number;
  subtotal: number;
  currency: Currency;
}): { amount: number; note: string } {
  if (params.countryCode !== "NG") {
    throw new PricingNotConfiguredError(
      "International shipping is not available through checkout. Use the wholesale enquiry flow."
    );
  }

  // Free over threshold, flat below. Both are placeholders.
  const FREE_THRESHOLD = 2_500_000; // kobo
  const FLAT_RATE = 250_000; // kobo

  if (params.subtotal >= FREE_THRESHOLD) {
    return { amount: 0, note: "Free delivery threshold met (provisional)" };
  }

  return {
    amount: FLAT_RATE,
    note: "Flat domestic rate (provisional, pending logistics rate card)",
  };
}

/**
 * Compute an order total.
 *
 * Order of operations matters and is fixed: discount comes off the
 * subtotal first, tax is computed on the discounted subtotal, and
 * shipping is added last and is not itself taxed here. Changing
 * this order changes what customers are charged, so it must not
 * drift without a deliberate decision.
 */
export function calculateOrderPricing(input: PricingInput): PricingResult {
  const notes: string[] = [];
  const discountAmount = Math.min(input.discountAmount ?? 0, input.subtotal);
  const taxableBase = input.subtotal - discountAmount;

  const taxRateBps = taxRateFor(input.taxClass);
  const taxAmount = Math.round((taxableBase * taxRateBps) / 10_000);

  const shipping = calculateShipping({
    countryCode: input.countryCode,
    totalWeightGrams: input.totalWeightGrams,
    subtotal: taxableBase,
    currency: input.currency,
  });
  notes.push(shipping.note);

  if (!isTaxConfigured()) {
    notes.push(
      "VAT treatment is provisional pending the client's tax determination."
    );
  }

  return {
    subtotal: input.subtotal,
    discountAmount,
    shippingAmount: shipping.amount,
    taxAmount,
    taxRateBps,
    total: taxableBase + taxAmount + shipping.amount,
    provisional: !isTaxConfigured() || !isShippingConfigured(),
    notes,
  };
}
