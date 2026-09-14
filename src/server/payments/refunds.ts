import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { getDb, schema } from "@/server/db";
import { queueTransitionEmail, transitionOrder } from "@/server/orders/transitions";
import { refundTransaction } from "@/server/payments/paystack";

const ACTIVE_REFUND_STATUSES = [
  "requested",
  "pending",
  "processing",
  "needs-attention",
] as const;

export async function requestRefund(params: {
  orderId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
  actorReference: string;
}) {
  const db = getDb();
  const existing = await db.query.refunds.findFirst({
    where: eq(schema.refunds.idempotencyKey, params.idempotencyKey),
  });
  if (existing) return existing;

  const requested = await db.transaction(async (tx) => {
    const order = await tx.query.orders.findFirst({
      where: eq(schema.orders.id, params.orderId),
      with: { payments: true },
    });
    if (!order) throw new Error("Order not found.");

    const payment = order.payments.find((entry) => entry.status === "succeeded");
    if (!payment) throw new Error("No successful payment exists.");

    const [totals] = await tx
      .select({
        value: sql<number>`coalesce(sum(${schema.refunds.amount}) filter (where ${schema.refunds.status} <> 'failed'), 0)::int`,
      })
      .from(schema.refunds)
      .where(eq(schema.refunds.orderId, order.id));
    const alreadyRefunding = totals?.value ?? 0;
    if (params.amount > order.total - alreadyRefunding) {
      throw new Error("Refund exceeds the remaining amount.");
    }

    const [refund] = await tx
      .insert(schema.refunds)
      .values({
        orderId: order.id,
        paymentId: payment.id,
        amount: params.amount,
        reason: params.reason,
        idempotencyKey: params.idempotencyKey,
        actorReference: params.actorReference,
      })
      .returning();
    if (!refund) throw new Error("Refund request was not saved.");

    await tx.insert(schema.orderEvents).values({
      orderId: order.id,
      fromStatus: order.status,
      toStatus: order.status,
      type: "refund.requested",
      payload: {
        refundId: refund.id,
        amount: params.amount,
        actorReference: params.actorReference,
      },
    });

    return { refund, paymentReference: payment.providerReference };
  });

  try {
    const provider = await refundTransaction({
      reference: requested.paymentReference,
      amount: params.amount,
      reason: params.reason,
    });
    const [updated] = await db
      .update(schema.refunds)
      .set({
        status: normalizeRefundStatus(provider.status),
        providerReference: String(provider.id),
      })
      .where(eq(schema.refunds.id, requested.refund.id))
      .returning();
    return updated ?? requested.refund;
  } catch (error) {
    await db
      .update(schema.refunds)
      .set({ status: "failed" })
      .where(eq(schema.refunds.id, requested.refund.id));
    throw error;
  }
}

export async function processRefundEvent(params: {
  transactionReference: string;
  refundReference: string | null;
  amount: number;
  status: string;
  eventType: string;
}) {
  const db = getDb();
  await db.transaction(async (tx) => {
    const payment = await tx.query.payments.findFirst({
      where: eq(schema.payments.providerReference, params.transactionReference),
    });
    if (!payment) throw new Error("Refund payment not found.");

    const [refund] = await tx
      .select()
      .from(schema.refunds)
      .where(
        and(
          eq(schema.refunds.orderId, payment.orderId),
          eq(schema.refunds.amount, params.amount),
          inArray(schema.refunds.status, [...ACTIVE_REFUND_STATUSES])
        )
      )
      .orderBy(asc(schema.refunds.createdAt))
      .limit(1);
    if (!refund) return;

    const status = normalizeRefundStatus(params.status);
    await tx
      .update(schema.refunds)
      .set({
        status,
        providerReference: params.refundReference ?? refund.providerReference,
      })
      .where(eq(schema.refunds.id, refund.id));

    const order = await tx.query.orders.findFirst({
      where: eq(schema.orders.id, payment.orderId),
    });
    if (!order) throw new Error("Refund order not found.");

    if (status === "failed") {
      await tx.insert(schema.orderEvents).values({
        orderId: order.id,
        fromStatus: order.status,
        toStatus: order.status,
        type: params.eventType,
        payload: { refundId: refund.id, amount: refund.amount },
      });
      return;
    }

    if (status !== "processed") return;

    const [totals] = await tx
      .select({ value: sql<number>`coalesce(sum(${schema.refunds.amount}), 0)::int` })
      .from(schema.refunds)
      .where(
        and(
          eq(schema.refunds.orderId, order.id),
          eq(schema.refunds.status, "processed")
        )
      );
    const refundedAmount = totals?.value ?? refund.amount;
    const nextStatus = refundedAmount >= order.total ? "refunded" : "partially_refunded";

    await tx
      .update(schema.orders)
      .set({ refundedAmount, updatedAt: new Date() })
      .where(eq(schema.orders.id, order.id));
    await tx
      .update(schema.payments)
      .set({ status: nextStatus })
      .where(eq(schema.payments.id, payment.id));

    if (order.status === nextStatus) {
      await tx.insert(schema.orderEvents).values({
        orderId: order.id,
        fromStatus: order.status,
        toStatus: order.status,
        type: params.eventType,
        payload: { refundId: refund.id, amount: refund.amount, refundedAmount },
      });
    } else {
      await transitionOrder({
        orderId: order.id,
        to: nextStatus,
        type: params.eventType,
        payload: { refundId: refund.id, amount: refund.amount, refundedAmount },
        tx,
      });
      await queueTransitionEmail(tx, {
        orderId: order.id,
        to: nextStatus,
        recipient: order.email,
      });
    }
  });
}

function normalizeRefundStatus(status: string): string {
  return status.toLowerCase().replaceAll("_", "-");
}
