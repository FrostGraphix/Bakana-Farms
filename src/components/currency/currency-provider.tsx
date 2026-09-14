"use client";

import * as React from "react";
import { type Currency, formatMoney } from "@/lib/utils";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (minorUnits: number) => string;
}

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null);

function readCurrencyCookie(): Currency {
  if (typeof document === "undefined") return "NGN";
  const m = document.cookie.match(/(?:^|;\s*)bakana_currency=(NGN|USD)/);
  if (m?.[1]) return m[1] as Currency;

  try {
    const saved = localStorage.getItem("bakana_currency");
    if (saved === "NGN" || saved === "USD") {
      return saved as Currency;
    }
  } catch {
    // Ignore localStorage restriction
  }

  return "NGN";
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<Currency>("NGN");

  React.useEffect(() => {
    setCurrencyState(readCurrencyCookie());
  }, []);

  const setCurrency = React.useCallback((next: Currency) => {
    setCurrencyState(next);
    if (typeof document !== "undefined") {
      document.cookie = `bakana_currency=${next};path=/;max-age=31536000;samesite=lax`;
      try {
        localStorage.setItem("bakana_currency", next);
      } catch {
        // Ignore localStorage error
      }
      window.dispatchEvent(new CustomEvent("bakana-currency-change", { detail: next }));
    }
  }, []);

  const format = React.useCallback(
    (minorUnits: number) => formatMoney(minorUnits, currency),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) {
    return {
      currency: "NGN",
      setCurrency: () => {},
      format: (units: number) => formatMoney(units, "NGN"),
    };
  }
  return ctx;
}
