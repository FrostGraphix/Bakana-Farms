import type { Variants, Transition } from "motion/react";

/**
 * Motion tokens.
 *
 * Every value here mirrors a CSS custom property in globals.css so
 * that JS-driven and CSS-driven motion share one rhythm.
 *
 * Two hard rules, both of which protect the INP <= 200ms target:
 *   1. Animate transform and opacity only. Animating width, height,
 *      top or margin forces layout on every frame.
 *   2. Every animation must be justifiable in one sentence. If it
 *      does not communicate hierarchy, sequence, feedback or a state
 *      change, it does not ship.
 */

export const DURATION = {
  fast: 0.12,
  base: 0.22,
  slow: 0.4,
  deliberate: 0.6,
} as const;

export const EASE = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
  /** The house curve. Fast out of the gate, long settle. */
  brand: [0.16, 1, 0.3, 1],
} as const;

export const SPRING: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.8,
};

/** Exit is quicker than enter so dismissal feels responsive. */
export const EXIT_RATIO = 0.65;

/* ---------------------------------------------------------------
   Reusable variants
   --------------------------------------------------------------- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.deliberate, ease: EASE.brand },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE.standard },
  },
};

/**
 * Staggered container. Children inherit `hidden`/`visible`.
 * Parent and children must live in the same client component tree
 * or the stagger silently does nothing.
 */
export function staggerContainer(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Curtain reveal for display type. Requires an overflow-hidden parent. */
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE.brand },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE.brand },
  },
};

/** Drawer and sheet. Direction is set by the caller. */
export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: SPRING },
  exit: {
    x: "100%",
    transition: { duration: DURATION.base, ease: EASE.accelerate },
  },
};

export const slideUpSheet: Variants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: SPRING },
  exit: {
    y: "100%",
    transition: { duration: DURATION.base, ease: EASE.accelerate },
  },
};

export const scrimFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

/** Standard viewport trigger. `once` so content does not re-animate on scroll-back. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
