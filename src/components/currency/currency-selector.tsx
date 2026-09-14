"use client";

import * as React from "react";
import { useCurrency } from "./currency-provider";
import { type Currency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "NGN", symbol: "₦", label: "NGN" },
  { code: "USD", symbol: "$", label: "USD" },
];

export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <fieldset
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[var(--radius-full)] border border-[var(--border-subtle)] p-0.5",
        className
      )}
    >
      <legend className="sr-only">Currency</legend>
      {CURRENCIES.map(({ code, symbol, label }) => {
        const active = currency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            aria-pressed={active}
            title={`${label} (${symbol})`}
            className={cn(
              "flex h-9 items-center gap-1 rounded-[var(--radius-full)] px-2.5 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-medium transition-colors duration-[120ms] cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
              active
                ? "bg-[var(--surface-inverse)] text-[var(--text-inverse)] shadow-xs"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
            )}
          >
            <span className="font-semibold">{symbol}</span>
            <span>{code}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
