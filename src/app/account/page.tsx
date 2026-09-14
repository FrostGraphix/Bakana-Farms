import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, or } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import {
  authenticatedUser,
  isClerkConfigured,
  primaryEmail,
} from "@/server/auth/clerk";
import { getCustomerSession } from "@/server/auth/customer";
import { getDb, hasDatabase, schema } from "@/server/db";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const clerkEnabled = isClerkConfigured();
  let email: string | null = null;
  let displayName: string | null = null;
  let customerId: string | null = null;

  if (clerkEnabled) {
    const user = await authenticatedUser();
    if (user) {
      email = primaryEmail(user);
      displayName = user.firstName ?? null;
      if (email && hasDatabase()) {
        const db = getDb();
        const [customer] = await db
          .insert(schema.customers)
          .values({
            clerkUserId: user.id,
            email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerifiedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: schema.customers.email,
            set: {
              clerkUserId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              emailVerifiedAt: new Date(),
              updatedAt: new Date(),
            },
          })
          .returning({ id: schema.customers.id });
        customerId = customer?.id ?? null;
      }
    }
  }

  // Fallback to native customer session
  if (!email) {
    const session = await getCustomerSession();
    if (session) {
      email = session.email;
      customerId = session.customerId;
      if (hasDatabase()) {
        const db = getDb();
        const customer = await db.query.customers.findFirst({
          where: eq(schema.customers.id, session.customerId),
        });
        if (customer?.firstName) {
          displayName = customer.firstName;
        }
      }
    }
  }

  if (!email) {
    redirect("/sign-in?redirect_url=/account");
  }

  if (!hasDatabase()) {
    return <Unavailable reason="Order history is temporarily unavailable." />;
  }

  const db = getDb();
  const orderWhere = customerId
    ? or(
        eq(schema.orders.customerId, customerId),
        eq(schema.orders.email, email)
      )
    : eq(schema.orders.email, email);

  const orders = await db.query.orders.findMany({
    where: orderWhere,
    orderBy: [desc(schema.orders.createdAt)],
    limit: 50,
  });

  return (
    <main className="container-page pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account" },
        ]}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
            Welcome back{displayName ? `, ${displayName}` : ""}.
          </h1>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
            {email}
          </p>
        </div>
        <div>
          <SignOutButton />
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold">
          Order history
        </h2>
        {orders.length ? (
          <ul className="mt-5 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {orders.map((order) => (
              <li
                key={order.id}
                className="grid gap-3 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div>
                  <p className="font-[family-name:var(--font-mono)] font-semibold">
                    {order.reference}
                  </p>
                  <p className="mt-1 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                    {order.createdAt.toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="capitalize text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                  {order.status.replaceAll("_", " ")}
                </p>
                <p className="font-[family-name:var(--font-mono)] font-semibold">
                  {formatMoney(order.total, order.currency)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-subtle)] p-8 text-center sm:text-left">
            <p className="text-[var(--text-secondary)]">
              No orders are linked to this account yet.
            </p>
            <Button asChild className="mt-5">
              <Link href="/products">Shop Bakana</Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

function Unavailable({ reason }: { reason: string }) {
  return (
    <main className="container-page py-20">
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold">
        Account unavailable.
      </h1>
      <p className="mt-4 text-[var(--text-secondary)]">{reason}</p>
    </main>
  );
}
