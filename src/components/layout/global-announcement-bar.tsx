"use client";

import * as React from "react";
import Link from "next/link";
import { AirplaneTakeoff, ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { useLanguage } from "@/components/i18n/language-provider";
import { usePathname } from "next/navigation";

export function GlobalAnnouncementBar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith("/checkout")) {
    return null;
  }

  return (
    <aside
      aria-label="Global shipping announcement"
      className="relative z-30 border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-1.5 text-[length:var(--text-caption)] text-[var(--text-secondary)] transition-colors"
    >
      <div className="container-page flex items-center justify-between gap-4">
        {/* Main Export Message */}
        <div className="flex items-center gap-2 overflow-hidden">
          <AirplaneTakeoff
            size={15}
            weight="fill"
            className="shrink-0 text-[var(--accent-text)]"
            aria-hidden
          />
          <p className="truncate font-medium text-[var(--text-primary)]">
            <span className="font-semibold text-[var(--accent-text)]">Global Export:</span>{" "}
            {t("banner.announcement")}
          </p>
        </div>

        {/* Quick Hub Links */}
        <div className="hidden md:flex items-center gap-3 shrink-0 font-[family-name:var(--font-mono)] text-[11px]">
          <Link
            href="/stores/houston-texas-hub"
            className="rounded-full bg-[var(--surface-page)] px-2 py-0.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
          >
            🇺🇸 USA Hub (Texas)
          </Link>
          <Link
            href="/stores/accra-ghana-hub"
            className="rounded-full bg-[var(--surface-page)] px-2 py-0.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
          >
            🇬🇭 AfCFTA Africa Hub
          </Link>
          <Link
            href="/wholesale"
            className="inline-flex items-center gap-1 font-semibold text-[var(--accent-text)] hover:underline"
          >
            <span>{t("banner.cta")}</span>
            <ArrowRight size={12} weight="bold" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
