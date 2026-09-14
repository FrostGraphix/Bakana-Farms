"use client";

import * as React from "react";
import { Warning, Lock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

/**
 * Checkout form.
 *
 * Single column throughout. A checkout is a sequence, not a
 * layout: two columns of inputs on a phone is where abandonment
 * happens.
 *
 * Every field carries the correct `inputmode` and `autocomplete`.
 * It costs nothing and is the single largest mobile checkout
 * improvement available, because the OS then offers the right
 * keyboard and can autofill the whole address.
 *
 * No third-party script may ever run on this route. PCI DSS SAQ A
 * eligibility depends on the page framing the payment being clean.
 * The CSP in next.config.ts is the enforcement point.
 */

type FieldErrors = Record<string, string>;

const FIELDS = [
  {
    name: "recipient",
    label: "Full name",
    autoComplete: "name",
    inputMode: "text" as const,
    required: true,
  },
  {
    name: "phone",
    label: "Phone number",
    autoComplete: "tel",
    inputMode: "tel" as const,
    required: true,
    hint: "So the courier can reach you on delivery day.",
  },
  {
    name: "line1",
    label: "Street address",
    autoComplete: "address-line1",
    inputMode: "text" as const,
    required: true,
  },
  {
    name: "line2",
    label: "Apartment, suite, landmark",
    autoComplete: "address-line2",
    inputMode: "text" as const,
    required: false,
  },
  {
    name: "city",
    label: "City",
    autoComplete: "address-level2",
    inputMode: "text" as const,
    required: true,
  },
  {
    name: "state",
    label: "State",
    autoComplete: "address-level1",
    inputMode: "text" as const,
    required: true,
  },
] as const;

export function CheckoutForm() {
  const { cart } = useCart();
  const [pending, setPending] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  /**
   * One key per mount, so a retry after a network failure resolves
   * to the same order rather than creating a second one. Reset
   * only after a successful handoff.
   */
  const idempotencyKey = React.useRef<string>(crypto.randomUUID());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError(null);
    setFieldErrors({});

    const data = new FormData(event.currentTarget);
    const payload = {
      email: String(data.get("email") ?? ""),
      idempotencyKey: idempotencyKey.current,
      shippingAddress: {
        recipient: String(data.get("recipient") ?? ""),
        line1: String(data.get("line1") ?? ""),
        line2: String(data.get("line2") ?? "") || undefined,
        city: String(data.get("city") ?? ""),
        state: String(data.get("state") ?? ""),
        postalCode: String(data.get("postalCode") ?? "") || undefined,
        countryCode: "NG" as const,
        phone: String(data.get("phone") ?? ""),
      },
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (!res.ok) {
        setFormError(body?.error ?? "We could not start checkout.");
        if (body?.fieldErrors) {
          setFieldErrors(body.fieldErrors);
          // Focus the first invalid field rather than making the
          // user hunt for it.
          const first = Object.keys(body.fieldErrors)[0]?.split(".").pop();
          if (first) {
            formRef.current
              ?.querySelector<HTMLInputElement>(`[name="${first}"]`)
              ?.focus();
          }
        }
        return;
      }

      // Handoff to the gateway. Card fields are hosted there and
      // never rendered by us.
      window.location.href = body.authorizationUrl;
    } catch {
      setFormError("Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-8 w-full min-w-0 max-w-full overflow-hidden">
      {formError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--state-error-bg)] px-4 py-3"
        >
          <Warning
            size={18}
            weight="fill"
            className="mt-0.5 shrink-0 text-[var(--state-error)]"
            aria-hidden
          />
          <p className="text-[length:var(--text-body-sm)] text-[var(--state-error)]">
            {formError}
          </p>
        </div>
      ) : null}

      <fieldset className="grid gap-4">
        <legend className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
          Contact
        </legend>
        <Field
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          hint="Your order confirmation and tracking go here."
          error={fieldErrors["email"]}
        />
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
          Delivery address
        </legend>

        {FIELDS.map((field) => (
          <Field
            key={field.name}
            name={field.name}
            label={field.label}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
            required={field.required}
            hint={"hint" in field ? field.hint : undefined}
            error={fieldErrors[`shippingAddress.${field.name}`]}
          />
        ))}

        <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
          We deliver within Nigeria. For international or wholesale orders,
          use the wholesale enquiry form.
        </p>
      </fieldset>

      <div>
        <Button
          type="submit"
          size="lg"
          full
          loading={pending}
          loadingLabel="Starting secure checkout"
          disabled={isEmpty}
        >
          <Lock size={18} aria-hidden />
          Continue to payment
        </Button>

        <p className="mt-3 flex items-center justify-center gap-2 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
          Card details are entered on Paystack. They never reach our servers.
        </p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  required,
  hint,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  inputMode: "text" | "email" | "tel" | "numeric";
  required?: boolean;
  hint?: string;
  error?: string;
}) {
  const id = React.useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-1.5 w-full min-w-0 max-w-full">
      {/* Label above the input, always. Placeholder is not a label. */}
      <label
        htmlFor={id}
        className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-primary)]"
      >
        {label}
        {!required ? (
          <span className="ml-1.5 font-normal text-[var(--text-secondary)]">
            (optional)
          </span>
        ) : null}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : null, error ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(
          // Height 48px and font-size >= 16px. Anything smaller and
          // iOS Safari zooms the viewport on focus, mid-checkout.
          "h-12 w-full min-w-0 max-w-full rounded-[var(--radius-sm)] border px-3 text-[length:var(--text-body)]",
          "bg-[var(--surface-raised)] text-[var(--text-primary)]",
          "transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
          error
            ? "border-[var(--state-error)]"
            : "border-[var(--border-subtle)]"
        )}
      />

      {hint && !error ? (
        <p
          id={hintId}
          className="text-[length:var(--text-caption)] text-[var(--text-secondary)]"
        >
          {hint}
        </p>
      ) : null}

      {/* Error below the field, where the mobile keyboard does not
          cover it, and announced. */}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-[length:var(--text-body-sm)] text-[var(--state-error)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
