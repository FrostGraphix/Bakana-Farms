import { describe, expect, it } from "vitest";
import {
  calculateOrderPricing,
  PricingNotConfiguredError,
} from "../src/server/checkout/pricing";

describe("checkout pricing", () => {
  it("uses integer arithmetic", () => {
    const result = calculateOrderPricing({
      subtotal: 1_000_000,
      currency: "NGN",
      taxClass: "standard",
      countryCode: "NG",
      totalWeightGrams: 150,
    });

    expect(result.taxAmount).toBe(75_000);
    expect(result.total).toBe(1_325_000);
    expect(Number.isInteger(result.total)).toBe(true);
  });

  it("rejects consumer exports", () => {
    expect(() =>
      calculateOrderPricing({
        subtotal: 1_000_000,
        currency: "NGN",
        taxClass: "standard",
        countryCode: "US",
        totalWeightGrams: 150,
      })
    ).toThrow(PricingNotConfiguredError);
  });
});
