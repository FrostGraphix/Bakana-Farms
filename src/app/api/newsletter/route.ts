import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, hasDatabase, schema } from "@/server/db";
import { checkRateLimit, rateLimitResponse } from "@/server/security/rate-limit";

const newsletterSchema = z.object({
  email: z.string().email().max(254),
});

/**
 * Newsletter opt-in.
 *
 * Consent is recorded with a timestamp and the version of the
 * notice consented to, because "we have their email" is not a
 * lawful basis on its own. The NDPA and GAID 2025 expect a record
 * of what each person agreed to and when.
 *
 * Consent records live in Postgres. A successful response never
 * means "accepted for later persistence".
 */
export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "New batch notifications are unavailable. Try again later." },
      { status: 503 }
    );
  }

  const rateLimit = await checkRateLimit(request, {
    scope: "newsletter",
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 422 }
    );
  }

  await getDb().insert(schema.consentRecords).values({
    email: parsed.data.email.toLowerCase(),
    purpose: "marketing.newsletter",
    granted: true,
    noticeVersion: "2026-01",
    source: "footer",
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
