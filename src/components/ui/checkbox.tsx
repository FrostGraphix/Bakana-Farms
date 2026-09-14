import * as React from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { className, id: explicitId, checked, defaultChecked, hasError, disabled, onChange, ...props },
    ref
  ) {
    const generatedId = React.useId();
    const id = explicitId ?? generatedId;
    const [isChecked, setIsChecked] = React.useState(Boolean(checked ?? defaultChecked));

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(Boolean(checked));
      }
    }, [checked]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    }

    return (
      <div className="relative inline-flex items-center justify-center size-6 shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <div
          aria-hidden="true"
          className={cn(
            "grid size-5 place-items-center rounded-[var(--radius-sm)] border transition-all duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--border-focus)]",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            isChecked
              ? "border-[var(--action-primary-bg)] bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
              : "border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:border-[var(--border-strong)]",
            hasError && "border-[var(--state-error)]"
          )}
        >
          {isChecked ? <Check size={14} weight="bold" /> : null}
        </div>
      </div>
    );
  }
);
