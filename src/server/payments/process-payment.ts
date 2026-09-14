import { eq } from "drizzle-orm";
import { getDb, schema } from "@/server/db";
import {
  transitionOrder,
  convertReservationsToSale,
  releaseOrderReservations,
  queueTransitionEmail,
} from "@/server/orders/transitions";

type SuccessfulPayment = {
  reference: string;
  amount: number;
  currency: string;
  paidAt?: string | null;
  channel?: string | null;
  last4?: string | null;
  brand?: string | null;
  eventType: string;
};

export async function recordSuccessfulPayment(input: SuccessfulPayment) {
  const db = getDb();

  return db.transaction(async (tx) => {
    const order = await tx.query.orders.findFirst({
      where: eq(schema.orders.reference, input.reference),
      columns: {
        id: true,
        status: true,
        email: true,
        total: true,
        currency: true,
      },
    });

    if (!order) {
      throw new Error(`No order for reference ${input.reference}`);
    }

    if (input.amount !== order.total) {
      throw new Error(
        `Amount mismatch for ${input.reference}: charged ${input.amount}, order total ${order.total}`
      );
    }

    if (input.currency !== order.currency) {
      throw new Error(
        `Currency mismatch for ${input.reference}: charged ${input.currency}, order ${order.currency}`
      );
    }

    await tx
      .insert(schema.payments)
      .values({
        orderId: order.id,
        provider: "paystack",
        providerReference: input.reference,
        status: "succeeded",
        amount: input.amount,
        currency: order.currency,
        cardLast4: input.last4 ?? null,
        cardBrand: input.brand ?? null,
        channel: input.channel ?? null,
        paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
      })
      .onConflictDoNothing({
        target: [
          schema.payments.provider,
          schema.payments.providerReference,
        ],
      });

    const { applied } = await transitionOrder({
      orderId: order.id,
      to: "paid",
      type: input.eventType,
      payload: { reference: input.reference, amount: input.amount },
      tx,
    });

    if (applied) {
      await convertReservationsToSale(tx, order.id);
      await tx
        .update(schema.orders)
        .set({ placedAt: new Date() })
        .where(eq(schema.orders.id, order.id));
      await queueTransitionEmail(tx, {
        orderId: order.id,
        to: "paid",
        recipient: order.email,
      });
    }

    return { applied, orderId: order.id };
  });
}

export async function recordFailedPayment(input: {
  reference: string;
  eventType: string;
}) {
  const db = getDb();

  return db.transaction(async (tx) => {
    const order = await tx.query.orders.findFirst({
      where: eq(schema.orders.reference, input.reference),
      columns: { id: true, status: true, email: true },
    });

    if (!order) {
      throw new Error(`No order for reference ${input.reference}`);
    }

    const { applied } = await transitionOrder({
      orderId: order.id,
      to: "payment_failed",
      type: input.eventType,
      payload: { reference: input.reference },
      tx,
    });

    if (applied) {
      await releaseOrderReservations(tx, order.id);
      await queueTransitionEmail(tx, {
        orderId: order.id,
        to: "payment_failed",
        recipient: order.email,
      });
    }

    return { applied, orderId: order.id };
  });
}
