import { and, eq, sql, lt } from "drizzle-orm";
import { getDb, schema } from "@/server/db";

/**
 * Cart and inventory reservation.
 *
 * The whole reason this file exists is one race: two shoppers with
 * the last unit in their carts. Read stock, then write an order,
 * and both succeed. The fix is to make the check and the decrement
 * a single atomic statement, and to hold the unit while the
 * shopper is in checkout.
 *
 * Reservations expire. Otherwise an abandoned cart holds the last
 * pack of a batch indefinitely and the product reads as sold out
 * to everyone else.
 */

/** How long a checkout holds stock before the unit is released. */
export const RESERVATION_MINUTES = 20;

/** Per-line ceiling. Wholesale volume goes through the quote flow. */
export const MAX_QUANTITY_PER_LINE = 10;

export class CartError extends Error {
  constructor(
    message: string,
    readonly code:
      | "VARIANT_NOT_FOUND"
      | "INSUFFICIENT_STOCK"
      | "INVALID_QUANTITY"
      | "CART_NOT_FOUND"
  ) {
    super(message);
    this.name = "CartError";
  }
}

export async function getOrCreateCart(params: {
  customerId?: string | null;
  guestToken: string;
}): Promise<string> {
  const db = getDb();

  const existing = await db.query.carts.findFirst({
    where: params.customerId
      ? eq(schema.carts.customerId, params.customerId)
      : eq(schema.carts.guestToken, params.guestToken),
  });

  if (existing) return existing.id;

  const [created] = await db
    .insert(schema.carts)
    .values({
      customerId: params.customerId ?? null,
      guestToken: params.customerId ? null : params.guestToken,
    })
    .returning({ id: schema.carts.id });

  if (!created) throw new CartError("Could not create cart", "CART_NOT_FOUND");
  return created.id;
}

/**
 * Add a line, reserving stock atomically.
 *
 * The reservation increment carries its own guard in the WHERE
 * clause, so the database refuses to over-reserve rather than
 * relying on us having read a fresh number first. If zero rows
 * come back, someone else took the stock between our read and our
 * write, which is exactly the case a naive implementation misses.
 */
export async function addItem(params: {
  cartId: string;
  variantId: string;
  quantity: number;
}): Promise<{ reserved: number }> {
  const { cartId, variantId, quantity } = params;

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY_PER_LINE
  ) {
    throw new CartError(
      `Quantity must be between 1 and ${MAX_QUANTITY_PER_LINE}.`,
      "INVALID_QUANTITY"
    );
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const existingLine = await tx.query.cartItems.findFirst({
      where: and(
        eq(schema.cartItems.cartId, cartId),
        eq(schema.cartItems.variantId, variantId)
      ),
      columns: { quantity: true },
    });

    const nextQuantity = (existingLine?.quantity ?? 0) + quantity;
    if (nextQuantity > MAX_QUANTITY_PER_LINE) {
      throw new CartError(
        `Maximum quantity is ${MAX_QUANTITY_PER_LINE}.`,
        "INVALID_QUANTITY"
      );
    }

    const variant = await tx.query.variants.findFirst({
      where: and(
        eq(schema.variants.id, variantId),
        eq(schema.variants.isActive, true)
      ),
    });

    if (!variant) {
      throw new CartError("That size is no longer available.", "VARIANT_NOT_FOUND");
    }

    // Conditional update. The guard lives in the statement, so a
    // concurrent transaction cannot slip between check and write.
    const reserved = await tx
      .update(schema.variants)
      .set({
        stockReserved: sql`${schema.variants.stockReserved} + ${quantity}`,
      })
      .where(
        and(
          eq(schema.variants.id, variantId),
          sql`${schema.variants.stockOnHand} - ${schema.variants.stockReserved} >= ${quantity}`
        )
      )
      .returning({ id: schema.variants.id });

    if (reserved.length === 0) {
      const available = variant.stockOnHand - variant.stockReserved;
      throw new CartError(
        available > 0
          ? `Only ${available} left. Reduce the quantity to continue.`
          : "That size just sold out.",
        "INSUFFICIENT_STOCK"
      );
    }

    await tx
      .insert(schema.cartItems)
      .values({ cartId, variantId, quantity })
      .onConflictDoUpdate({
        target: [schema.cartItems.cartId, schema.cartItems.variantId],
        set: { quantity: sql`${schema.cartItems.quantity} + ${quantity}` },
      });

    await tx.insert(schema.stockMovements).values({
      variantId,
      delta: -quantity,
      reason: "reservation",
      note: `cart:${cartId}`,
    });

    await tx
      .update(schema.carts)
      .set({
        reservationExpiresAt: new Date(
          Date.now() + RESERVATION_MINUTES * 60_000
        ),
        updatedAt: new Date(),
      })
      .where(eq(schema.carts.id, cartId));

    return { reserved: quantity };
  });
}

/**
 * Replace a line quantity while preserving the reservation ledger.
 * Increasing reserves only the difference. Decreasing releases only
 * the difference. Zero removes the line entirely.
 */
export async function setItemQuantity(params: {
  cartId: string;
  variantId: string;
  quantity: number;
}): Promise<void> {
  const { cartId, variantId, quantity } = params;

  if (
    !Number.isInteger(quantity) ||
    quantity < 0 ||
    quantity > MAX_QUANTITY_PER_LINE
  ) {
    throw new CartError(
      `Quantity must be between 0 and ${MAX_QUANTITY_PER_LINE}.`,
      "INVALID_QUANTITY"
    );
  }

  const db = getDb();

  await db.transaction(async (tx) => {
    const line = await tx.query.cartItems.findFirst({
      where: and(
        eq(schema.cartItems.cartId, cartId),
        eq(schema.cartItems.variantId, variantId)
      ),
      columns: { quantity: true },
    });

    if (!line) {
      throw new CartError("That item is not in your cart.", "CART_NOT_FOUND");
    }

    const difference = quantity - line.quantity;
    if (difference === 0) return;

    if (quantity === 0) {
      await tx
        .delete(schema.cartItems)
        .where(
          and(
            eq(schema.cartItems.cartId, cartId),
            eq(schema.cartItems.variantId, variantId)
          )
        );
      await releaseReservation(tx, variantId, line.quantity, cartId);
      return;
    }

    if (difference > 0) {
      const reserved = await tx
        .update(schema.variants)
        .set({
          stockReserved: sql`${schema.variants.stockReserved} + ${difference}`,
        })
        .where(
          and(
            eq(schema.variants.id, variantId),
            eq(schema.variants.isActive, true),
            sql`${schema.variants.stockOnHand} - ${schema.variants.stockReserved} >= ${difference}`
          )
        )
        .returning({ id: schema.variants.id });

      if (reserved.length === 0) {
        const variant = await tx.query.variants.findFirst({
          where: eq(schema.variants.id, variantId),
          columns: { stockOnHand: true, stockReserved: true },
        });
        const available = Math.max(
          0,
          (variant?.stockOnHand ?? 0) - (variant?.stockReserved ?? 0)
        );
        throw new CartError(
          available > 0
            ? `Only ${available} more available.`
            : "That size just sold out.",
          "INSUFFICIENT_STOCK"
        );
      }

      await tx.insert(schema.stockMovements).values({
        variantId,
        delta: -difference,
        reason: "reservation",
        note: `cart:${cartId}`,
      });
    } else {
      await releaseReservation(tx, variantId, -difference, cartId);
    }

    await tx
      .update(schema.cartItems)
      .set({ quantity })
      .where(
        and(
          eq(schema.cartItems.cartId, cartId),
          eq(schema.cartItems.variantId, variantId)
        )
      );

    await tx
      .update(schema.carts)
      .set({
        reservationExpiresAt: new Date(
          Date.now() + RESERVATION_MINUTES * 60_000
        ),
        updatedAt: new Date(),
      })
      .where(eq(schema.carts.id, cartId));
  });
}

export async function removeItem(params: {
  cartId: string;
  variantId: string;
}): Promise<void> {
  const db = getDb();

  await db.transaction(async (tx) => {
    const [line] = await tx
      .delete(schema.cartItems)
      .where(
        and(
          eq(schema.cartItems.cartId, params.cartId),
          eq(schema.cartItems.variantId, params.variantId)
        )
      )
      .returning({ quantity: schema.cartItems.quantity });

    if (!line) return;

    await releaseReservation(tx, params.variantId, line.quantity, params.cartId);
  });
}

export async function getCart(cartId: string) {
  const db = getDb();

  const cart = await db.query.carts.findFirst({
    where: eq(schema.carts.id, cartId),
    with: { items: { with: { variant: { with: { product: true } } } } },
  });

  if (!cart) return null;

  const lines = cart.items.map((item) => {
    const unitPrice =
      cart.currency === "USD" && item.variant.priceUsd !== null
        ? item.variant.priceUsd
        : item.variant.priceNgn;
    return {
      variantId: item.variantId,
      quantity: item.quantity,
      sku: item.variant.sku,
      name: item.variant.product.name,
      variantName: item.variant.name,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });

  return {
    id: cart.id,
    currency: cart.currency,
    reservationExpiresAt: cart.reservationExpiresAt,
    lines,
    subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}

type Tx = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];

async function releaseReservation(
  tx: Tx,
  variantId: string,
  quantity: number,
  cartId: string
): Promise<void> {
  await tx
    .update(schema.variants)
    .set({
      // Clamped at zero. A reservation released twice must never
      // drive the counter negative and corrupt availability.
      stockReserved: sql`GREATEST(0, ${schema.variants.stockReserved} - ${quantity})`,
    })
    .where(eq(schema.variants.id, variantId));

  await tx.insert(schema.stockMovements).values({
    variantId,
    delta: quantity,
    reason: "reservation_released",
    note: `cart:${cartId}`,
  });
}

/**
 * Sweeps expired reservations.
 *
 * Runs on a schedule. Without it, every abandoned checkout
 * permanently removes stock from sale.
 */
export async function releaseExpiredReservations(): Promise<number> {
  const db = getDb();

  const expired = await db.query.carts.findMany({
    where: lt(schema.carts.reservationExpiresAt, new Date()),
    with: { items: true },
  });

  let released = 0;

  for (const cart of expired) {
    await db.transaction(async (tx) => {
      for (const item of cart.items) {
        await releaseReservation(tx, item.variantId, item.quantity, cart.id);
        released += item.quantity;
      }
      await tx
        .update(schema.carts)
        .set({ reservationExpiresAt: null })
        .where(eq(schema.carts.id, cart.id));
    });
  }

  return released;
}

/**
 * Merge guest cart into authenticated customer cart on login.
 * Closes the cart merge gap.
 */
export async function mergeGuestCartIntoCustomerCart(params: {
  guestToken: string;
  customerId: string;
}): Promise<void> {
  const db = getDb();
  const guestCart = await db.query.carts.findFirst({
    where: eq(schema.carts.guestToken, params.guestToken),
    with: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return;

  const customerCart = await db.query.carts.findFirst({
    where: eq(schema.carts.customerId, params.customerId),
    with: { items: true },
  });

  if (!customerCart) {
    // Reassign guest cart directly to customer
    await db
      .update(schema.carts)
      .set({
        customerId: params.customerId,
        guestToken: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.carts.id, guestCart.id));
    return;
  }

  // Both carts exist: transfer items from guestCart into customerCart
  await db.transaction(async (tx) => {
    for (const guestItem of guestCart.items) {
      const existing = customerCart.items.find(
        (i) => i.variantId === guestItem.variantId
      );
      if (existing) {
        const newQty = Math.min(
          existing.quantity + guestItem.quantity,
          MAX_QUANTITY_PER_LINE
        );
        await tx
          .update(schema.cartItems)
          .set({ quantity: newQty })
          .where(
            and(
              eq(schema.cartItems.cartId, customerCart.id),
              eq(schema.cartItems.variantId, guestItem.variantId)
            )
          );
      } else {
        await tx.insert(schema.cartItems).values({
          cartId: customerCart.id,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
        });
      }
    }

    // Clear guest cart items and remove the guest cart
    await tx
      .delete(schema.cartItems)
      .where(eq(schema.cartItems.cartId, guestCart.id));
    await tx.delete(schema.carts).where(eq(schema.carts.id, guestCart.id));
  });
}

