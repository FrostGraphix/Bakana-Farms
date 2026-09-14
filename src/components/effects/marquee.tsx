"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Infinite marquee.
 *
 * Exactly one of these on the page. Two or more reads as filler.
 * This one carries the provenance line, which is breadth-heavy
 * content that does not need individual attention, which is the
 * only thing a marquee is genuinely good at.
 *
 * Under reduced motion it becomes a static, horizontally
 * scrollable strip rather than disappearing.
 */
export function Marquee({
  items,
  speed = 38,
  className,
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={cn("scroll-x flex gap-10 py-5", className)}>
        {items.map((item) => (
          <MarqueeItem key={item} label={item} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden py-5", className)}
      // Fade the edges so items enter and leave rather than being
      // sliced off at the viewport boundary.
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {/* Duplicated once so the -50% loop point is seamless. */}
        {[...items, ...items].map((item, i) => (
          <MarqueeItem key={`${item}-${i}`} label={item} />
        ))}
      </motion.div>
    </div>
  );
}

function MarqueeItem({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-10">
      <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
        {label}
      </span>
      <span
        aria-hidden
        className="size-1 shrink-0 rounded-full bg-[var(--accent-line)]"
      />
    </span>
  );
}
