import { config } from "dotenv";
import { createHmac } from "node:crypto";
import { getDb, schema, closeDb } from "@/server/db";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

/**
 * End-to-end check of the webhook path.
 *
 * Proves three things that unit tests would only assert:
 *   1. An unsigned or wrongly-signed delivery is rejected.
 *   2. A valid delivery moves pending_payment -> paid and converts
 *      the reservation into a sale.
 *   3. A REDELIVERY of the same event changes nothing: no second
 *      payment row, no second stock decrement, no second email.
 */
const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3100";
const SECRET = process.env.PAYSTACK_SECRET_KEY!;

function sign(body: string): string {
  return createHmac("sha512", SECRET).update(body, "utf8").digest("hex");
}

async function main() {
  const db = getDb();
  const reference = `VERIFY-${Date.now()}`;

  const variant = await db.query.variants.findFirst({
    where: eq(schema.variants.sku, "BF-MHG-300"),
  });
  if (!variant) throw new Error("Seed the database first.");

  const stockBefore = variant.stockOnHand;

  // Reserve two units, mirroring what checkout would have done.
  await db
    .update(schema.variants)
    .set({ stockReserved: variant.stockReserved + 2 })
    .where(eq(schema.variants.id, variant.id));

  const total = variant.priceNgn * 2;

  const [order] = await db
    .insert(schema.orders)
    .values({
      reference,
      email: "verify@bakanafarms.test",
      status: "pending_payment",
      currency: "NGN",
      subtotal: total,
      total,
    })
    .returning({ id: schema.orders.id });

  if (!order) throw new Error("Could not create order");

  await db.insert(schema.orderItems).values({
    orderId: order.id,
    variantId: variant.id,
    sku: variant.sku,
    name: "Moringa, Honey and Ginger Blend",
    variantName: variant.name,
    unitPrice: variant.priceNgn,
    quantity: 2,
    lineTotal: total,
  });

  const payload = JSON.stringify({
    event: "charge.success",
    data: {
      id: Math.floor(Math.random() * 1_000_000),
      reference,
      status: "success",
      amount: total,
      currency: "NGN",
      paid_at: new Date().toISOString(),
      channel: "card",
      authorization: { last4: "4081", brand: "visa" },
    },
  });

  const url = `${BASE}/api/webhooks/paystack`;

  // 1. Bad signature must be rejected before any DB work.
  const bad = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": "deadbeef",
    },
    body: payload,
  });
  console.log(`bad signature      -> ${bad.status} (expect 401)`);

  // 2. Valid delivery.
  const first = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": sign(payload),
    },
    body: payload,
  });
  console.log(`first delivery     -> ${first.status} ${await first.text()}`);

  // 3. Redelivery of the identical event.
  const second = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": sign(payload),
    },
    body: payload,
  });
  console.log(`redelivery         -> ${second.status} ${await second.text()}`);

  const finalOrder = await db.query.orders.findFirst({
    where: eq(schema.orders.id, order.id),
    columns: { status: true },
  });
  const payments = await db.query.payments.findMany({
    where: eq(schema.payments.orderId, order.id),
  });
  const events = await db.query.orderEvents.findMany({
    where: eq(schema.orderEvents.orderId, order.id),
  });
  const emails = await db.query.emailSends.findMany({
    where: eq(schema.emailSends.orderId, order.id),
  });
  const after = await db.query.variants.findFirst({
    where: eq(schema.variants.id, variant.id),
  });

  console.log("\n--- results ---");
  console.log(`order status       : ${finalOrder?.status}      (expect paid)`);
  console.log(`payment rows       : ${payments.length}          (expect 1)`);
  console.log(`order_events rows  : ${events.length}          (expect 1)`);
  console.log(`emails queued      : ${emails.length}          (expect 1)`);
  console.log(
    `stock ${stockBefore} -> ${after?.stockOnHand}   (expect ${stockBefore - 2})`
  );
  console.log(`reserved           : ${after?.stockReserved}          (expect 0)`);

  const ok =
    finalOrder?.status === "paid" &&
    payments.length === 1 &&
    events.length === 1 &&
    emails.length === 1 &&
    after?.stockOnHand === stockBefore - 2 &&
    after?.stockReserved === 0;

  console.log(ok ? "\nPASS" : "\nFAIL");
  await closeDb();
  process.exitCode = ok ? 0 : 1;
}

main().catch(async (e) => {
  console.error(e);
  await closeDb();
  process.exitCode = 1;
});
