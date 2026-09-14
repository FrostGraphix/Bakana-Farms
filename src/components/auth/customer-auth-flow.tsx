"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  EnvelopeSimple,
  User,
  CheckCircle,
  Eye,
  EyeSlash,
  Certificate,
  Truck,
  ShieldCheck,
  ArrowRight,
} from "@phosphor-icons/react";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "setup-password" | "register";

export function CustomerAuthFlow({
  initialMode = "sign-in",
}: {
  initialMode?: AuthMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/account";
  const { toast } = useToast();

  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [hasCheckedEmail, setHasCheckedEmail] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Password criteria verification
  const hasMinLength = password.length >= 8;
  const hasLettersAndNumbers = /\d/.test(password) && /[a-zA-Z]/.test(password);
  const passwordsMatch = Boolean(confirmPassword && password === confirmPassword);

  async function handleEmailLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 404) {
        setMode("register");
        toast({
          title: "New to Bakana Farms?",
          description: "Create an account to track your orders and save your delivery details.",
          variant: "info",
        });
        return;
      }

      if (data.status === "needs_password_setup") {
        setMode("setup-password");
        toast({
          title: "First-time login detected",
          description: "Please create a secure password to complete your account setup.",
          variant: "gold",
        });
        return;
      }

      setHasCheckedEmail(true);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.status === "needs_password_setup") {
          setMode("setup-password");
          return;
        }
        setError(data.error ?? "Incorrect password.");
        return;
      }

      toast({
        title: "Welcome back",
        description: "You are now logged in.",
        variant: "success",
      });
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError("Could not log in. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSetupPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!hasLettersAndNumbers) {
      setError("Password must include both letters and numbers.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not save your password.");
        return;
      }

      toast({
        title: mode === "register" ? "Account created" : "Password created",
        description: "Your account is secured and ready.",
        variant: "success",
      });

      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError("Could not complete password setup.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 items-center">
      {/* Left Column: Editorial Heritage Showcase (Desktop & Tablet) */}
      <div className="hidden md:flex flex-col space-y-6 min-w-0">
        <div>
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold uppercase tracking-wider text-[var(--accent-text)]">
            Bakana Farms · Customer Portal
          </span>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)] leading-tight">
            Direct harvest authenticity, from estate soils to your cup.
          </h1>
          <p className="mt-3 text-[length:var(--text-body)] text-[var(--text-secondary)] leading-relaxed">
            Access certified batch records, expedited recurring orders, and direct B2B export documentation.
          </p>
        </div>

        {/* 8K Product Packaging Showcase Card */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] shadow-[var(--elevation-raised)]">
          <Image
            src="/images/bakana-hero-product-8k.webp"
            alt="Bakana Farms Moringa, Honey and Ginger Blend"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-scrim)] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[length:var(--text-caption)] text-[var(--text-on-accent)] font-medium">
            <span>Rivers State Cultivation</span>
            <span>Batch Tested · Zero Additives</span>
          </div>
        </div>

        {/* Member Privilege Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="glass-card rounded-[var(--radius-md)] p-3.5 border border-[var(--border-subtle)]">
            <Certificate size={22} className="text-[var(--accent-text)]" aria-hidden />
            <h4 className="mt-2 text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">
              Batch Provenance
            </h4>
            <p className="mt-1 text-[length:var(--text-caption)] text-[var(--text-secondary)] leading-snug">
              Every package carries verifiable lab test records.
            </p>
          </div>

          <div className="glass-card rounded-[var(--radius-md)] p-3.5 border border-[var(--border-subtle)]">
            <Truck size={22} className="text-[var(--accent-text)]" aria-hidden />
            <h4 className="mt-2 text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">
              Direct Dispatch
            </h4>
            <p className="mt-1 text-[length:var(--text-caption)] text-[var(--text-secondary)] leading-snug">
              Express domestic courier and air cargo dispatch.
            </p>
          </div>

          <div className="glass-card rounded-[var(--radius-md)] p-3.5 border border-[var(--border-subtle)]">
            <ShieldCheck size={22} className="text-[var(--accent-text)]" aria-hidden />
            <h4 className="mt-2 text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">
              NDPA 2023 Secure
            </h4>
            <p className="mt-1 text-[length:var(--text-caption)] text-[var(--text-secondary)] leading-snug">
              Your data is encrypted and strictly protected.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Precision Authentication Glass Card */}
      <div className="w-full min-w-0 max-w-full">
        <div className="glass-card w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] border-t-2 border-t-[var(--accent-line)] p-5 sm:p-8 lg:p-10 shadow-[var(--elevation-raised)]">
          {/* Segmented Mode Switcher (Sign In vs Create Account) */}
          {mode !== "setup-password" ? (
            <div className="grid grid-cols-2 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] p-1 mb-7 border border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setMode("sign-in");
                  setError(null);
                }}
                className={cn(
                  "min-h-[44px] rounded-[var(--radius-sm)] py-2 text-[length:var(--text-body-sm)] font-medium transition-all inline-flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
                  mode === "sign-in"
                    ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={cn(
                  "min-h-[44px] rounded-[var(--radius-sm)] py-2 text-[length:var(--text-body-sm)] font-medium transition-all inline-flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
                  mode === "register"
                    ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Create Account
              </button>
            </div>
          ) : null}

          {/* Mode 1: Sign In Step 1 (Email Lookup) */}
          {mode === "sign-in" && !hasCheckedEmail && (
            <form onSubmit={handleEmailLookup} noValidate className="w-full min-w-0 max-w-full space-y-5">
              <div>
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] uppercase tracking-wider text-[var(--accent-text)]">
                  Customer Authentication
                </span>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                  Welcome back
                </h2>
                <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                  Enter your email address to access your orders and account ledger.
                </p>
              </div>

              <Field id="auth-email" error={error} required className="w-full min-w-0 max-w-full">
                <FieldLabel>Email address</FieldLabel>
                <div className="relative w-full min-w-0 max-w-full">
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@company.com or name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    className="w-full min-w-0 max-w-full pr-10"
                  />
                  <EnvelopeSimple
                    size={18}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
                    aria-hidden
                  />
                </div>
                <FieldError />
              </Field>

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                loadingLabel="Verifying email"
                full
                className="w-full"
              >
                <span>Continue</span>
                <ArrowRight size={16} aria-hidden />
              </Button>

              <div className="border-t border-[var(--border-subtle)] pt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer underline"
                >
                  New to Bakana Farms? Create an account
                </button>
              </div>
            </form>
          )}

          {/* Mode 1: Sign In Step 2 (Password Verification) */}
          {mode === "sign-in" && hasCheckedEmail && (
            <form onSubmit={handleLogin} noValidate className="w-full min-w-0 max-w-full space-y-5">
              <div>
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] uppercase tracking-wider text-[var(--accent-text)]">
                  Security Check
                </span>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                  Enter password
                </h2>
                <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)] truncate">
                  Signing in as <span className="font-medium text-[var(--text-primary)]">{email}</span>
                </p>
              </div>

              <Field id="auth-password" error={error} required className="w-full min-w-0 max-w-full">
                <div className="flex items-center justify-between">
                  <FieldLabel>Password</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[length:var(--text-caption)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlash size={14} /> : <Eye size={14} />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <div className="relative w-full min-w-0 max-w-full">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    required
                    autoFocus
                    className="w-full min-w-0 max-w-full pr-10"
                  />
                  <Lock
                    size={18}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
                    aria-hidden
                  />
                </div>
                <FieldError />
              </Field>

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                loadingLabel="Signing in"
                full
                className="w-full"
              >
                Sign in to account
              </Button>

              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-[length:var(--text-caption)]">
                <button
                  type="button"
                  onClick={() => {
                    setHasCheckedEmail(false);
                    setPassword("");
                    setError(null);
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer"
                >
                  Different email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("setup-password");
                    setError(null);
                  }}
                  className="text-[var(--accent-text)] hover:underline cursor-pointer font-medium"
                >
                  Set new password
                </button>
              </div>
            </form>
          )}

          {/* Mode 2: First-Time Password Setup (Guest Checkout Conversion) */}
          {mode === "setup-password" && (
            <form onSubmit={handleSetupPassword} noValidate className="w-full min-w-0 max-w-full space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--state-warning-bg)] px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold text-[var(--state-warning)] uppercase tracking-wider">
                  First-Time Access
                </span>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                  Create your password
                </h2>
                <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                  Link past orders placed under this email and secure your account.
                </p>
              </div>

              <Field id="setup-email" required className="w-full min-w-0 max-w-full">
                <FieldLabel>Email address</FieldLabel>
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={Boolean(email && hasCheckedEmail)}
                  className="w-full min-w-0 max-w-full"
                />
              </Field>

              <Field id="setup-new-password" required className="w-full min-w-0 max-w-full">
                <div className="flex items-center justify-between">
                  <FieldLabel>New password</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[length:var(--text-caption)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeSlash size={14} /> : <Eye size={14} />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full min-w-0 max-w-full"
                />
              </Field>

              <Field id="setup-confirm-password" required className="w-full min-w-0 max-w-full">
                <div className="flex items-center justify-between">
                  <FieldLabel>Confirm password</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-[length:var(--text-caption)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeSlash size={14} /> : <Eye size={14} />}
                    <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full min-w-0 max-w-full"
                />
              </Field>

              {/* Password Quality Criteria Checklist */}
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] p-3 space-y-1.5 border border-[var(--border-subtle)] text-[length:var(--text-caption)]">
                <div className={cn("flex items-center gap-2", hasMinLength ? "text-[var(--state-success)] font-medium" : "text-[var(--text-secondary)]")}>
                  <CheckCircle size={14} weight={hasMinLength ? "fill" : "regular"} />
                  <span>At least 8 characters</span>
                </div>
                <div className={cn("flex items-center gap-2", hasLettersAndNumbers ? "text-[var(--state-success)] font-medium" : "text-[var(--text-secondary)]")}>
                  <CheckCircle size={14} weight={hasLettersAndNumbers ? "fill" : "regular"} />
                  <span>Includes letters and numbers</span>
                </div>
                <div className={cn("flex items-center gap-2", passwordsMatch ? "text-[var(--state-success)] font-medium" : "text-[var(--text-secondary)]")}>
                  <CheckCircle size={14} weight={passwordsMatch ? "fill" : "regular"} />
                  <span>Passwords match</span>
                </div>
              </div>

              {error ? (
                <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--state-error-bg)] p-3 text-[length:var(--text-body-sm)] text-[var(--state-error)]">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                loadingLabel="Securing account"
                full
                className="w-full"
              >
                Save password & enter account
              </Button>

              <div className="border-t border-[var(--border-subtle)] pt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-in");
                    setHasCheckedEmail(false);
                    setError(null);
                  }}
                  className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {/* Mode 3: New Account Registration */}
          {mode === "register" && (
            <form onSubmit={handleSetupPassword} noValidate className="w-full min-w-0 max-w-full space-y-4.5">
              <div>
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] uppercase tracking-wider text-[var(--accent-text)]">
                  Direct Enrollment
                </span>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                  Create your account
                </h2>
                <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                  Save delivery addresses, trace harvest lots, and unlock repeat orders.
                </p>
              </div>

              {/* Name fields row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full min-w-0 max-w-full">
                <Field id="reg-firstName" className="w-full min-w-0 max-w-full">
                  <FieldLabel optionalText="(optional)">First name</FieldLabel>
                  <Input
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="e.g. Eleanor"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full min-w-0 max-w-full"
                  />
                </Field>
                <Field id="reg-lastName" className="w-full min-w-0 max-w-full">
                  <FieldLabel optionalText="(optional)">Last name</FieldLabel>
                  <Input
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="e.g. Vance"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full min-w-0 max-w-full"
                  />
                </Field>
              </div>

              <Field id="reg-email" error={error} required className="w-full min-w-0 max-w-full">
                <FieldLabel>Email address</FieldLabel>
                <div className="relative w-full min-w-0 max-w-full">
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    className="w-full min-w-0 max-w-full pr-10"
                  />
                  <EnvelopeSimple
                    size={18}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
                    aria-hidden
                  />
                </div>
                <FieldError />
              </Field>

              <Field id="reg-password" required className="w-full min-w-0 max-w-full">
                <div className="flex items-center justify-between">
                  <FieldLabel>Create password</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[length:var(--text-caption)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeSlash size={14} /> : <Eye size={14} />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full min-w-0 max-w-full"
                />
              </Field>

              <Field id="reg-confirmPassword" required className="w-full min-w-0 max-w-full">
                <div className="flex items-center justify-between">
                  <FieldLabel>Confirm password</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-[length:var(--text-caption)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeSlash size={14} /> : <Eye size={14} />}
                    <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full min-w-0 max-w-full"
                />
              </Field>

              {/* Password Quality Criteria Checklist */}
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] p-3 space-y-1.5 border border-[var(--border-subtle)] text-[length:var(--text-caption)]">
                <div className={cn("flex items-center gap-2", hasMinLength ? "text-[var(--state-success)] font-medium" : "text-[var(--text-secondary)]")}>
                  <CheckCircle size={14} weight={hasMinLength ? "fill" : "regular"} />
                  <span>At least 8 characters</span>
                </div>
                <div className={cn("flex items-center gap-2", hasLettersAndNumbers ? "text-[var(--state-success)] font-medium" : "text-[var(--text-secondary)]")}>
                  <CheckCircle size={14} weight={hasLettersAndNumbers ? "fill" : "regular"} />
                  <span>Includes letters and numbers</span>
                </div>
                <div className={cn("flex items-center gap-2", passwordsMatch ? "text-[var(--state-success)] font-medium" : "text-[var(--text-secondary)]")}>
                  <CheckCircle size={14} weight={passwordsMatch ? "fill" : "regular"} />
                  <span>Passwords match</span>
                </div>
              </div>

              {error ? (
                <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--state-error-bg)] p-3 text-[length:var(--text-body-sm)] text-[var(--state-error)]">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                loadingLabel="Creating account"
                full
                className="w-full mt-2"
              >
                Create account
              </Button>

              <div className="border-t border-[var(--border-subtle)] pt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-in");
                    setHasCheckedEmail(false);
                    setError(null);
                  }}
                  className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}

          {/* Privacy & NDPA Reassurance */}
          <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 text-center text-[length:var(--text-caption)] text-[var(--text-secondary)] leading-relaxed">
            Personal data is encrypted and handled under the Nigeria Data Protection Act (NDPA) 2023. View our{" "}
            <Link href="/privacy" className="text-[var(--text-primary)] underline">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
