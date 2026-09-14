import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Wordmark } from "@/components/brand/wordmark";

export const metadata: Metadata = {
  title: "Checkout",
  // Checkout must never be indexed, and must not leak into a
  // sitemap or a referrer chain.
  robots: { index: false, follow: false },
};

/**
 * Checkout.
 *
 * The route is stripped of site navigation on purpose: every extra
 * link here is an exit. It also carries the strictest CSP in the
 * app (see next.config.ts), which forbids third-party scripts
 * entirely. No analytics, no pixels, no session replay, no chat
 * widget may be added to this page or anything it renders.
 * Checkout funnel metrics are derived server-side from confirmed
 * orders instead.
 */
export default function CheckoutPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--surface-page)]">
      {/* Minimal header. The wordmark links home, and nothing else
          competes with completing the order. */}
      <header className="border-b border-[var(--border-subtle)]">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" aria-label="Bakana Farms, home">
            <Wordmark className="h-9" />
          </Link>
          <Link
            href="/products"
            className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)] underline underline-offset-4 transition-colors hover:text-[var(--text-primary)]"
          >
            Return to products
          </Link>
        </div>
      </header>

      <main className="container-page py-8 lg:py-12">
        <h1 className="sr-only">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-[1fr_22rem] md:gap-12 lg:gap-16">
          {/* Summary comes first in the DOM on mobile so the total
              is reachable without scrolling past the whole form,
              then reorders beside the form above md. */}
          <div className="md:order-2">
            <OrderSummary />
          </div>

          <div className="md:order-1 md:max-w-[34rem]">
            <CheckoutForm />
          </div>
        </div>
      </main>
    </div>
  );
}
