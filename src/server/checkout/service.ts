import { and, eq, lt, sql } from "drizzle-orm";
import { getDb, schema } from "@/server/db";
import { releaseOrderReservations, transitionOrder } from "@/server/orders/transitions";
import { initializeTransaction } from "@/server/payments/paystack";
import {
  assertPricingConfigured,
  calculateOrderPricing,
  PricingNotConfiguredError,
} from "./pricing";
import type { StoredAddress } from "@/server/db/schema";

/**
 * Checkout: cart -> order -> gateway.
 *
 * Reservation ownership is the subtle part. The cart already holds
 * the stock (see cart/service.ts), so creating an order must NOT
 * reserve again or the shopper double-holds their own units.
 * Instead the cart rows are deleted and the hold transfers to the
 * order, which then has exactly two exits:
 *
 *   paid           -> convertReservationsToSale  (webhook)
 *   failed/expired -> releaseOrderReservations
 *
 * `releaseAbandonedOrders()` is the second exit's sweeper. Without
 * it an abandoned checkout holds stock forever, because the cart
 * sweeper can no longer see rows that now belong to an order.
 */

/** How long an unpaid order holds its stock. */
export const ORDER_PAYMENT_WINDOW_MINUTES = 30;

export class CheckoutError extends Error {
  constructor(
    message: string,
    readonly code:
      | "EMPTY_CART"
      | "CART_NOT_FOUND"
      | "STOCK_CHANGED"
      | "PRICING_UNAVAILABLE"
      | "GATEWAY_UNAVAILABLE"
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

export type CheckoutInput = {
  cartId: string;
  email: string;
  shippingAddress: StoredAddress;
  idempotencyKey: string;
  customerId?: string | null;
};

export type CheckoutResult = {
  orderId: string;
  reference: string;
  authorizationUrl: string;
  total: number;
  provisional: boolean;
};

/**
 * Human-facing order reference.
 *
 * Deliberately not the UUID: it is read aloud on the phone and
 * typed into the guest order lookup. Ambiguous characters are
 * excluded so O/0 and I/1 cannot be confused.
 */
function generateReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const year = new Date().getFullYear().toString().slice(-2);
  return `BF${year}-${suffix}`;
}

export async function createOrderFromCart(
  input: CheckoutInput
): Promise<CheckoutResult> {
  assertPricingConfigured();

  const db = getDb();

  // Idempotency check before the transaction. A retried submit
  // returns the original order rather than creating a second one.
  const existing = await db.query.orders.findFirst({
    where: eq(schema.orders.idempotencyKey, input.idempotencyKey),
    columns: { id: true, reference: true, total: true },
  });

  if (existing) {
    return {
      orderId: existing.id,
      reference: existing.reference,
      // The gateway session is re-initialised rather than stored,
      // so a resumed checkout always gets a live URL.
      authorizationUrl: await resumeAuthorization(
        existing.reference,
        input.email,
        existing.total
      ),
      total: existing.total,
      provisional: true,
    };
  }

  const created = await db.transaction(async (tx) => {
    const cart = await tx.query.carts.findFirst({
      where: eq(schema.carts.id, input.cartId),
      with: { items: { with: { variant: { with: { product: true } } } } },
    });

    if (!cart) {
      throw new CheckoutError("Cart not found.", "CART_NOT_FOUND");
    }
    if (cart.items.length === 0) {
      throw new CheckoutError("Your cart is empty.", "EMPTY_CART");
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.variant.priceNgn * item.quantity,
      0
    );
    const totalWeightGrams = cart.items.reduce(
      (sum, item) => sum + item.variant.weightGrams * item.quantity,
      0
    );

    // Tax class comes from the product, never a global constant.
    const firstProduct = cart.items[0]?.variant.product;
    const pricing = calculateOrderPricing({
      subtotal,
      currency: "NGN",
      taxClass: firstProduct?.taxClass ?? "standard",
      countryCode: input.shippingAddress.countryCode,
      totalWeightGrams,
    });

    const reference = generateReference();

    const [order] = await tx
      .insert(schema.orders)
      .values({
        reference,
        customerId: input.customerId ?? null,
        email: input.email.toLowerCase(),
        status: "pending_payment",
        channel: "b2c",
        currency: "NGN",
        subtotal: pricing.subtotal,
        shippingAmount: pricing.shippingAmount,
        taxAmount: pricing.taxAmount,
        discountAmount: pricing.discountAmount,
        total: pricing.total,
        shippingAddress: input.shippingAddress,
        idempotencyKey: input.idempotencyKey,
        notes: pricing.provisional ? pricing.notes.join(" | ") : null,
      })
      .returning({ id: schema.orders.id });

    if (!order) throw new Error("Order insert returned no row");

    // Line items snapshot name, SKU and unit price. A price change
    // next month must not rewrite what an old order says was paid.
    for (const item of cart.items) {
      await tx.insert(schema.orderItems).values({
        orderId: order.id,
        variantId: item.variantId,
        sku: item.variant.sku,
        name: item.variant.product.name,
        variantName: item.variant.name,
        unitPrice: item.variant.priceNgn,
        quantity: item.quantity,
        lineTotal: item.variant.priceNgn * item.quantity,
        taxRateBps: pricing.taxRateBps,
      });
    }

    await tx.insert(schema.orderEvents).values({
      orderId: order.id,
      toStatus: "pending_payment",
      type: "checkout.order_created",
      payload: { reference, provisional: pricing.provisional },
    });

    // The cart is deliberately NOT deleted here. Deleting it
    // before the gateway call means a network failure loses the
    // shopper's cart and strands an order holding stock. The hold
    // transfers only once payment has somewhere to go.
    return { orderId: order.id, reference, total: pricing.total, pricing, cartId: cart.id };
  });

  let authorizationUrl: string;

  try {
    const init = await initializeTransaction({
      email: input.email,
      amount: created.total,
      currency: "NGN",
      reference: created.reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/confirmation/${created.reference}`,
      metadata: { orderId: created.orderId },
    });
    authorizationUrl = init.authorizationUrl;
  } catch (error) {
    /**
     * The gateway is unreachable or rejected the initialisation.
     *
     * Cancel the order so it does not sit in `pending_payment`
     * forever, but do NOT release reservations: the cart still
     * exists and still owns that hold. Releasing here would
     * double-release and corrupt availability.
     *
     * The cart is left intact so the shopper can simply try again.
     */
    await db.transaction(async (tx) => {
      await transitionOrder({
        orderId: created.orderId,
        to: "cancelled",
        type: "checkout.gateway_unavailable",
        payload: {
          reference: created.reference,
          message: error instanceof Error ? error.message : "unknown",
        },
        tx,
      });
    });

    throw new CheckoutError(
      "We could not reach the payment provider. Your cart is safe, please try again.",
      "GATEWAY_UNAVAILABLE"
    );
  }

  // Payment has somewhere to go. Now transfer the hold: delete the
  // cart rows WITHOUT releasing the reservation, so the stock
  // belongs to the order from this point on.
  await db.transaction(async (tx) => {
    await tx
      .delete(schema.cartItems)
      .where(eq(schema.cartItems.cartId, created.cartId));
    await tx.delete(schema.carts).where(eq(schema.carts.id, created.cartId));
  });

  return {
    orderId: created.orderId,
    reference: created.reference,
    authorizationUrl,
    total: created.total,
    provisional: created.pricing.provisional,
  };
}

async function resumeAuthorization(
  reference: string,
  email: string,
  amount: number
): Promise<string> {
  const { authorizationUrl } = await initializeTransaction({
    email,
    amount,
    currency: "NGN",
    reference,
    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/confirmation/${reference}`,
  });
  return authorizationUrl;
}

/**
 * Release stock held by orders that were never paid.
 *
 * Runs on a schedule. This is the counterpart to the cart
 * reservation sweeper: once a cart becomes an order, the cart
 * sweeper can no longer see it.
 */
export async function releaseAbandonedOrders(): Promise<number> {
  const db = getDb();
  const cutoff = new Date(Date.now() - ORDER_PAYMENT_WINDOW_MINUTES * 60_000);

  const abandoned = await db.query.orders.findMany({
    where: and(
      eq(schema.orders.status, "pending_payment"),
      lt(schema.orders.createdAt, cutoff)
    ),
    columns: { id: true },
  });

  for (const order of abandoned) {
    await db.transaction(async (tx) => {
      const { applied } = await transitionOrder({
        orderId: order.id,
        to: "cancelled",
        type: "checkout.abandoned",
        payload: { reason: "payment window elapsed" },
        tx,
      });
      if (applied) await releaseOrderReservations(tx, order.id);
    });
  }

  return abandoned.length;
}

export { PricingNotConfiguredError };
