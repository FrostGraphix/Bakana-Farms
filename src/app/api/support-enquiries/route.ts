import { z } from "zod";
import { getDb, hasDatabase, schema } from "@/server/db";
import { checkRateLimit, rateLimitResponse } from "@/server/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supportSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  orderReference: z.string().trim().max(80).optional(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(3000),
});

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return Response.json(
      { error: "Support messages are temporarily unavailable." },
      { status: 503 }
    );
  }

  const rateLimit = await checkRateLimit(request, {
    scope: "support-enquiry",
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = supportSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return Response.json(
      { error: "Check the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  const db = getDb();
  const [enquiry] = await db.transaction(async (tx) => {
    const created = await tx
      .insert(schema.supportEnquiries)
      .values({
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        orderReference: parsed.data.orderReference?.toUpperCase() || null,
        subject: parsed.data.subject,
        message: parsed.data.message,
      })
      .returning({ id: schema.supportEnquiries.id });

    await tx.insert(schema.emailSends).values({
      template: "support-enquiry-received",
      tier: 1,
      recipient: parsed.data.email.toLowerCase(),
      payload: { enquiryId: created[0]?.id ?? "unknown" },
    });

    return created;
  });

  return Response.json(
    { accepted: true, enquiryId: enquiry?.id },
    { status: 201 }
  );
}
