import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { count, desc, eq } from "drizzle-orm";
import { authenticatedUser, isClerkConfigured } from "@/server/auth/clerk";
import { getDb, hasDatabase, schema } from "@/server/db";
import { AdminOrdersTable, type AdminOrderRecord } from "@/components/admin/orders-table";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import type { Currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commerce administration",
  robots: { index: false, follow: false },
};

const ADMIN_ROLES = new Set(["owner", "admin", "editor", "support"]);

export default async function AdminPage() {
  if (!isClerkConfigured()) notFound();
  const user = await authenticatedUser();
  if (!user) redirect("/sign-in?redirect_url=/admin");

  const role = readRole(user.privateMetadata);
  if (!role || !ADMIN_ROLES.has(role)) notFound();
  if (!user.twoFactorEnabled) {
    return <AdminBlocked />;
  }
  if (!hasDatabase())
    return <AdminBlocked message="Database access is unavailable." />;

  const db = getDb();
  const [orderTotal, pendingTotal, enquiryTotal, rawRecentOrders] =
    await Promise.all([
      db.select({ value: count() }).from(schema.orders),
      db
        .select({ value: count() })
        .from(schema.orders)
        .where(eq(schema.orders.status, "pending_payment")),
      db
        .select({ value: count() })
        .from(schema.wholesaleEnquiries)
        .where(eq(schema.wholesaleEnquiries.status, "new")),
      db.query.orders.findMany({
        orderBy: [desc(schema.orders.createdAt)],
        limit: 15,
      }),
    ]);

  const recentOrders: AdminOrderRecord[] = rawRecentOrders.map((o) => ({
    id: o.id,
    reference: o.reference,
    status: o.status,
    channel: o.channel,
    currency: o.currency as Currency,
    total: o.total,
    createdAt: o.createdAt,
  }));

  return (
    <main className="container-page pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Administration" },
        ]}
      />

      <div className="mt-6">
        <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Commerce Operations
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
          Bakana administration.
        </h1>
      </div>

      {/* Glassmorphic Metric Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric label="Total Orders Placed" value={orderTotal[0]?.value ?? 0} />
        <Metric
          label="Pending Verifications"
          value={pendingTotal[0]?.value ?? 0}
        />
        <Metric
          label="New Wholesale Leads"
          value={enquiryTotal[0]?.value ?? 0}
        />
      </div>

      {/* Interactive Orders Table with Beverly Table Properties & Export */}
      <section className="mt-12">
        <AdminOrdersTable orders={recentOrders} />
      </section>
    </main>
  );
}

function readRole(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || !("role" in metadata))
    return null;
  const role = (metadata as { role?: unknown }).role;
  return typeof role === "string" ? role : null;
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card p-6">
      <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
        {label}
      </p>
      <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-display-sm)] font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function AdminBlocked({
  message = "Enable two-factor authentication before continuing.",
}: {
  message?: string;
}) {
  return (
    <main className="container-page pt-32 pb-20">
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
        Admin access blocked.
      </h1>
      <p className="mt-4 text-[var(--text-secondary)]">{message}</p>
    </main>
  );
}
