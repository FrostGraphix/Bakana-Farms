import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Money is stored and passed around in minor units as integers.
 * Floats are never used for currency: 0.1 + 0.2 !== 0.3, and an
 * order total that is off by a kobo is a reconciliation failure.
 */
export type Currency = "NGN" | "USD";

/**
 * Display rules differ per currency and must not be shared.
 *
 * Naira prices are quoted whole: kobo is not in practical
 * circulation and showing it reads as an error. Dollar prices keep
 * both decimals, because dropping them would round the displayed
 * price away from the amount the gateway actually charges.
 *
 * `minorUnits` is always the true stored value. Only the display
 * is rounded, never the arithmetic.
 */
const CURRENCY_DISPLAY: Record<
  Currency,
  { locale: string; fractionDigits: 0 | 2 }
> = {
  NGN: { locale: "en-NG", fractionDigits: 0 },
  USD: { locale: "en-US", fractionDigits: 2 },
};

export function formatMoney(minorUnits: number, currency: Currency): string {
  const { locale, fractionDigits } = CURRENCY_DISPLAY[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(minorUnits / 100);
}

/** Percentage off, rounded to a whole number for badge display. */
export function discountPercent(compareAt: number, price: number): number {
  if (compareAt <= 0 || price >= compareAt) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
