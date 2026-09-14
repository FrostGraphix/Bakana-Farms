import { NextResponse } from "next/server";
import { isCommerceReady } from "@/server/health/readiness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public readiness signal. Never returns private configuration. */
export async function GET(): Promise<NextResponse> {
  const ready = await isCommerceReady();
  return NextResponse.json(
    { status: ready ? "ready" : "unavailable" },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
