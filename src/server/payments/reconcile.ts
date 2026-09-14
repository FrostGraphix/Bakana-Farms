import { and, asc, eq, lt } from "drizzle-orm";
import { getDb, schema } from "@/server/db";
import { verifyTransaction } from "./paystack";
import {
  recordFailedPayment,
  recordSuccessfulPayment,
} from "./process-payment";

const RECONCILIATION_GRACE_MINUTES = 5;

export async function reconcilePendingPayments(maximum = 50) {
  const db = getDb();
  const cutoff = new Date(
    Date.now() - RECONCILIATION_GRACE_MINUTES * 60_000
  );

  const orders = await db.query.orders.findMany({
    where: and(
      eq(schema.orders.status, "pending_payment"),
      lt(schema.orders.createdAt, cutoff)
    ),
    columns: { reference: true },
    orderBy: [asc(schema.orders.createdAt)],
    limit: maximum,
  });

  const result = {
    checked: 0,
    paid: 0,
    failed: 0,
    pending: 0,
    errors: 0,
  };

  for (const order of orders) {
    result.checked += 1;

    try {
      const payment = await verifyTransaction(order.reference);

      if (payment.status === "success") {
        const settled = await recordSuccessfulPayment({
          reference: order.reference,
          amount: payment.amount,
          currency: payment.currency,
          paidAt: payment.paidAt,
          channel: payment.channel,
          last4: payment.last4,
          brand: payment.brand,
          eventType: "paystack.reconciliation.success",
        });
        if (settled.applied) result.paid += 1;
        continue;
      }

      if (payment.status === "failed" || payment.status === "abandoned") {
        const failed = await recordFailedPayment({
          reference: order.reference,
          eventType: "paystack.reconciliation.failed",
        });
        if (failed.applied) result.failed += 1;
        continue;
      }

      result.pending += 1;
    } catch (error) {
      result.errors += 1;
      console.error("paystack.reconciliation.failed", {
        reference: order.reference,
        message: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return result;
}
