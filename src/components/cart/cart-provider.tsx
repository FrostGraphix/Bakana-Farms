"use client";

import * as React from "react";

export type CartLine = {
  variantId: string;
  quantity: number;
  sku: string;
  name: string;
  variantName: string;
  unitPrice: number;
  lineTotal: number;
};

export type CartState = {
  id: string;
  currency: "NGN" | "USD";
  lines: CartLine[];
  subtotal: number;
  itemCount: number;
} | null;

type CartContextValue = {
  cart: CartState;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  addItem: (variantId: string, quantity: number) => Promise<boolean>;
  removeItem: (variantId: string) => Promise<void>;
  updateItem: (variantId: string, quantity: number) => Promise<boolean>;
  dismissError: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartState>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Hydrate once on mount. Failure here is silent by design: an
  // unavailable cart must not block browsing the catalogue.
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/cart/items")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.cart) setCart(data.cart);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = React.useCallback(
    async (variantId: string, quantity: number) => {
      setIsPending(true);
      setError(null);
      try {
        const res = await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        });
        const data = await res.json();

        if (!res.ok) {
          // The server's message is written for shoppers and says
          // exactly how much is left, so it is shown verbatim
          // rather than replaced with something generic.
          setError(data?.error ?? "We could not add that just now.");
          return false;
        }

        setCart(data.cart);
        setIsOpen(true);
        return true;
      } catch {
        setError("Check your connection and try again.");
        return false;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  const removeItem = React.useCallback(async (variantId: string) => {
    setIsPending(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } finally {
      setIsPending(false);
    }
  }, []);

  const updateItem = React.useCallback(
    async (variantId: string, quantity: number) => {
      setIsPending(true);
      setError(null);
      try {
        const res = await fetch("/api/cart/items", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "We could not update that just now.");
          return false;
        }
        setCart(data.cart);
        return true;
      } catch {
        setError("Check your connection and try again.");
        return false;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  const value = React.useMemo<CartContextValue>(
    () => ({
      cart,
      isOpen,
      isPending,
      error,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      removeItem,
      updateItem,
      dismissError: () => setError(null),
    }),
    [cart, isOpen, isPending, error, addItem, removeItem, updateItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
