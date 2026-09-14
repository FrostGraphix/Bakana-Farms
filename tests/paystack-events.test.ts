import { describe, expect, it } from "vitest";
import { eventId, type PaystackEvent } from "../src/server/payments/paystack";

describe("Paystack event identity", () => {
  it("uses transaction identifiers", () => {
    const event = {
      event: "charge.success",
      data: {
        id: 42,
        reference: "BF-1",
        status: "success",
        amount: 1000,
        currency: "NGN",
      },
    } satisfies PaystackEvent;
    expect(eventId(event)).toBe("charge.success:42");
  });

  it("hashes identifier-free refunds", () => {
    const raw = '{"event":"refund.pending","data":{"status":"pending"}}';
    const event = {
      event: "refund.pending",
      data: {
        status: "pending",
        amount: "1000",
        currency: "NGN",
        transaction_reference: "BF-1",
      },
    } satisfies PaystackEvent;
    expect(eventId(event, raw)).toBe(eventId(event, raw));
    expect(eventId(event, raw)).toMatch(/^refund\.pending:[a-f0-9]{64}$/);
  });
});
