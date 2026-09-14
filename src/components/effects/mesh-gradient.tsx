"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Organic mesh gradient.
 *
 * Brand hues only: forest, gold and ginger. This is deliberately
 * not the default AI mesh, which is violet and blue and reads as
 * generated on sight. The blobs drift slowly enough to register as
 * light moving rather than as an animation playing.
 *
 * Transform and opacity only, so it never triggers layout.
 */
export function MeshGradient({
  className,
  intensity = "subtle",
}: {
  className?: string;
  intensity?: "subtle" | "rich";
}) {
  const reduce = useReducedMotion();
  const alpha = intensity === "rich" ? 0.5 : 0.3;

  const blobs = [
    {
      color: `rgb(201 162 75 / ${alpha})`,
      className: "left-[-10%] top-[-15%] size-[55vw]",
      drift: { x: [0, 40, 0], y: [0, -30, 0] },
      duration: 22,
    },
    {
      color: `rgb(27 46 34 / ${alpha * 0.9})`,
      className: "right-[-15%] top-[10%] size-[50vw]",
      drift: { x: [0, -50, 0], y: [0, 40, 0] },
      duration: 28,
    },
    {
      color: `rgb(184 92 46 / ${alpha * 0.55})`,
      className: "bottom-[-20%] left-[25%] size-[45vw]",
      drift: { x: [0, 30, 0], y: [0, -25, 0] },
      duration: 34,
    },
  ];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={cn("absolute rounded-full blur-[80px]", blob.className)}
          style={{ background: blob.color }}
          animate={reduce ? undefined : blob.drift}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
