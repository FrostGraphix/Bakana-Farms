"use client";

import * as React from "react";
import { CheckCircle, MagnifyingGlass, Package, Clock, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatMoney, type Currency } from "@/lib/utils";

type OrderResult = {
  reference: string;
  status: string;
  currency: Currency;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  placedAt: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    lineTotal: number;
  }>;
  events: Array<{ status: string | null; occurredAt: string }>;
};

export function OrderTracker({ initialReference = "" }: { initialReference?: string }) {
  const [reference, setReference] = React.useState(initialReference);
  const [email, setEmail] = React.useState("");
  const [order, setOrder] = React.useState<OrderResult | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const response = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Order lookup failed.");
        return;
      }
      setOrder(body.order);
    } catch {
      setError("Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] w-full min-w-0 max-w-full items-start">
      <form
        onSubmit={submit}
        noValidate
        className="glass-card h-fit w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 sm:p-8 shadow-[var(--elevation-raised)] space-y-5"
      >
        <div className="border-b border-[var(--border-subtle)] pb-4">
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold uppercase tracking-wider text-[var(--accent-text)]">
            Trace Delivery
          </span>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
            Find your order
          </h2>
          <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
            Enter your order reference code and checkout email.
          </p>
        </div>

        <Field id="tracker-reference" error={error ? "" : null} required className="w-full min-w-0 max-w-full">
          <FieldLabel>Order reference</FieldLabel>
          <Input
            name="reference"
            placeholder="e.g. BF-12345"
            value={reference}
            onChange={(event) => setReference(event.target.value.toUpperCase())}
            autoComplete="off"
            required
            className="w-full min-w-0 max-w-full font-[family-name:var(--font-mono)]"
          />
        </Field>

        <Field id="tracker-email" error={error ? "" : null} required className="w-full min-w-0 max-w-full">
          <FieldLabel>Checkout email</FieldLabel>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full min-w-0 max-w-full"
          />
        </Field>

        {error ? (
          <p
            role="alert"
            className="rounded-[var(--radius-md)] bg-[var(--state-error-bg)] p-3 text-[length:var(--text-body-sm)] text-[var(--state-error)]"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          full
          size="lg"
          className="mt-2 w-full"
          loading={loading}
          loadingLabel="Locating order"
        >
          <MagnifyingGlass size={18} aria-hidden />
          <span>Find my order</span>
        </Button>

        <div className="flex items-center gap-2 pt-2 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
          <ShieldCheck size={16} className="text-[var(--accent-text)] shrink-0" aria-hidden />
          <span>Encrypted order lookup · Protected under NDPA 2023</span>
        </div>
      </form>

      <div aria-live="polite" className="w-full min-w-0 max-w-full">
        {order ? <OrderDetails order={order} /> : <EmptyState />}
      </div>
    </div>
  );
}

function OrderDetails({ order }: { order: OrderResult }) {
  return (
    <section className="glass-card w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 sm:p-8 shadow-[var(--elevation-raised)]">
      <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-5">
        <div className="flex items-start gap-3.5">
          <CheckCircle size={32} weight="fill" className="shrink-0 text-[var(--state-success)]" aria-hidden />
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
              {order.reference}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
              {statusLabel(order.status)}
            </h2>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold text-[var(--accent-text)]">
          <Clock size={14} aria-hidden />
          <span>{formatDate(order.placedAt ?? order.createdAt)}</span>
        </span>
      </div>

      <div className="mt-6">
        <h3 className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Delivery Timeline
        </h3>
        <ol className="mt-4 grid gap-3 border-l-2 border-[var(--accent-line)] pl-5">
          {order.events.length ? (
            order.events.map((event, index) => (
              <li key={`${event.status}-${event.occurredAt}-${index}`}>
                <p className="font-semibold text-[var(--text-primary)]">{statusLabel(event.status ?? "updated")}</p>
                <time className="text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                  {formatDate(event.occurredAt)}
                </time>
              </li>
            ))
          ) : (
            <li>
              <p className="font-semibold text-[var(--text-primary)]">{statusLabel(order.status)}</p>
              <time className="text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                {formatDate(order.placedAt ?? order.createdAt)}
              </time>
            </li>
          )}
        </ol>
      </div>

      <h3 className="mt-8 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
        Order summary
      </h3>
      <ul className="mt-3 divide-y divide-[var(--border-subtle)]">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-[length:var(--text-body-sm)]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="font-[family-name:var(--font-mono)] font-semibold text-[var(--text-secondary)]">
                {item.quantity}×
              </span>
              <div className="min-w-0">
                <p className="font-medium text-[var(--text-primary)] truncate">{item.name}</p>
                <p className="text-[length:var(--text-caption)] text-[var(--text-secondary)] truncate">
                  {item.variantName}
                </p>
              </div>
            </div>
            <span className="font-[family-name:var(--font-mono)] font-semibold text-[var(--text-primary)] shrink-0">
              {formatMoney(item.lineTotal, order.currency)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex justify-between border-t border-[var(--border-subtle)] pt-4 font-semibold text-[length:var(--text-body)]">
        <span>Total charged</span>
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-h3)] text-[var(--accent-text)]">
          {formatMoney(order.total, order.currency)}
        </span>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="glass-card rounded-[var(--radius-lg)] border border-dashed border-[var(--border-subtle)] p-10 text-center bg-[var(--surface-subtle)]">
      <Package size={40} className="mx-auto text-[var(--accent-text)]" aria-hidden />
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
        Your order dispatch tracking appears here
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
        Enter the order reference from your confirmation email alongside your checkout email address.
      </p>
    </div>
  );
}

function statusLabel(status: string): string {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
