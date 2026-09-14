import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "default" | "accent";
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  badge,
  badgeVariant = "default",
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  const badgeStyles =
    badgeVariant === "accent"
      ? "border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] text-[var(--accent-text)]"
      : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCenter && "items-center text-center",
        className
      )}
    >
      {badge && (
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em]",
            badgeStyles,
            isCenter && "mx-auto"
          )}
        >
          {badge}
        </span>
      )}
      {typeof title === "string" ? (
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-[1.08] text-[var(--text-primary)]">
          {title}
        </h2>
      ) : (
        title
      )}
      {description && (
        <div
          className={cn(
            "text-[length:var(--text-body)] leading-relaxed text-[var(--text-secondary)]",
            isCenter && "max-w-[56ch]"
          )}
        >
          {description}
        </div>
      )}
    </div>
  );
}
