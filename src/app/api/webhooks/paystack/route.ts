import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema, hasDatabase } from "@/server/db";
import {
  verifyWebhookSignature,
  eventId,
  type PaystackEvent,
} from "@/server/payments/paystack";
import {
  recordFailedPayment,
  recordSuccessfulPayment,
} from "@/server/payments/process-payment";

// Must run on Node: signature verification needs node:crypto and
// the raw request body.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Paystack webhook receiver.
 *
 * Sequence is deliberate and must not be reordered:
 *
 *   1. Read the RAW body. Parsing first and re-serialising changes
 *      key order and whitespace, and the HMAC no longer matches.
 *   2. Verify the signature. Reject before touching the database,
 *      so an unauthenticated caller cannot make us do work.
 *   3. Record the event. The unique index on (provider, event_id)
 *      is what makes redelivery safe.
 *   4. Process, then mark processed.
 *
 * A 200 is returned for anything we have accepted responsibility
 * for, including duplicates. Non-2xx makes Paystack retry, which
 * is only wanted when we genuinely failed to record the event.
 */
export async function POST(request: Request) {
  if (!hasDatabase()) {
    // 503 so the gateway retries once the database is back, rather
    // than treating the event as delivered.
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn("paystack.webhook.invalid_signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(rawBody) as PaystackEvent;
  } catch {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const db = getDb();
  const id = eventId(event, rawBody);

  // Record first. If this insert conflicts, we have seen the event
  // before and there is nothing left to do.
  const inserted = await db
    .insert(schema.webhookEvents)
    .values({
      provider: "paystack",
      eventId: id,
      eventType: event.event,
      signatureValid: true,
      payload: event as unknown as Record<string, unknown>,
    })
    .onConflictDoNothing({
      target: [schema.webhookEvents.provider, schema.webhookEvents.eventId],
    })
    .returning({ id: schema.webhookEvents.id });

  const record = inserted[0];
  if (!record) {
    // Duplicate delivery. Acknowledge without reprocessing.
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    await processEvent(event);

    await db
      .update(schema.webhookEvents)
      .set({ processedAt: new Date() })
      .where(eq(schema.webhookEvents.id, record.id));

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";

    await db
      .update(schema.webhookEvents)
      .set({ processingError: message })
      .where(eq(schema.webhookEvents.id, record.id));

    console.error("paystack.webhook.processing_failed", {
      eventId: id,
      message,
    });

    // The event is stored, so the reconciliation job can replay it.
    // Returning 200 stops Paystack retrying into the same failure.
    return NextResponse.json({ received: true, deferred: true });
  }
}

async function processEvent(event: PaystackEvent): Promise<void> {
  switch (event.event) {
    case "charge.success":
      return handleChargeSuccess(event);
    case "charge.failed":
      return handleChargeFailed(event);
    case "refund.pending":
    case "refund.processing":
    case "refund.needs-attention":
    case "refund.failed":
    case "refund.processed":
      return handleRefundEvent(event);
    default:
      // Unhandled events are still recorded above, which is what
      // makes adding a handler later a backfill rather than a
      // permanent gap.
      return;
  }
}

async function handleChargeSuccess(event: PaystackEvent): Promise<void> {
  if (!event.data.reference || typeof event.data.amount !== "number") {
    throw new Error("Invalid charge success payload");
  }
  await recordSuccessfulPayment({
    reference: event.data.reference,
    amount: event.data.amount,
    currency: event.data.currency,
    paidAt: event.data.paid_at,
    channel: event.data.channel,
    last4: event.data.authorization?.last4,
    brand: event.data.authorization?.brand,
    eventType: "paystack.charge.success",
  });
}

async function handleChargeFailed(event: PaystackEvent): Promise<void> {
  if (!event.data.reference) throw new Error("Invalid charge failure payload");
  await recordFailedPayment({
    reference: event.data.reference,
    eventType: "paystack.charge.failed",
  });
}

async function handleRefundEvent(event: PaystackEvent): Promise<void> {
  const { processRefundEvent } = await import("@/server/payments/refunds");
  const reference = event.data.transaction_reference;
  const amount = Number(event.data.amount);
  if (!reference || !Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid refund payload");
  }

  await processRefundEvent({
    transactionReference: reference,
    refundReference: event.data.refund_reference ?? null,
    amount,
    status: event.data.status,
    eventType: event.event,
  });
}
