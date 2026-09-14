import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { hasDatabase } from "@/server/db";
import { getOrCreateCart } from "@/server/cart/service";
import {
  createOrderFromCart,
  CheckoutError,
  PricingNotConfiguredError,
} from "@/server/checkout/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GUEST_COOKIE = "bf_cart";

/**
 * Address validation.
 *
 * Country is restricted to NG at this layer as well as in pricing.
 * International parcels of a NAFDAC-regulated product need the
 * export chain that Q2 has not confirmed, so they route through
 * the wholesale enquiry flow rather than card checkout.
 */
const addressSchema = z.object({
  recipient: z.string().trim().min(2, "Please enter recipient name (at least 2 characters)").max(120, "Recipient name is too long"),
  line1: z.string().trim().min(3, "Please enter street address (at least 3 characters)").max(200, "Street address is too long"),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "Please enter city").max(100),
  state: z.string().trim().min(2, "Please enter state").max(100),
  postalCode: z.string().trim().max(20).optional(),
  countryCode: z.literal("NG"),
  phone: z.string().trim().min(7, "Please enter a valid phone number (at least 7 digits)").max(24, "Phone number is too long"),
});

const checkoutSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address").max(254),
  shippingAddress: addressSchema,
  idempotencyKey: z.string().uuid(),
});

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Checkout is unavailable. Try again shortly." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    // Field-level errors so the form can focus the first bad input
    // rather than showing one generic message at the top.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { error: "Check the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  const store = await cookies();
  const guestToken = store.get(GUEST_COOKIE)?.value;

  if (!guestToken) {
    return NextResponse.json(
      { error: "Your cart has expired. Add your items again." },
      { status: 409 }
    );
  }

  try {
    const cartId = await getOrCreateCart({ guestToken });

    const result = await createOrderFromCart({
      cartId,
      email: parsed.data.email,
      shippingAddress: parsed.data.shippingAddress,
      idempotencyKey: parsed.data.idempotencyKey,
    });

    return NextResponse.json(
      {
        reference: result.reference,
        authorizationUrl: result.authorizationUrl,
        total: result.total,
        provisional: result.provisional,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof PricingNotConfiguredError) {
      // 503, not 500: this is a deliberate, temporary refusal to
      // take money on a provisional total, not a crash.
      console.warn("checkout.pricing_not_configured", error.message);
      return NextResponse.json(
        {
          error:
            "Online checkout is not open yet. Contact us and we will take your order directly.",
        },
        { status: 503 }
      );
    }

    if (error instanceof CheckoutError) {
      // 502 for a gateway failure: our request was fine, the
      // upstream was not. The cart is intact and a retry is safe.
      const status =
        error.code === "GATEWAY_UNAVAILABLE"
          ? 502
          : error.code === "EMPTY_CART"
            ? 409
            : 400;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status }
      );
    }

    console.error("checkout.failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "We could not start checkout. Try again in a moment." },
      { status: 500 }
    );
  }
}
