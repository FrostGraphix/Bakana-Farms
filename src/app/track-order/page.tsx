import type { Metadata } from "next";
import { OrderTracker } from "@/components/orders/order-tracker";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Track your order",
  description: "View your Bakana Farms order status securely.",
  robots: { index: false, follow: false },
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference = "" } = await searchParams;

  return (
    <main className="container-page pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Track order" },
        ]}
      />

      <div className="mb-10 mt-6 max-w-2xl">
        <p className="eyebrow">Order tracking</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-tight text-[var(--text-primary)]">Follow your Bakana order.</h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] text-[var(--text-secondary)]">Order details need matching credentials.</p>
      </div>
      <OrderTracker initialReference={reference.slice(0, 80)} />
    </main>
  );
}
