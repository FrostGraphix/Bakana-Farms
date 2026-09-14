"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash, Warning, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { formatMoney } from "@/lib/utils";

export function CartPage() {
  const {
    cart,
    error,
    dismissError,
    isPending,
    removeItem,
    updateItem,
  } = useCart();

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="container-page pt-28 sm:pt-32 pb-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cart" },
          ]}
        />
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty."
            description="Explore our single-origin Moringa, wildflower honey, and ginger tea blend to begin your daily ritual."
            action={{
              label: "Browse collection",
              href: "/products",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container-page pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart" },
        ]}
      />

      <div className="mt-6 max-w-[52ch]">
        <p className="eyebrow">Order review</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
          Your cart
        </h1>
        <p className="mt-2 text-[length:var(--text-body)] text-[var(--text-secondary)]">
          Review every pack carefully before continuing to checkout.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-8 flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--state-error-bg)] p-4 text-[var(--state-error)]"
        >
          <Warning size={20} weight="fill" aria-hidden />
          <p className="flex-1">{error}</p>
          <button type="button" onClick={dismissError} className="underline">
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
        <ul className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {cart.lines.map((line) => (
            <li key={line.variantId} className="grid gap-5 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-1.5">
                <Image
                  src="/images/bakana-hero-product-8k.webp"
                  alt={line.name}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                  {line.name}
                </h2>
                <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                  {line.variantName} · {line.sku}
                </p>
                <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] tabular-nums text-[var(--text-primary)]">
                  {formatMoney(line.unitPrice, cart.currency)} each
                </p>
              </div>

              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <div className="inline-flex items-center rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => updateItem(line.variantId, line.quantity - 1)}
                    disabled={isPending}
                    aria-label={`Reduce ${line.name} quantity`}
                    className="grid size-11 place-items-center rounded-l-[var(--radius-md)] hover:bg-[var(--surface-subtle)] disabled:opacity-50"
                  >
                    <Minus size={16} aria-hidden />
                  </button>
                  <span className="min-w-11 text-center font-[family-name:var(--font-mono)] tabular-nums" aria-live="polite">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateItem(line.variantId, line.quantity + 1)}
                    disabled={isPending || line.quantity >= 10}
                    aria-label={`Increase ${line.name} quantity`}
                    className="grid size-11 place-items-center rounded-r-[var(--radius-md)] hover:bg-[var(--surface-subtle)] disabled:opacity-50"
                  >
                    <Plus size={16} aria-hidden />
                  </button>
                </div>
                <p className="min-w-28 text-right font-[family-name:var(--font-mono)] tabular-nums text-[var(--text-primary)]">
                  {formatMoney(line.lineTotal, cart.currency)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(line.variantId)}
                  disabled={isPending}
                  aria-label={`Remove ${line.name}`}
                  className="grid size-11 place-items-center rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--state-error)] disabled:opacity-50"
                >
                  <Trash size={18} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[var(--elevation-raised)] lg:sticky lg:top-24">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
            Cart summary
          </h2>
          <div className="mt-6 flex justify-between border-b border-[var(--border-subtle)] pb-5">
            <span className="text-[var(--text-secondary)]">Subtotal</span>
            <span className="font-[family-name:var(--font-mono)] font-semibold tabular-nums">
              {formatMoney(cart.subtotal, cart.currency)}
            </span>
          </div>
          <p className="mt-4 text-[length:var(--text-caption)] leading-relaxed text-[var(--text-secondary)]">
            Delivery and tax remain provisional.
          </p>
          <Button size="lg" full className="mt-6" asChild>
            <Link href="/checkout">Continue to checkout</Link>
          </Button>
          <Button variant="ghost" full className="mt-2" asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
