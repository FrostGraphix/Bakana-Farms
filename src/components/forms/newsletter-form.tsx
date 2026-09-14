"use client";

import * as React from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

interface NewsletterFormProps {
  className?: string;
  label?: string;
}

export function NewsletterForm({
  className,
  label = "New batch notifications",
}: NewsletterFormProps) {
  const { toast } = useToast();
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const inputId = React.useId();
  const errorId = `${inputId}-error`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");

    if (typeof email !== "string" || !email.includes("@")) {
      setError("Enter an email address we can reach you at.");
      setStatus("error");
      form.querySelector<HTMLInputElement>("input[name=email]")?.focus();
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      toast({
        title: "Subscribed to batch releases",
        description: "We will notify you when the next harvest is packed.",
        variant: "success",
      });
    } catch {
      setStatus("error");
      setError("That did not go through. Try again in a moment.");
      toast({
        title: "Subscription failed",
        description: "Please check your network connection and retry.",
        variant: "error",
      });
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--state-success)] bg-[var(--state-success-bg)] p-4 text-[length:var(--text-body-sm)] text-[var(--state-success)]",
          className
        )}
        role="status"
      >
        <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-[var(--state-success)]" aria-hidden />
        <span className="leading-relaxed">
          You are on the ledger. We will dispatch an email notice when a new harvest batch is packaged.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("w-full max-w-md min-w-0 max-w-full grid gap-2", className)}
      noValidate
    >
      {/* Label above input for accessibility. Placeholder is not a label. */}
      <label
        htmlFor={inputId}
        className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-primary)]"
      >
        {label}
      </label>

      <div className="flex items-center gap-2 w-full min-w-0 max-w-full">
        <Input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-describedby={error ? errorId : undefined}
          hasError={status === "error"}
          className="flex-1 min-w-0 max-w-full bg-[var(--surface-page)] text-[var(--text-primary)] focus:border-[var(--border-focus)] shadow-inner"
        />
        <Button
          type="submit"
          size="md"
          variant="primary"
          loading={status === "submitting"}
          loadingLabel="Adding"
          aria-label="Subscribe to batch notifications"
          className="shrink-0 size-12 p-0 flex items-center justify-center rounded-[var(--radius-md)] shadow-md cursor-pointer"
        >
          <ArrowRight size={18} weight="bold" aria-hidden />
        </Button>
      </div>

      {/* Error state announced via role="alert" */}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-[length:var(--text-body-sm)] font-medium text-[var(--state-error)]"
        >
          {error}
        </p>
      ) : (
        <p className="text-[length:var(--text-caption)] text-[var(--text-secondary)]">
          Marketing email is opt-in and you can leave at any time. Governed by NDPA 2023.
        </p>
      )}
    </form>
  );
}
