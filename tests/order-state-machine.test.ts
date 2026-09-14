import { describe, expect, it } from "vitest";
import {
  assertTransition,
  canTransition,
  InvalidTransitionError,
  isNoop,
} from "../src/server/orders/state-machine";

describe("order state machine", () => {
  it("accepts the fulfilment sequence", () => {
    expect(canTransition("pending_payment", "paid")).toBe(true);
    expect(canTransition("paid", "processing")).toBe(true);
    expect(canTransition("processing", "packed")).toBe(true);
    expect(canTransition("packed", "shipped")).toBe(true);
    expect(canTransition("shipped", "delivered")).toBe(true);
  });

  it("rejects unpaid shipping", () => {
    expect(() => assertTransition("pending_payment", "shipped")).toThrow(
      InvalidTransitionError
    );
  });

  it("recognises webhook no-ops", () => {
    expect(isNoop("paid", "paid")).toBe(true);
  });

  it("supports refund branches", () => {
    expect(canTransition("paid", "partially_refunded")).toBe(true);
    expect(canTransition("partially_refunded", "refunded")).toBe(true);
    expect(canTransition("refunded", "paid")).toBe(false);
  });
});
