"use client";

import * as React from "react";
import { Globe, CaretDown, Check } from "@phosphor-icons/react";
import { useLanguage } from "./language-provider";
import { type SupportedLanguage } from "./translations";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface LanguageSelectorProps {
  className?: string;
  condensed?: boolean;
}

export function LanguageSelector({ className, condensed = false }: LanguageSelectorProps) {
  const { language, setLanguage, languages } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const defaultLang = languages[0] ?? {
    code: "EN" as SupportedLanguage,
    name: "English",
    nativeName: "English",
    flag: "🇺🇸 / 🇳🇬",
    region: "Global / Americas / West Africa",
  };
  const activeLang = languages.find((l) => l.code === language) ?? defaultLang;

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Change language, currently ${activeLang.name}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 px-2.5 py-1.5 text-[length:var(--text-body-sm)] font-medium text-[var(--text-primary)] transition-all duration-150 backdrop-blur-md cursor-pointer",
          "hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
          open && "border-[var(--accent-line)] bg-[var(--surface-subtle)]"
        )}
      >
        <Globe size={16} weight="duotone" className="text-[var(--accent-text)]" aria-hidden />
        <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wider font-semibold">
          {activeLang.code}
        </span>
        <CaretDown
          size={12}
          weight="bold"
          className={cn(
            "text-[var(--text-secondary)] transition-transform duration-200",
            open && "rotate-180 text-[var(--accent-text)]"
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 top-full mt-2 w-64 origin-top-right overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1.5 text-[var(--text-primary)] shadow-2xl backdrop-blur-2xl z-50"
          >
            <div className="px-3 py-1.5 border-b border-[var(--border-subtle)]/70">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--accent-text)] font-semibold">
                Global Languages
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Select your preferred locale
              </p>
            </div>

            <div className="py-1">
              {languages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-left text-[length:var(--text-body-sm)] transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[var(--surface-subtle)] text-[var(--text-primary)] font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]/70 hover:text-[var(--text-primary)]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base" aria-hidden>{lang.flag}</span>
                      <div className="min-w-0">
                        <p className="leading-tight text-[var(--text-primary)]">
                          {lang.nativeName}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {lang.name} · {lang.region}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={16} weight="bold" className="text-[var(--accent-text)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
