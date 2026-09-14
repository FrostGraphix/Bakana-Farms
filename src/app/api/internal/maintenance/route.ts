import { lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { releaseExpiredReservations } from "@/server/cart/service";
import { releaseAbandonedOrders } from "@/server/checkout/service";
import { getDb, hasDatabase, schema } from "@/server/db";
import { drainEmailQueue } from "@/server/email/service";
import { reconcilePendingPayments } from "@/server/payments/reconcile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function run(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const reconciliation = await reconcilePendingPayments();
  const cartUnitsReleased = await releaseExpiredReservations();
  const ordersReleased = await releaseAbandonedOrders();
  const email = await drainEmailQueue();
  const expiredRateLimits = await getDb()
    .delete(schema.rateLimitBuckets)
    .where(lt(schema.rateLimitBuckets.expiresAt, new Date()))
    .returning({ key: schema.rateLimitBuckets.key });

  return NextResponse.json({
    completed: true,
    cartUnitsReleased,
    ordersReleased,
    email,
    reconciliation,
    rateLimitBucketsDeleted: expiredRateLimits.length,
    completedAt: new Date().toISOString(),
  });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}
