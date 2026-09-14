import type { OrderStatus } from "@/server/db/schema";

/**
 * Order state machine.
 *
 * Transitions are declared once, here, and enforced in code. The
 * point is that an order cannot reach `shipped` without having
 * passed `paid`: a fulfilment bug must fail loudly rather than
 * quietly shipping goods nobody paid for.
 *
 * Every accepted transition writes a row to `order_events` and may
 * fire exactly one email.
 */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending_payment: ["paid", "payment_failed", "cancelled"],
  paid: ["processing", "refunded", "partially_refunded", "cancelled"],
  processing: ["packed", "cancelled", "refunded", "partially_refunded"],
  packed: ["shipped", "cancelled", "refunded", "partially_refunded"],
  shipped: ["delivered", "refunded", "partially_refunded"],
  delivered: ["refunded", "partially_refunded"],

  // Terminal. A failed payment starts a new attempt as a new
  // order rather than resurrecting this one, so the audit trail
  // of what was actually attempted stays intact.
  payment_failed: [],
  cancelled: [],
  refunded: [],
  partially_refunded: ["refunded"],
};

/** Which transitions send mail, and at which shedding tier. */
export const TRANSITION_EMAIL: Partial<
  Record<OrderStatus, { template: string; tier: 1 | 2 | 3 }>
> = {
  paid: { template: "order-confirmed", tier: 1 },
  shipped: { template: "order-shipped", tier: 1 },
  delivered: { template: "order-delivered", tier: 1 },
  processing: { template: "order-processing", tier: 2 },
  payment_failed: { template: "payment-failed", tier: 3 },
  cancelled: { template: "order-cancelled", tier: 3 },
  refunded: { template: "order-refunded", tier: 3 },
  partially_refunded: { template: "order-refunded", tier: 3 },
};

export class InvalidTransitionError extends Error {
  constructor(
    readonly from: OrderStatus,
    readonly to: OrderStatus
  ) {
    super(`Illegal order transition: ${from} -> ${to}`);
    this.name = "InvalidTransitionError";
  }
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) throw new InvalidTransitionError(from, to);
}

/**
 * A transition to the state an order is already in is a no-op, not
 * an error. Webhooks are re-delivered, and a redelivered
 * `charge.success` must not be treated as a fault.
 */
export function isNoop(from: OrderStatus, to: OrderStatus): boolean {
  return from === to;
}
