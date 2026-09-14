import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "glass-card flex flex-col items-center justify-center p-8 text-center sm:p-12",
        className
      )}
    >
      {Icon && (
        <div
          className="mb-4 grid size-12 place-items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]"
          aria-hidden="true"
        >
          <Icon size={24} aria-hidden />
        </div>
      )}
      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-2 max-w-[42ch] text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}
