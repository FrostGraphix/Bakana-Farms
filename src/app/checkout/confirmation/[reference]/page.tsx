import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { CheckCircle, Clock, XCircle } from "@phosphor-icons/react/dist/ssr";
import { getDb, schema, hasDatabase } from "@/server/db";
import { verifyTransaction } from "@/server/payments/paystack";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/wordmark";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  if (!hasDatabase()) notFound();

  const db = getDb();
  const order = await db.query.orders.findFirst({
    columns: { status: true },
    where: eq(schema.orders.reference, reference),
  });
  if (!order) notFound();

  let status = order.status;
  if (status === "pending_payment") {
    try {
      const verified = await verifyTransaction(reference);
      if (verified.status === "success") status = "paid";
      if (verified.status === "failed") status = "payment_failed";
    } catch (error) {
      console.warn("confirmation.verify_failed", {
        reference,
        message: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--surface-page)]">
      <header className="border-b border-[var(--border-subtle)]">
        <div className="container-page flex h-16 items-center">
          <Link href="/" aria-label="Bakana Farms, home">
            <Wordmark className="h-9" />
          </Link>
        </div>
      </header>
      <main className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-[42rem]">
          {status === "paid" ? (
            <StatusState
              kind="paid"
              reference={reference}
              title="Thank you. Payment confirmed."
              body="Your confirmation email contains the full order details."
            />
          ) : status === "payment_failed" || status === "cancelled" ? (
            <StatusState
              kind="failed"
              reference={reference}
              title="Payment was not completed."
              body="Check your bank before retrying payment."
            />
          ) : (
            <StatusState
              kind="pending"
              reference={reference}
              title="We are confirming payment."
              body="Please wait before attempting another payment."
            />
          )}
        </div>
      </main>
    </div>
  );
}

function StatusState({
  kind,
  reference,
  title,
  body,
}: {
  kind: "paid" | "pending" | "failed";
  reference: string;
  title: string;
  body: string;
}) {
  const icon =
    kind === "paid" ? (
      <CheckCircle size={40} weight="fill" className="text-[var(--state-success)]" aria-hidden />
    ) : kind === "pending" ? (
      <Clock size={40} weight="fill" className="text-[var(--state-info)]" aria-hidden />
    ) : (
      <XCircle size={40} weight="fill" className="text-[var(--state-error)]" aria-hidden />
    );

  return (
    <>
      {icon}
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-[1.15] text-[var(--text-primary)]">{title}</h1>
      <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">{body}</p>
      <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-5 py-4">
        <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">Order reference</p>
        <p className="mt-1 select-all font-[family-name:var(--font-mono)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">{reference}</p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={`/track-order?reference=${encodeURIComponent(reference)}`}>Track securely</Link>
        </Button>
        {kind === "pending" ? (
          <Button variant="secondary" asChild>
            <Link href={`/checkout/confirmation/${encodeURIComponent(reference)}`}>Check again</Link>
          </Button>
        ) : (
          <Button variant="secondary" asChild>
            <Link href="/products">Keep shopping</Link>
          </Button>
        )}
      </div>
    </>
  );
}
