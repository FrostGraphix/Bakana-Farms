"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer, lineReveal, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal primitives.
 *
 * These are the only sanctioned entrance animations. They exist to
 * communicate reading sequence, which is the one thing a long
 * narrative page genuinely needs motion for.
 *
 * Uses `whileInView` rather than a scroll listener. A
 * window scroll handler re-renders on every frame and is banned.
 */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  delay = 0,
}: RevealProps & { stagger?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </motion.div>
  );
}

/** Child of RevealGroup. Inherits the parent's hidden/visible states. */
export function RevealItem({
  children,
  className,
  as = "div",
}: Omit<RevealProps, "delay">) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}

/**
 * Line-by-line curtain reveal for display headlines.
 *
 * Justification: the homepage headline is the single moment where
 * the brand gets to feel crafted rather than assembled. One
 * signature move, on one element, once per page load.
 */
export function LineReveal({
  lines,
  className,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={className}>
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      {lines.map((line, i) => (
        // Descender clearance: leading-none clips g, y, p and j on
        // a serif display face, so the mask keeps real headroom.
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            transition={{ delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Hairline that draws itself. Used as a section marker. */
export function RuleAccent({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={cn("h-px w-12 origin-left bg-[var(--accent-line)]", className)}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
