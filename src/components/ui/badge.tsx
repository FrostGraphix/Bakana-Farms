import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold tracking-wide uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
        gold:
          "bg-[color-mix(in_srgb,var(--accent-line)_15%,transparent)] text-[var(--accent-text)] border border-[color-mix(in_srgb,var(--accent-line)_40%,transparent)]",
        forest:
          "bg-[var(--surface-inverse)] text-[var(--text-inverse)]",
        ginger:
          "bg-[var(--accent-warm)] text-[var(--accent-warm-text)]",
        success:
          "bg-[var(--state-success-bg)] text-[var(--state-success)]",
        warning:
          "bg-[var(--state-warning-bg)] text-[var(--state-warning)]",
        error:
          "bg-[var(--state-error-bg)] text-[var(--state-error)]",
        info:
          "bg-[var(--state-info-bg)] text-[var(--state-info)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
