import * as React from "react";
import { cn } from "@/lib/utils";
import { useField } from "@/components/ui/field";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      id: explicitId,
      hasError: propHasError,
      "aria-describedby": explicitDescribedBy,
      "aria-invalid": explicitInvalid,
      rows = 4,
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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={explicitInvalid ?? (hasError || undefined)}
        aria-describedby={describedBy}
        aria-required={field?.required || props.required || undefined}
        className={cn(
          "w-full min-w-0 max-w-full rounded-[var(--radius-sm)] border p-3 text-[length:var(--text-body)] leading-relaxed",
          "bg-[var(--surface-raised)] text-[var(--text-primary)]",
          "placeholder:text-[var(--text-secondary)]",
          "transition-colors duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError
            ? "border-[var(--state-error)] focus-visible:outline-[var(--state-error)]"
            : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]",
          className
        )}
        {...props}
      />
    );
  }
);
