import { and, count, eq, gte, sql } from "drizzle-orm";
import { Resend } from "resend";
import { OrderStatusEmail } from "@/emails/order-status";
import { EnquiryReceivedEmail } from "@/emails/enquiry-received";
import { getDb, schema } from "@/server/db";

const SUBJECTS: Record<string, string> = {
  "order-confirmed": "Your Bakana Farms order is confirmed",
  "order-processing": "Your order is being prepared",
  "order-shipped": "Your Bakana Farms order has shipped",
  "order-delivered": "Your Bakana Farms order was delivered",
  "payment-failed": "Your payment was not completed",
  "order-cancelled": "Your Bakana Farms order was cancelled",
  "order-refunded": "Your Bakana Farms refund update",
  "wholesale-enquiry-received": "Your wholesale enquiry was received",
  "support-enquiry-received": "Your support message was received",
};

const MESSAGES: Record<string, string> = {
  "order-confirmed": "Payment is confirmed. We will prepare your order next.",
  "order-processing": "Your order is now being prepared.",
  "order-shipped": "Your order has left our care.",
  "order-delivered": "Your order is marked delivered.",
  "payment-failed": "Payment was not completed. Your order was not confirmed.",
  "order-cancelled": "This order has been cancelled.",
  "order-refunded": "A refund update was recorded for this order.",
};

function resendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set.");
  return new Resend(key);
}

function sender(): string {
  const address = process.env.RESEND_FROM_EMAIL;
  if (!address) throw new Error("RESEND_FROM_EMAIL is not set.");
  return `Bakana Farms <${address}>`;
}

function dailyLimit(): number {
  const parsed = Number(process.env.RESEND_DAILY_LIMIT ?? "100");
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 100;
}

async function sentToday(): Promise<number> {
  const db = getDb();
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const [result] = await db
    .select({ value: count() })
    .from(schema.emailSends)
    .where(
      and(
        eq(schema.emailSends.status, "sent"),
        gte(schema.emailSends.createdAt, start)
      )
    );
  return result?.value ?? 0;
}

async function claimNextEmail() {
  const db = getDb();
  const [claimed] = await db
    .update(schema.emailSends)
    .set({ status: "processing", error: null })
    .where(
      eq(
        schema.emailSends.id,
        sql`(
          select id from ${schema.emailSends}
          where status = 'queued'
          order by created_at asc
          for update skip locked
          limit 1
        )`
      )
    )
    .returning();
  return claimed ?? null;
}

async function sendClaimedEmail(email: NonNullable<Awaited<ReturnType<typeof claimNextEmail>>>) {
  const db = getDb();
  const limit = dailyLimit();
  const used = await sentToday();

  if (email.tier === 2 && used >= Math.floor(limit * 0.6)) {
    await db
      .update(schema.emailSends)
      .set({
        status: "shed",
        shedReason: "daily quota protection",
      })
      .where(eq(schema.emailSends.id, email.id));
    return "shed" as const;
  }

  if (used >= limit) {
    await db
      .update(schema.emailSends)
      .set({ status: "queued", error: "daily quota reached" })
      .where(eq(schema.emailSends.id, email.id));
    return "deferred" as const;
  }

  if (!email.orderId) return sendEnquiryEmail(email);

  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, email.orderId),
    with: { items: true },
  });

  if (!order) {
    await db
      .update(schema.emailSends)
      .set({ status: "failed", error: "order not found" })
      .where(eq(schema.emailSends.id, email.id));
    return "failed" as const;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) throw new Error("NEXT_PUBLIC_SITE_URL is not set.");

  const result = await resendClient().emails.send(
    {
      from: sender(),
      to: email.recipient,
      subject: SUBJECTS[email.template] ?? "Your Bakana Farms order update",
      react: OrderStatusEmail({
        reference: order.reference,
        statusLabel: SUBJECTS[email.template] ?? "Order update",
        message: MESSAGES[email.template] ?? "Your order status has changed.",
        total: order.total,
        currency: order.currency,
        items: order.items.map((item) => ({
          name: item.name,
          variantName: item.variantName,
          quantity: item.quantity,
        })),
        orderUrl: `${siteUrl}/checkout/confirmation/${order.reference}`,
      }),
    },
    { idempotencyKey: `bakana-email-${email.id}` }
  );

  if (result.error) throw new Error(result.error.message);

  await db
    .update(schema.emailSends)
    .set({ status: "sent", providerId: result.data?.id ?? null })
    .where(eq(schema.emailSends.id, email.id));
  return "sent" as const;
}

async function sendEnquiryEmail(
  email: NonNullable<Awaited<ReturnType<typeof claimNextEmail>>>
) {
  const supported = [
    "wholesale-enquiry-received",
    "support-enquiry-received",
  ].includes(email.template);

  if (!supported) {
    await getDb()
      .update(schema.emailSends)
      .set({ status: "failed", error: "unsupported email template" })
      .where(eq(schema.emailSends.id, email.id));
    return "failed" as const;
  }

  const wholesale = email.template === "wholesale-enquiry-received";
  const result = await resendClient().emails.send(
    {
      from: sender(),
      to: email.recipient,
      subject: SUBJECTS[email.template] ?? "Your Bakana Farms message",
      react: EnquiryReceivedEmail({
        heading: wholesale ? "Wholesale enquiry received" : "Support message received",
        message: wholesale
          ? "Your wholesale enquiry is safely recorded. Our team can now review the details."
          : "Your support message is safely recorded. Our team can now review the details.",
      }),
    },
    { idempotencyKey: `bakana-email-${email.id}` }
  );

  if (result.error) throw new Error(result.error.message);

  await getDb()
    .update(schema.emailSends)
    .set({ status: "sent", providerId: result.data?.id ?? null })
    .where(eq(schema.emailSends.id, email.id));
  return "sent" as const;
}

export async function drainEmailQueue(maximum = 10) {
  const result = { sent: 0, shed: 0, failed: 0, deferred: 0 };

  for (let index = 0; index < maximum; index++) {
    const email = await claimNextEmail();
    if (!email) break;

    try {
      const status = await sendClaimedEmail(email);
      result[status] += 1;
      if (status === "deferred") break;
    } catch (error) {
      await getDb()
        .update(schema.emailSends)
        .set({
          status: "queued",
          error: error instanceof Error ? error.message : "unknown",
        })
        .where(eq(schema.emailSends.id, email.id));
      result.failed += 1;
      break;
    }
  }

  return result;
}
