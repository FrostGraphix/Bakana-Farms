"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Gold shimmer sweep.
 *
 * Used on ONE word, once per page. A sweep across every headline
 * is the fastest way to make a premium brand look like a crypto
 * landing page.
 *
 * The sweep is a background-position animation on a clipped
 * gradient, which the compositor handles without layout work.
 * Under reduced motion it settles to solid gold and stops.
 */
export function ShimmerText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={cn("text-[var(--accent-text)]", className)}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn("bakana-shimmer bg-clip-text text-transparent", className)}
    >
      {children}
    </span>
  );
}
