"use client";

import * as React from "react";
import { CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

type Fields = {
  companyName: string;
  registrationNumber: string;
  contactName: string;
  email: string;
  phone: string;
  destinationMarket: string;
  estimatedVolume: string;
  targetDeliveryWindow: string;
  message: string;
  consent: boolean;
};

const initial: Fields = {
  companyName: "",
  registrationNumber: "",
  contactName: "",
  email: "",
  phone: "",
  destinationMarket: "",
  estimatedVolume: "",
  targetDeliveryWindow: "",
  message: "",
  consent: false,
};

const VOLUME_PRESETS = [
  "10 Cartons (1,000 units)",
  "50 Cartons (5,000 units)",
  "Container Load (FCL)",
] as const;

export function WholesaleEnquiryForm() {
  const { toast } = useToast();
  const [fields, setFields] = React.useState(initial);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  function update<Key extends keyof Fields>(key: Key, value: Fields[Key]) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate(data: Fields): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!data.companyName.trim() || data.companyName.trim().length < 2) {
      errs.companyName = "Company name must be at least 2 characters";
    }
    if (!data.contactName.trim() || data.contactName.trim().length < 2) {
      errs.contactName = "Contact name must be at least 2 characters";
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = "Please provide a valid business email address";
    }
    if (!data.destinationMarket.trim() || data.destinationMarket.trim().length < 2) {
      errs.destinationMarket = "Please specify your target destination market";
    }
    if (!data.estimatedVolume.trim() || data.estimatedVolume.trim().length < 2) {
      errs.estimatedVolume = "Please specify your estimated order volume";
    }
    if (!data.consent) {
      errs.consent = "You must confirm corporate authority and accept terms to proceed";
    }
    return errs;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clientErrors = validate(fields);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setStatus("error");
      toast({
        title: "Please complete required fields",
        description: "Check the highlighted fields to continue.",
        variant: "error",
      });
      const firstErrorKey = Object.keys(clientErrors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(firstErrorKey);
        el?.focus();
      }
      return;
    }

    setStatus("sending");
    setErrors({});

    try {
      const response = await fetch("/api/wholesale-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrors(body.fieldErrors ?? { form: body.error ?? "Enquiry failed." });
        setStatus("error");
        toast({
          title: "Enquiry needs attention",
          description: "Please check the highlighted fields.",
          variant: "error",
        });
        return;
      }
      setStatus("sent");
      setFields(initial);
      toast({
        title: "Wholesale enquiry received",
        description: "Our trade desk will review your specifications.",
        variant: "gold",
      });
    } catch {
      setErrors({ form: "Check your connection and retry." });
      setStatus("error");
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
          Enquiry received
        </h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          Our trade desk will review your specifications and contact your team.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      id="wholesale-form"
      onSubmit={submit}
      noValidate
      className="glass-card w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-5 sm:p-8 lg:p-10 shadow-[var(--elevation-raised)]"
    >
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-5 mb-8">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold uppercase tracking-wider text-[var(--accent-text)]">
            Trade Application
          </span>
          <span className="text-[var(--text-secondary)]">/</span>
          <span className="text-[length:var(--text-caption)] text-[var(--text-secondary)]">Direct Export</span>
        </div>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
          Wholesale Application
        </h2>
        <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
          Submit commercial requirements to receive tiered carton pricing, CIF/FOB logistics schedules, and sample kits.
        </p>
      </div>

      <div className="space-y-8 w-full min-w-0 max-w-full">
        {/* Section 1: Corporate Profile */}
        <section className="space-y-4 w-full min-w-0 max-w-full">
          <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-subtle)]">
            <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-bold text-[var(--accent-text)]">
              01
            </span>
            <h3 className="text-[length:var(--text-body-sm)] font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Corporate Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4.5 w-full min-w-0 max-w-full">
            <Field id="companyName" error={errors.companyName} required className="min-w-0 max-w-full w-full">
              <FieldLabel>Company name</FieldLabel>
              <Input
                name="companyName"
                value={fields.companyName}
                onChange={(event) => update("companyName", event.target.value)}
                placeholder="e.g. Harrods Fine Foods Ltd"
                className="min-w-0 max-w-full w-full"
              />
              <FieldError />
            </Field>

            <Field id="registrationNumber" error={errors.registrationNumber} className="min-w-0 max-w-full w-full">
              <FieldLabel>Registration number</FieldLabel>
              <Input
                name="registrationNumber"
                value={fields.registrationNumber}
                onChange={(event) => update("registrationNumber", event.target.value)}
                placeholder="e.g. RC-1029384, VAT ID, or EIN"
                className="min-w-0 max-w-full w-full"
              />
              <FieldError />
            </Field>

            <Field id="contactName" error={errors.contactName} required className="min-w-0 max-w-full w-full">
              <FieldLabel>Contact name</FieldLabel>
              <Input
                name="contactName"
                autoComplete="name"
                value={fields.contactName}
                onChange={(event) => update("contactName", event.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="min-w-0 max-w-full w-full"
              />
              <FieldError />
            </Field>

            <Field id="email" error={errors.email} required className="min-w-0 max-w-full w-full">
              <FieldLabel>Business email</FieldLabel>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={fields.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="procurement@company.com"
                className="min-w-0 max-w-full w-full"
              />
              <FieldError />
            </Field>

            <Field id="phone" error={errors.phone} className="min-w-0 max-w-full w-full md:col-span-2">
              <FieldLabel>Phone number</FieldLabel>
              <Input
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={fields.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="e.g. +234 800 000 0000 or +44 20 7946 0912"
                className="min-w-0 max-w-full w-full"
              />
              <FieldError />
            </Field>
          </div>
        </section>

        {/* Section 2: Commercial & Logistics Scope */}
        <section className="space-y-4 w-full min-w-0 max-w-full">
          <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-subtle)]">
            <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-bold text-[var(--accent-text)]">
              02
            </span>
            <h3 className="text-[length:var(--text-body-sm)] font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Commercial & Logistics Scope
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4.5 w-full min-w-0 max-w-full">
            <Field id="destinationMarket" error={errors.destinationMarket} required className="min-w-0 max-w-full w-full">
              <FieldLabel>Destination market</FieldLabel>
              <Input
                name="destinationMarket"
                value={fields.destinationMarket}
                onChange={(event) => update("destinationMarket", event.target.value)}
                placeholder="e.g. USA, UK, EU, Ghana (AfCFTA), UAE"
                className="min-w-0 max-w-full w-full"
              />
              <FieldError />
            </Field>

            <Field id="targetDeliveryWindow" error={errors.targetDeliveryWindow} className="min-w-0 max-w-full w-full">
              <FieldLabel>Target delivery window</FieldLabel>
              <Input
                name="targetDeliveryWindow"
                value={fields.targetDeliveryWindow}
                onChange={(event) => update("targetDeliveryWindow", event.target.value)}
                placeholder="e.g. Q4 2026 or Immediate"
                className="min-w-0 max-w-full w-full"
              />
              <FieldError />
            </Field>

            <div className="md:col-span-2 w-full min-w-0 max-w-full space-y-2">
              <Field id="estimatedVolume" error={errors.estimatedVolume} required className="min-w-0 max-w-full w-full">
                <FieldLabel>Estimated order volume</FieldLabel>
                <Input
                  name="estimatedVolume"
                  value={fields.estimatedVolume}
                  onChange={(event) => update("estimatedVolume", event.target.value)}
                  placeholder="e.g. 50 cartons / month (5,000 units)"
                  className="min-w-0 max-w-full w-full"
                />
                <FieldError />
              </Field>

              {/* Volume Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <span className="text-[length:var(--text-caption)] text-[var(--text-secondary)] font-medium mr-1">
                  Quick select:
                </span>
                {VOLUME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => update("estimatedVolume", preset)}
                    className={cn(
                      "min-h-[40px] rounded-full border px-3.5 py-1.5 text-[length:var(--text-body-sm)] transition-colors inline-flex items-center justify-center font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] cursor-pointer",
                      fields.estimatedVolume === preset
                        ? "border-[var(--accent-line)] bg-[var(--surface-subtle)] text-[var(--accent-text)] font-semibold shadow-xs"
                        : "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Specifications & Compliance */}
        <section className="space-y-4 w-full min-w-0 max-w-full">
          <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-subtle)]">
            <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-bold text-[var(--accent-text)]">
              03
            </span>
            <h3 className="text-[length:var(--text-body-sm)] font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Specifications & Verification
            </h3>
          </div>

          <Field id="message" error={errors.message} className="min-w-0 max-w-full w-full">
            <FieldLabel>Additional specifications</FieldLabel>
            <Textarea
              name="message"
              rows={4}
              value={fields.message}
              onChange={(event) => update("message", event.target.value)}
              placeholder="Custom packaging, port of entry (e.g. Felixstowe, Rotterdam), lab certificate requests, or cold-chain logistics."
              className="min-w-0 max-w-full w-full"
            />
            <FieldError />
          </Field>

          <div className="pt-2">
            <label className="flex items-start gap-3 text-[length:var(--text-body-sm)] text-[var(--text-secondary)] cursor-pointer min-h-[44px] py-1 select-none">
              <Checkbox
                id="consent"
                checked={fields.consent}
                onChange={(event) => update("consent", event.target.checked)}
                hasError={Boolean(errors.consent)}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span className="leading-snug">
                I confirm authority to represent the named business entity and consent to commercial communications and verification follow-ups from Bakana Farms in compliance with the Nigeria Data Protection Act (NDPA) 2023.
              </span>
            </label>
            {errors.consent ? (
              <p id="consent-error" role="alert" className="mt-2 text-[length:var(--text-caption)] text-[var(--state-error)]">
                {errors.consent}
              </p>
            ) : null}
          </div>
        </section>
      </div>

      {errors.form ? (
        <p role="alert" className="mt-6 rounded-[var(--radius-md)] bg-[var(--state-error-bg)] p-3 text-[length:var(--text-body-sm)] text-[var(--state-error)]">
          {errors.form}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
          <ShieldCheck size={18} className="text-[var(--accent-text)] shrink-0" aria-hidden />
          <span>Encrypted commercial inquiry · Direct to trade desk</span>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          loading={status === "sending"}
          loadingLabel="Submitting application"
        >
          Submit Wholesale Application
        </Button>
      </div>
    </form>
  );
}
