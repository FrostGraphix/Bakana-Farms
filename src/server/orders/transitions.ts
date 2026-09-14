import { and, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/server/db";
import type { OrderStatus } from "@/server/db/schema";
import {
  assertTransition,
  isNoop,
  TRANSITION_EMAIL,
} from "./state-machine";

type Tx = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];

/**
 * Move an order to a new status.
 *
 * Everything happens in one transaction: the guarded status
 * update, the audit row, and any side effect that must not
 * survive a rollback.
 *
 * The status guard is in the WHERE clause, so two concurrent
 * webhook deliveries cannot both apply the same transition. The
 * second one updates zero rows and is reported as a no-op rather
 * than duplicating the side effects.
 */
export async function transitionOrder(params: {
  orderId: string;
  to: OrderStatus;
  type: string;
  payload?: Record<string, unknown>;
  actorId?: string | null;
  tx?: Tx;
}): Promise<{ applied: boolean; from: OrderStatus }> {
  const run = async (tx: Tx) => {
    const order = await tx.query.orders.findFirst({
      where: eq(schema.orders.id, params.orderId),
      columns: { id: true, status: true },
    });

    if (!order) throw new Error(`Order not found: ${params.orderId}`);

    const from = order.status;

    // A redelivered webhook asking for the state we are already in
    // is expected, not a fault.
    if (isNoop(from, params.to)) return { applied: false, from };

    assertTransition(from, params.to);

    const updated = await tx
      .update(schema.orders)
      .set({ status: params.to, updatedAt: new Date() })
      .where(
        and(
          eq(schema.orders.id, params.orderId),
          // Optimistic guard: only move if still in the state we read.
          eq(schema.orders.status, from)
        )
      )
      .returning({ id: schema.orders.id });

    if (updated.length === 0) return { applied: false, from };

    await tx.insert(schema.orderEvents).values({
      orderId: params.orderId,
      fromStatus: from,
      toStatus: params.to,
      type: params.type,
      payload: params.payload ?? null,
      actorId: params.actorId ?? null,
    });

    return { applied: true, from };
  };

  if (params.tx) return run(params.tx);
  return getDb().transaction(run);
}

/**
 * Convert reservations into a completed sale.
 *
 * On payment, held stock stops being a reservation and becomes a
 * permanent decrement. Both counters move together so availability
 * (`on_hand - reserved`) is unchanged by the conversion itself.
 *
 * Idempotency is the caller's responsibility: this runs inside the
 * same transaction as the `paid` transition, which only applies
 * once.
 */
export async function convertReservationsToSale(
  tx: Tx,
  orderId: string
): Promise<void> {
  const items = await tx.query.orderItems.findMany({
    where: eq(schema.orderItems.orderId, orderId),
    columns: { variantId: true, quantity: true },
  });

  for (const item of items) {
    if (!item.variantId) continue;

    await tx
      .update(schema.variants)
      .set({
        stockOnHand: sql`GREATEST(0, ${schema.variants.stockOnHand} - ${item.quantity})`,
        stockReserved: sql`GREATEST(0, ${schema.variants.stockReserved} - ${item.quantity})`,
      })
      .where(eq(schema.variants.id, item.variantId));

    await tx.insert(schema.stockMovements).values({
      variantId: item.variantId,
      delta: -item.quantity,
      reason: "sale",
      orderId,
    });
  }
}

/** Release held stock when an order dies before payment. */
export async function releaseOrderReservations(
  tx: Tx,
  orderId: string
): Promise<void> {
  const items = await tx.query.orderItems.findMany({
    where: eq(schema.orderItems.orderId, orderId),
    columns: { variantId: true, quantity: true },
  });

  for (const item of items) {
    if (!item.variantId) continue;

    await tx
      .update(schema.variants)
      .set({
        stockReserved: sql`GREATEST(0, ${schema.variants.stockReserved} - ${item.quantity})`,
      })
      .where(eq(schema.variants.id, item.variantId));

    await tx.insert(schema.stockMovements).values({
      variantId: item.variantId,
      delta: item.quantity,
      reason: "reservation_released",
      orderId,
    });
  }
}

/**
 * Queue the email for a transition, if one is defined.
 *
 * Writes a row only. The sender drains the queue and applies the
 * daily quota and tier shedding, so a mail provider outage can
 * never roll back an order status.
 */
export async function queueTransitionEmail(
  tx: Tx,
  params: { orderId: string; to: OrderStatus; recipient: string }
): Promise<void> {
  const mail = TRANSITION_EMAIL[params.to];
  if (!mail) return;

  await tx.insert(schema.emailSends).values({
    template: mail.template,
    tier: mail.tier,
    recipient: params.recipient,
    orderId: params.orderId,
    status: "queued",
  });
}
