import { z } from "zod";
import { authenticatedUser, isClerkConfigured } from "@/server/auth/clerk";
import { hasDatabase } from "@/server/db";
import { requestRefund } from "@/server/payments/refunds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const refundSchema = z.object({
  amount: z.number().int().positive(),
  reason: z.string().trim().min(5).max(500),
  idempotencyKey: z.string().uuid(),
  confirmation: z.literal("REFUND"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isClerkConfigured()) return Response.json({ error: "Not found" }, { status: 404 });
  const user = await authenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const role = readRole(user.privateMetadata);
  if (!user.twoFactorEnabled || (role !== "owner" && role !== "admin")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!hasDatabase()) return Response.json({ error: "Unavailable" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }
  const parsed = refundSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid refund request" }, { status: 422 });

  const { id } = await params;
  try {
    const refund = await requestRefund({
      orderId: id,
      amount: parsed.data.amount,
      reason: parsed.data.reason,
      idempotencyKey: parsed.data.idempotencyKey,
      actorReference: user.id,
    });
    return Response.json({ refund: { id: refund.id, status: refund.status } }, { status: 202 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Refund failed" },
      { status: 409 }
    );
  }
}

function readRole(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || !("role" in metadata)) return null;
  const role = (metadata as { role?: unknown }).role;
  return typeof role === "string" ? role : null;
}
