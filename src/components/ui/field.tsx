import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldContextValue {
  id: string;
  errorId?: string;
  descriptionId?: string;
  error?: string | null;
  hasError: boolean;
  required?: boolean;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useField() {
  return React.useContext(FieldContext);
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string | null;
  description?: string;
  required?: boolean;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field({ className, error, description, required, children, id: explicitId, ...props }, ref) {
    const generatedId = React.useId();
    const id = explicitId ?? generatedId;
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-desc` : undefined;

    return (
      <FieldContext.Provider
        value={{
          id,
          errorId,
          descriptionId,
          error,
          hasError: Boolean(error),
          required,
        }}
      >
        <div ref={ref} className={cn("grid gap-1.5 min-w-0 max-w-full w-full", className)} {...props}>
          {children}
        </div>
      </FieldContext.Provider>
    );
  }
);

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  optionalText?: string;
}

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ className, children, optionalText = "(optional)", htmlFor: explicitHtmlFor, ...props }, ref) {
    const context = useField();
    const htmlFor = explicitHtmlFor ?? context?.id;

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "text-[length:var(--text-body-sm)] font-medium text-[var(--text-primary)]",
          className
        )}
        {...props}
      >
        {children}
        {context && !context.required ? (
          <span className="ml-1.5 font-normal text-[var(--text-secondary)]">
            {optionalText}
          </span>
        ) : null}
      </label>
    );
  }
);

export interface FieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, id: explicitId, children, ...props }, ref) {
    const context = useField();
    const id = explicitId ?? context?.descriptionId;

    if (!children) return null;

    return (
      <p
        ref={ref}
        id={id}
        className={cn("text-[length:var(--text-caption)] text-[var(--text-secondary)]", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string | null;
}

export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  function FieldError({ className, id: explicitId, error: propError, children, ...props }, ref) {
    const context = useField();
    const id = explicitId ?? context?.errorId;
    const message = propError ?? children ?? context?.error;

    if (!message) return null;

    return (
      <p
        ref={ref}
        id={id}
        role="alert"
        className={cn("text-[length:var(--text-body-sm)] text-[var(--state-error)]", className)}
        {...props}
      >
        {message}
      </p>
    );
  }
);
