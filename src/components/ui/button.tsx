import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Every variant is checked against its own surface for WCAG AA.
 * On light, gold is a line and icon colour only: gold on ivory is
 * 2.13:1. On dark, gold becomes the primary action fill because
 * forest-on-gold inverts to a passing pair.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium tracking-tight",
    "transition-[background-color,color,border-color,transform,opacity]",
    "duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-[var(--border-focus)]",
    "disabled:pointer-events-none disabled:opacity-50",
    // Tactile press. Transform only, so no layout work on the
    // interaction path.
    "active:translate-y-px",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] hover:bg-[var(--action-primary-bg-hover)]",
        secondary:
          "border border-[var(--action-secondary-border)] text-[var(--action-secondary-text)] bg-transparent hover:bg-[var(--surface-subtle)]",
        ghost:
          "text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]",
        ginger:
          "bg-[var(--accent-warm)] text-[var(--accent-warm-text)] hover:bg-[var(--accent-warm-hover)]",
        link: "text-[var(--text-accent)] underline underline-offset-4 decoration-[var(--accent-line)] hover:decoration-2",
      },
      size: {
        // 44px is the comfort target. WCAG 2.2 SC 2.5.8 AA floor is
        // 24px, but 44px is what a thumb actually wants.
        sm: "h-9 px-4 text-[var(--text-body-sm)] rounded-[var(--radius-sm)]",
        md: "h-12 px-6 text-[var(--text-body)] rounded-[var(--radius-md)]",
        lg: "h-14 px-8 text-[var(--text-body-lg)] rounded-[var(--radius-md)]",
        icon: "size-11 rounded-[var(--radius-md)]",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  /** Announced to screen readers while `loading` is true. */
  loadingLabel?: string;
  /**
   * Render the child element instead of a `<button>`, merging the
   * button styling onto it. Use for links that should look like
   * buttons, so a navigation stays a real anchor and keeps
   * middle-click, open-in-new-tab and crawlability.
   */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      full,
      loading = false,
      loadingLabel = "Working",
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) {
    const classes = cn(buttonVariants({ variant, size, full }), className);

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Spinner />
            <span>{loadingLabel}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
    />
  );
}

export { buttonVariants };
