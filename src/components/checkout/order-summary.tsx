"use client";

import * as React from "react";
import { CaretDown } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCart } from "@/components/cart/cart-provider";
import { formatMoney, cn } from "@/lib/utils";

/**
 * Order summary.
 *
 * Above md it is a sticky panel beside the form. Below md it
 * collapses into an expandable bar pinned to the top, so the total
 * is always visible without the line items pushing the first input
 * off screen.
 */
export function OrderSummary() {
  const { cart } = useCart();
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();

  if (!cart || cart.lines.length === 0) return null;

  return (
    <>
      {/* Mobile: collapsible bar */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
        >
          <span className="flex items-center gap-2 text-[length:var(--text-body-sm)] text-[var(--text-primary)]">
            {open ? "Hide" : "Show"} order summary
            <CaretDown
              size={14}
              aria-hidden
              className={cn(
                "transition-transform duration-[220ms]",
                open && "rotate-180"
              )}
            />
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-body)] font-semibold tabular-nums text-[var(--text-primary)]">
            {formatMoney(cart.subtotal, cart.currency)}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="pt-4">
                <SummaryBody />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Desktop: sticky panel */}
      <aside
        aria-label="Order summary"
        className="hidden md:block md:sticky md:top-24"
      >
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
            Order summary
          </h2>
          <div className="mt-5">
            <SummaryBody />
          </div>
        </div>
      </aside>
    </>
  );
}

function SummaryBody() {
  const { cart } = useCart();
  if (!cart) return null;

  return (
    <div>
      <ul className="grid gap-4">
        {cart.lines.map((line) => (
          <li key={line.variantId} className="flex items-start gap-3">
            <span
              aria-hidden
              className="product-image-cutout grid size-12 shrink-0 place-items-center rounded-[var(--radius-sm)] font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] tabular-nums text-[var(--text-primary)]"
            >
              {line.quantity}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-primary)]">
                {line.name}
              </p>
              <p className="mt-1 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                {line.variantName}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                {line.sku}
              </p>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] tabular-nums text-[var(--text-primary)]">
              {formatMoney(line.lineTotal, cart.currency)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid gap-2 border-t border-[var(--border-subtle)] pt-4">
        <Row label="Subtotal" value={formatMoney(cart.subtotal, cart.currency)} />
        <Row label="Delivery" value="Calculated at payment" muted />
        <Row label="VAT" value="Calculated at payment" muted />
      </dl>

      {/*
        The total is deliberately NOT asserted here. Delivery and
        VAT are computed server-side at order creation, and both
        determinations are still provisional (Q3, Q5). Showing a
        confident total the server might not agree with is worse
        than showing the subtotal and saying so.
      */}
      <p className="mt-4 text-[length:var(--text-caption)] leading-relaxed text-[var(--text-secondary)]">
        Delivery and VAT are confirmed on the payment screen before you are
        charged.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
        {label}
      </dt>
      <dd
        className={cn(
          "font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] tabular-nums",
          muted ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
