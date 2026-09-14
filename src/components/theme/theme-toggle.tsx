"use client";

import * as React from "react";
import { Sun, Moon, Desktop } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ThemeChoice = "light" | "dark" | "system";

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Desktop },
];

function readCookie(): ThemeChoice {
  if (typeof document === "undefined") return "system";
  const m = document.cookie.match(/(?:^|;\s*)theme=(light|dark|system)/);
  return (m?.[1] as ThemeChoice) ?? "system";
}

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  const resolved =
    choice === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : choice;

  // Suppress transitions for one frame. A 220ms cross-fade of the
  // whole page on theme change reads as a rendering bug.
  root.setAttribute("data-theme-switching", "");
  root.setAttribute("data-theme", resolved);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? "#1B2E22" : "#F6F1E7");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() =>
      root.removeAttribute("data-theme-switching")
    );
  });

  // One year, lax. Readable by the server so SSR renders correctly.
  document.cookie = `theme=${choice};path=/;max-age=31536000;samesite=lax`;
}

/**
 * Three states, not two. A binary toggle cannot express
 * "follow my operating system", which is what most people want.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const choice = React.useSyncExternalStore(
    (notify) => {
      window.addEventListener("bakana-theme-change", notify);
      return () => window.removeEventListener("bakana-theme-change", notify);
    },
    readCookie,
    () => "system"
  );

  // Track OS changes only while the user is on "system".
  React.useEffect(() => {
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  function select(next: ThemeChoice) {
    apply(next);
    window.dispatchEvent(new Event("bakana-theme-change"));
  }

  return (
    <fieldset
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[var(--radius-full)]",
        "border border-[var(--border-subtle)] p-0.5",
        className
      )}
    >
      <legend className="sr-only">Colour theme</legend>
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = choice === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => select(value)}
            aria-pressed={active}
            title={label}
            className={cn(
              "grid size-9 place-items-center rounded-[var(--radius-full)]",
              "transition-colors duration-[120ms] cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              "focus-visible:outline-[var(--border-focus)]",
              active
                ? "bg-[var(--surface-inverse)] text-[var(--text-inverse)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
            )}
          >
            <Icon size={16} weight={active ? "fill" : "regular"} aria-hidden />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
