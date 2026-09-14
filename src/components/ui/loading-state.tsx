import * as React from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  size = "md",
  className,
}: LoadingStateProps) {
  const iconSizes = {
    sm: 18,
    md: 28,
    lg: 40,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className
      )}
    >
      <CircleNotch
        size={iconSizes[size]}
        weight="bold"
        className="animate-spin text-[var(--accent-line)]"
        aria-hidden="true"
      />
      {message && (
        <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
          {message}
        </p>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );
}
