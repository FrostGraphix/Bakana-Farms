import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, hasDatabase, schema } from "@/server/db";
import { checkRateLimit, rateLimitResponse } from "@/server/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const lookupSchema = z.object({
  reference: z.string().trim().min(6).max(80),
  email: z.string().trim().email().max(254),
});

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return Response.json(
      { error: "Order tracking is temporarily unavailable." },
      { status: 503 }
    );
  }

  const rateLimit = await checkRateLimit(request, {
    scope: "order-lookup",
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = lookupSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Enter your reference and email." },
      { status: 422 }
    );
  }

  const reference = parsed.data.reference.toUpperCase();
  const email = parsed.data.email.toLowerCase();
  const db = getDb();
  const order = await db.query.orders.findFirst({
    where: and(
      eq(schema.orders.reference, reference),
      sql`lower(${schema.orders.email}) = ${email}`
    ),
    with: { items: true },
  });

  if (!order) {
    return Response.json(
      { error: "Those order details do not match." },
      { status: 404 }
    );
  }

  const events = await db
    .select({
      status: schema.orderEvents.toStatus,
      occurredAt: schema.orderEvents.createdAt,
    })
    .from(schema.orderEvents)
    .where(
      and(
        eq(schema.orderEvents.orderId, order.id),
        sql`${schema.orderEvents.toStatus} is not null`
      )
    )
    .orderBy(asc(schema.orderEvents.createdAt));

  return Response.json({
    order: {
      reference: order.reference,
      status: order.status,
      currency: order.currency,
      subtotal: order.subtotal,
      shippingAmount: order.shippingAmount,
      taxAmount: order.taxAmount,
      discountAmount: order.discountAmount,
      total: order.total,
      placedAt: order.placedAt?.toISOString() ?? null,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        variantName: item.variantName,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      events: events.map((event) => ({
        status: event.status,
        occurredAt: event.occurredAt.toISOString(),
      })),
    },
  });
}
