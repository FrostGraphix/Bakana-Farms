import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { getDb, hasDatabase, schema } from "@/server/db";
import { checkRateLimit, rateLimitResponse } from "@/server/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const enquirySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(160, "Company name must not exceed 160 characters"),
  registrationNumber: z.string().trim().max(80).optional(),
  contactName: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters")
    .max(120, "Contact name must not exceed 120 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid business email address")
    .max(254),
  phone: z.string().trim().max(30).optional(),
  destinationMarket: z
    .string()
    .trim()
    .min(2, "Please specify your target destination market")
    .max(120),
  estimatedVolume: z
    .string()
    .trim()
    .min(2, "Please specify your estimated order volume")
    .max(120),
  targetDeliveryWindow: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must confirm corporate authority and accept terms to proceed" }),
  }),
});

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Enquiries are temporarily unavailable." },
      { status: 503 }
    );
  }

  const rateLimit = await checkRateLimit(request, {
    scope: "wholesale-enquiry",
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

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
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

  const data = parsed.data;
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  const ipAddress = forwarded?.split(",")[0]?.trim() ?? null;
  const db = getDb();

  const [enquiry] = await db.transaction(async (tx) => {
    const created = await tx
      .insert(schema.wholesaleEnquiries)
      .values({
        companyName: data.companyName,
        registrationNumber: data.registrationNumber || null,
        contactName: data.contactName,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        destinationMarket: data.destinationMarket,
        estimatedVolume: data.estimatedVolume,
        targetDeliveryWindow: data.targetDeliveryWindow || null,
        message: data.message || null,
      })
      .returning({ id: schema.wholesaleEnquiries.id });

    await tx.insert(schema.consentRecords).values({
      email: data.email.toLowerCase(),
      purpose: "wholesale-enquiry-response",
      granted: true,
      noticeVersion: "wholesale-enquiry-v1",
      source: "wholesale-form",
      ipAddress,
    });

    await tx.insert(schema.emailSends).values({
      template: "wholesale-enquiry-received",
      tier: 1,
      recipient: data.email.toLowerCase(),
      payload: { enquiryId: created[0]?.id ?? "unknown" },
    });

    return created;
  });

  if (!enquiry) {
    return NextResponse.json({ error: "Enquiry was not saved." }, { status: 500 });
  }

  return NextResponse.json(
    {
      accepted: true,
      enquiryId: enquiry.id,
      message: "Your enquiry was received.",
    },
    { status: 201 }
  );
}
