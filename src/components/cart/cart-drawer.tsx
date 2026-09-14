"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Trash, Warning, ShoppingBag, Minus, Plus } from "@phosphor-icons/react";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { formatMoney, cn } from "@/lib/utils";
import { slideInRight, slideUpSheet, scrimFade } from "@/lib/motion";

export function CartDrawer() {
  const { cart, isOpen, close, error, dismissError } = useCart();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lock the page, close on Escape, trap focus, and restore focus
  // to whatever opened the drawer.
  React.useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const selector =
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
    panelRef.current?.querySelector<HTMLElement>(selector)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(selector)
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [isOpen, close]);

  const variants = isMobile ? slideUpSheet : slideInRight;

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="scrim"
            variants={scrimFade}
            initial={reduce ? false : "hidden"}
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-30 bg-[var(--surface-scrim)] backdrop-blur-[2px]"
            aria-hidden
          />

          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            variants={variants}
            initial={reduce ? false : "hidden"}
            animate="visible"
            exit="exit"
            className={cn(
              "fixed z-40 flex flex-col bg-[var(--surface-page)]",
              "shadow-[var(--elevation-modal)]",
              // Full-screen sheet on mobile, right panel above md.
              "inset-x-0 bottom-0 top-16 rounded-t-[var(--radius-lg)]",
              "md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[26rem] md:rounded-none"
            )}
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <header className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                Your cart
                {cart && cart.itemCount > 0 ? (
                  <span className="ml-2 font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] tabular-nums text-[var(--text-secondary)]">
                    {cart.itemCount}
                  </span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="grid size-11 place-items-center rounded-[var(--radius-md)] text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-subtle)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
              >
                <X size={20} aria-hidden />
              </button>
            </header>

            {error ? (
              <div
                role="alert"
                className="flex items-start gap-3 border-b border-[var(--border-subtle)] bg-[var(--state-error-bg)] px-5 py-3"
              >
                <Warning
                  size={18}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--state-error)]"
                  aria-hidden
                />
                <p className="flex-1 text-[length:var(--text-body-sm)] text-[var(--state-error)]">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={dismissError}
                  className="text-[length:var(--text-caption)] text-[var(--state-error)] underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            ) : null}

            {!cart || cart.lines.length === 0 ? (
              <EmptyCart onClose={close} />
            ) : (
              <>
                <CartLines />
                <CartSummary />
              </>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function CartLines() {
  const { cart, removeItem, updateItem, isPending } = useCart();
  if (!cart) return null;

  return (
    <ul className="flex-1 divide-y divide-[var(--border-subtle)] overflow-y-auto px-5">
      {cart.lines.map((line) => (
        <li key={line.variantId} className="flex gap-4 py-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-1">
            <Image
              src="/images/bakana-hero-product-8k.webp"
              alt={line.name}
              fill
              sizes="64px"
              className="object-contain p-0.5"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-primary)]">
              {line.name}
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
              {line.variantName} · {line.sku}
            </p>
            <div className="mt-3 inline-flex items-center rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => updateItem(line.variantId, line.quantity - 1)}
                disabled={isPending}
                aria-label={`Reduce ${line.name} quantity`}
                className="grid size-10 place-items-center rounded-l-[var(--radius-md)] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] disabled:opacity-50"
              >
                <Minus size={15} aria-hidden />
              </button>
              <span
                className="min-w-10 text-center font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] tabular-nums text-[var(--text-primary)]"
                aria-live="polite"
              >
                {line.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateItem(line.variantId, line.quantity + 1)}
                disabled={isPending || line.quantity >= 10}
                aria-label={`Increase ${line.name} quantity`}
                className="grid size-10 place-items-center rounded-r-[var(--radius-md)] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] disabled:opacity-50"
              >
                <Plus size={15} aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] tabular-nums text-[var(--text-primary)]">
              {formatMoney(line.lineTotal, cart.currency)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(line.variantId)}
              disabled={isPending}
              aria-label={`Remove ${line.name}`}
              className="grid size-11 place-items-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--state-error)] disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
            >
              <Trash size={16} aria-hidden />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CartSummary() {
  const { cart } = useCart();
  if (!cart) return null;

  return (
    <div className="border-t border-[var(--border-subtle)] px-5 py-5">
      <div className="flex items-baseline justify-between">
        <span className="text-[length:var(--text-body)] text-[var(--text-secondary)]">
          Subtotal
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-h2)] font-semibold tabular-nums text-[var(--text-primary)]">
          {formatMoney(cart.subtotal, cart.currency)}
        </span>
      </div>

      <p className="mt-1.5 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
        Delivery and tax need confirmation.
      </p>

      <Button size="lg" full className="mt-5" asChild>
        <Link href="/checkout">Checkout</Link>
      </Button>
      <Button variant="ghost" full className="mt-2" asChild>
        <Link href="/cart">Review full cart</Link>
      </Button>
    </div>
  );
}

/** Composed empty state with a way out, not a dead end. */
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <ShoppingBag
        size={40}
        weight="light"
        className="text-[var(--text-secondary)]"
        aria-hidden
      />
      <p className="mt-5 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
        Nothing in here yet.
      </p>
      <p className="mt-2 max-w-[32ch] text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
        The blend comes in three sizes. The 300g pouch lasts most people about a
        month.
      </p>
      <Button className="mt-7" onClick={onClose} asChild>
        <Link href="/products">Browse the range</Link>
      </Button>
    </div>
  );
}
