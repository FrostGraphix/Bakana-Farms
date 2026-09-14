import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  addItem,
  setItemQuantity,
  removeItem,
  getCart,
  getOrCreateCart,
  CartError,
  MAX_QUANTITY_PER_LINE,
} from "@/server/cart/service";
import { hasDatabase } from "@/server/db";

export const dynamic = "force-dynamic";

const GUEST_COOKIE = "bf_cart";

const addSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_LINE),
});

const removeSchema = z.object({
  variantId: z.string().uuid(),
});

const updateSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(0).max(MAX_QUANTITY_PER_LINE),
});

async function resolveGuestToken(): Promise<{
  token: string;
  isNew: boolean;
}> {
  const store = await cookies();
  const existing = store.get(GUEST_COOKIE)?.value;
  if (existing) return { token: existing, isNew: false };
  return { token: randomUUID(), isNew: true };
}

function attachGuestCookie(
  response: NextResponse,
  token: string,
  isNew: boolean
) {
  if (!isNew) return response;
  response.cookies.set(GUEST_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

function databaseUnavailable() {
  return NextResponse.json(
    {
      error:
        "The cart is not available yet. Set DATABASE_URL and run the migrations.",
    },
    { status: 503 }
  );
}

export async function POST(request: Request) {
  if (!hasDatabase()) return databaseUnavailable();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the size and quantity and try again." },
      { status: 422 }
    );
  }

  const { token, isNew } = await resolveGuestToken();

  try {
    const cartId = await getOrCreateCart({ guestToken: token });
    await addItem({ cartId, ...parsed.data });
    const cart = await getCart(cartId);

    return attachGuestCookie(
      NextResponse.json({ cart }, { status: 200 }),
      token,
      isNew
    );
  } catch (error) {
    if (error instanceof CartError) {
      // 409 for stock conflicts: the request was valid, the world
      // changed underneath it. The client shows the message as-is.
      const status = error.code === "INSUFFICIENT_STOCK" ? 409 : 400;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status }
      );
    }

    console.error("cart.add.failed", {
      code: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json(
      { error: "We could not add that just now. Try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!hasDatabase()) return databaseUnavailable();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const parsed = removeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Unknown item" }, { status: 422 });
  }

  const store = await cookies();
  const token = store.get(GUEST_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "No cart found" }, { status: 404 });
  }

  const cartId = await getOrCreateCart({ guestToken: token });
  await removeItem({ cartId, variantId: parsed.data.variantId });
  const cart = await getCart(cartId);

  return NextResponse.json({ cart }, { status: 200 });
}

export async function PATCH(request: Request) {
  if (!hasDatabase()) return databaseUnavailable();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the quantity and try again." },
      { status: 422 }
    );
  }

  const store = await cookies();
  const token = store.get(GUEST_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "No cart found" }, { status: 404 });
  }

  try {
    const cartId = await getOrCreateCart({ guestToken: token });
    await setItemQuantity({ cartId, ...parsed.data });
    const cart = await getCart(cartId);
    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    if (error instanceof CartError) {
      const status = error.code === "INSUFFICIENT_STOCK" ? 409 : 400;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status }
      );
    }

    console.error("cart.update.failed", {
      code: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json(
      { error: "We could not update that just now." },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!hasDatabase()) return databaseUnavailable();

  const store = await cookies();
  const token = store.get(GUEST_COOKIE)?.value;
  if (!token) return NextResponse.json({ cart: null }, { status: 200 });

  const cartId = await getOrCreateCart({ guestToken: token });
  const cart = await getCart(cartId);
  return NextResponse.json({ cart }, { status: 200 });
}
