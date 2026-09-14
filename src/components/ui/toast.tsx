"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircle,
  WarningCircle,
  Info,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "info" | "gold";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const reduce = useReducedMotion();
  const { id, title, description, variant = "default", duration = 5000 } = toast;
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (duration <= 0 || paused) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, paused, onDismiss]);

  const Icon = {
    default: Info,
    success: CheckCircle,
    error: WarningCircle,
    info: Info,
    gold: Sparkle,
  }[variant];

  const variantStyles = {
    default:
      "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)]",
    success:
      "border-[var(--state-success)] bg-[var(--surface-raised)] text-[var(--text-primary)]",
    error:
      "border-[var(--state-error)] bg-[var(--surface-raised)] text-[var(--text-primary)]",
    info:
      "border-[var(--state-info)] bg-[var(--surface-raised)] text-[var(--text-primary)]",
    gold:
      "border-[var(--accent-line)] bg-[var(--surface-raised)] text-[var(--text-primary)]",
  }[variant];

  const iconStyles = {
    default: "text-[var(--text-secondary)]",
    success: "text-[var(--state-success)]",
    error: "text-[var(--state-error)]",
    info: "text-[var(--state-info)]",
    gold: "text-[var(--accent-text)]",
  }[variant];

  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: "spring", stiffness: 450, damping: 30 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="status"
      className={cn(
        "pointer-events-auto relative flex w-full max-w-sm overflow-hidden rounded-[var(--radius-md)] border p-4 shadow-[var(--elevation-modal)]",
        variantStyles
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <Icon size={20} weight="fill" className={cn("mt-0.5 shrink-0", iconStyles)} aria-hidden />
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">
            {title}
          </p>
          {description ? (
            <p className="mt-1 text-[length:var(--text-caption)] leading-relaxed text-[var(--text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
          className="grid size-8 place-items-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] cursor-pointer"
        >
          <X size={16} aria-hidden />
        </button>
      </div>

      {duration > 0 && !reduce ? (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--surface-subtle)] overflow-hidden">
          <motion.div
            style={{ transformOrigin: "left" }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: paused ? 1 : 0 }}
            transition={{ duration: paused ? 0 : duration / 1000, ease: "linear" }}
            className={cn("h-full w-full", {
              "bg-[var(--text-secondary)]": variant === "default",
              "bg-[var(--state-success)]": variant === "success",
              "bg-[var(--state-error)]": variant === "error",
              "bg-[var(--state-info)]": variant === "info",
              "bg-[var(--accent-line)]": variant === "gold",
            })}
          />
        </div>
      ) : null}
    </motion.div>
  );
}
