import { describe, expect, it } from "vitest";
import { discountPercent, formatMoney } from "../src/lib/utils";

describe("money formatting", () => {
  it("formats naira from kobo", () => {
    expect(formatMoney(1200000, "NGN")).toContain("12,000");
  });

  it("preserves dollar cents", () => {
    expect(formatMoney(2499, "USD")).toBe("$24.99");
  });

  it("calculates safe discounts", () => {
    expect(discountPercent(2400000, 2200000)).toBe(8);
    expect(discountPercent(100, 100)).toBe(0);
  });
});
