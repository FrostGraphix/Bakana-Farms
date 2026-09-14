import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Paystack integration.
 *
 * Paystack carries both NGN and USD for Nigerian merchants.
 * Stripe is deliberately absent: Nigeria is outside Stripe's
 * supported countries and appears only in its extended network,
 * which routes to Paystack. Do not add a Stripe branch.
 */

const PAYSTACK_API = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return key;
}

/**
 * Verify the webhook signature.
 *
 * Three details that are easy to get wrong and expensive to miss:
 *   1. SHA-512, not SHA-256.
 *   2. Against the EXACT raw body. Re-serialising the parsed JSON
 *      changes key order and whitespace, and the digest no longer
 *      matches.
 *   3. Constant-time comparison. A plain `===` leaks timing
 *      information that can be used to forge a signature.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;

  const expected = createHmac("sha512", secretKey())
    .update(rawBody, "utf8")
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signatureHeader, "utf8");

  // timingSafeEqual throws on length mismatch, so guard first.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export type PaystackEvent = {
  event: string;
  data: {
    id?: number;
    reference?: string;
    transaction_reference?: string;
    refund_reference?: string | null;
    status: string;
    amount: number | string;
    currency: string;
    paid_at?: string | null;
    channel?: string | null;
    authorization?: {
      last4?: string | null;
      brand?: string | null;
    } | null;
    metadata?: Record<string, unknown> | null;
  };
};

/**
 * Paystack does not send a dedicated event id, so the transaction
 * id plus the event name is the stable dedup key. That pair is
 * what the unique index on `webhook_events` enforces.
 */
export function eventId(event: PaystackEvent, rawBody?: string): string {
  if (event.data.id !== undefined) return `${event.event}:${event.data.id}`;
  const digest = createHash("sha256")
    .update(rawBody ?? JSON.stringify(event))
    .digest("hex");
  return `${event.event}:${digest}`;
}

type InitializeParams = {
  email: string;
  /** Minor units. Paystack expects kobo for NGN, cents for USD. */
  amount: number;
  currency: "NGN" | "USD";
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export async function initializeTransaction(params: InitializeParams): Promise<{
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}> {
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      currency: params.currency,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const body = await res.json();

  if (!res.ok || !body.status) {
    throw new Error(
      `Paystack initialize failed: ${body?.message ?? res.statusText}`
    );
  }

  return {
    authorizationUrl: body.data.authorization_url,
    accessCode: body.data.access_code,
    reference: body.data.reference,
  };
}

/**
 * Server-side verification of a transaction.
 *
 * Used by the reconciliation job and as the authority when a
 * customer returns from the gateway. The redirect itself is never
 * trusted: anyone can navigate to the callback URL.
 */
export async function verifyTransaction(reference: string): Promise<{
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  channel: string | null;
  last4: string | null;
  brand: string | null;
}> {
  const res = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } }
  );

  const body = await res.json();

  if (!res.ok || !body.status) {
    throw new Error(
      `Paystack verify failed: ${body?.message ?? res.statusText}`
    );
  }

  return {
    status: body.data.status,
    amount: body.data.amount,
    currency: body.data.currency,
    paidAt: body.data.paid_at ?? null,
    channel: body.data.channel ?? null,
    last4: body.data.authorization?.last4 ?? null,
    brand: body.data.authorization?.brand ?? null,
  };
}

export async function refundTransaction(params: {
  reference: string;
  /** Minor units. Omit for a full refund. */
  amount?: number;
  reason?: string;
}): Promise<{ id: number; status: string }> {
  const res = await fetch(`${PAYSTACK_API}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction: params.reference,
      amount: params.amount,
      merchant_note: params.reason,
    }),
  });

  const body = await res.json();

  if (!res.ok || !body.status) {
    throw new Error(`Paystack refund failed: ${body?.message ?? res.statusText}`);
  }

  return { id: body.data.id, status: body.data.status };
}
