import * as React from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useField } from "@/components/ui/field";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className,
      id: explicitId,
      hasError: propHasError,
      "aria-describedby": explicitDescribedBy,
      "aria-invalid": explicitInvalid,
      children,
      ...props
    },
    ref
  ) {
    const field = useField();
    const id = explicitId ?? field?.id;
    const hasError = propHasError ?? field?.hasError ?? false;

    const describedBy =
      explicitDescribedBy ??
      ([field?.descriptionId, field?.errorId].filter(Boolean).join(" ") ||
        undefined);

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          id={id}
          aria-invalid={explicitInvalid ?? (hasError || undefined)}
          aria-describedby={describedBy}
          aria-required={field?.required || props.required || undefined}
          className={cn(
            "h-12 w-full appearance-none rounded-[var(--radius-sm)] border pl-3 pr-10 text-[length:var(--text-body)]",
            "bg-[var(--surface-raised)] text-[var(--text-primary)]",
            "transition-colors duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError
              ? "border-[var(--state-error)] focus-visible:outline-[var(--state-error)]"
              : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
          <CaretDown size={16} aria-hidden />
        </span>
      </div>
    );
  }
);
