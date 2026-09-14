"use client";

import * as React from "react";
import { CheckCircle, ShieldCheck, PaperPlaneTilt } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

const TOPIC_PRESETS = [
  "Order tracking & delivery",
  "Wholesale & container export",
  "Botanical potency & certificates",
  "General trade inquiry",
] as const;

const initialFields = {
  name: "",
  email: "",
  orderReference: "",
  subject: "",
  message: "",
};

export function SupportForm() {
  const { toast } = useToast();
  const [fields, setFields] = React.useState(initialFields);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">("idle");

  function update(key: keyof typeof initialFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});

    try {
      const response = await fetch("/api/support-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrors(body.fieldErrors ?? { form: body.error ?? "Message failed." });
        setStatus("idle");
        toast({
          title: "Message could not be sent",
          description: "Please check the highlighted fields.",
          variant: "error",
        });
        return;
      }
      setFields(initialFields);
      setStatus("sent");
      toast({
        title: "Message received",
        description: "Our client support team has logged your inquiry.",
        variant: "success",
      });
    } catch {
      setErrors({ form: "Check your connection and retry." });
      setStatus("idle");
      toast({
        title: "Network error",
        description: "Check your connection and try again.",
        variant: "error",
      });
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--state-success-bg)] p-8 text-center">
        <CheckCircle size={40} weight="fill" className="mx-auto text-[var(--state-success)]" aria-hidden />
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold">
          Message received
        </h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          Our client desk will review your message and reply via email shortly.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="glass-card w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 sm:p-8 lg:p-10 shadow-[var(--elevation-raised)]"
    >
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-5 mb-7">
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold uppercase tracking-wider text-[var(--accent-text)]">
          Client Services · Direct Desk
        </span>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
          Send an Inquiry
        </h2>
        <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
          Inquire regarding domestic delivery, international air/sea freight, or botanical certificates.
        </p>
      </div>

      {/* Quick Topic Selector */}
      <div className="mb-6 space-y-2">
        <span className="text-[length:var(--text-caption)] font-medium text-[var(--text-secondary)]">
          Inquiry topic:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {TOPIC_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => update("subject", preset)}
              className={cn(
                "rounded-full border px-3 py-1 text-[length:var(--text-caption)] transition-colors cursor-pointer",
                fields.subject === preset
                  ? "border-[var(--accent-line)] bg-[var(--surface-subtle)] text-[var(--accent-text)] font-semibold"
                  : "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 w-full min-w-0 max-w-full">
        <Field id="support-name" error={errors.name} required className="min-w-0 max-w-full w-full">
          <FieldLabel>Your name</FieldLabel>
          <Input
            name="name"
            required
            autoComplete="name"
            placeholder="e.g. Chinelo Okafor"
            value={fields.name}
            onChange={(event) => update("name", event.target.value)}
            className="min-w-0 max-w-full w-full"
          />
          <FieldError />
        </Field>

        <Field id="support-email" error={errors.email} required className="min-w-0 max-w-full w-full">
          <FieldLabel>Email address</FieldLabel>
          <Input
            name="email"
            required
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={(event) => update("email", event.target.value)}
            className="min-w-0 max-w-full w-full"
          />
          <FieldError />
        </Field>

        <Field id="support-orderReference" error={errors.orderReference} className="min-w-0 max-w-full w-full">
          <FieldLabel optionalText="(optional)">Order reference</FieldLabel>
          <Input
            name="orderReference"
            placeholder="e.g. BF-12345"
            value={fields.orderReference}
            onChange={(event) => update("orderReference", event.target.value.toUpperCase())}
            className="min-w-0 max-w-full w-full"
          />
          <FieldError />
        </Field>

        <Field id="support-subject" error={errors.subject} required className="min-w-0 max-w-full w-full">
          <FieldLabel>Subject</FieldLabel>
          <Input
            name="subject"
            required
            placeholder="Topic of your inquiry"
            value={fields.subject}
            onChange={(event) => update("subject", event.target.value)}
            className="min-w-0 max-w-full w-full"
          />
          <FieldError />
        </Field>
      </div>

      <div className="mt-5 w-full min-w-0 max-w-full">
        <Field id="support-message" error={errors.message} required className="min-w-0 max-w-full w-full">
          <FieldLabel>How can we help?</FieldLabel>
          <Textarea
            name="message"
            required
            rows={5}
            placeholder="Provide relevant details regarding your order, wholesale tender, or feedback."
            value={fields.message}
            onChange={(event) => update("message", event.target.value)}
            className="min-w-0 max-w-full w-full"
          />
          <FieldError />
        </Field>
      </div>

      {errors.form ? (
        <p role="alert" className="mt-5 rounded-[var(--radius-md)] bg-[var(--state-error-bg)] p-3 text-[length:var(--text-body-sm)] text-[var(--state-error)]">
          {errors.form}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
          <ShieldCheck size={18} className="text-[var(--accent-text)] shrink-0" aria-hidden />
          <span>Encrypted client message · NDPA 2023 protected</span>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          loading={status === "sending"}
          loadingLabel="Sending message"
        >
          <span>Send message</span>
          <PaperPlaneTilt size={16} aria-hidden />
        </Button>
      </div>
    </form>
  );
}
