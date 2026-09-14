"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { CurrentYear } from "@/components/layout/current-year";
import { ShieldCheck, MapPin, Sparkle, GlobeHemisphereWest } from "@phosphor-icons/react";
import { useLanguage } from "@/components/i18n/language-provider";

const COLUMNS = [
  {
    translationKey: "footer.shop",
    heading: "Shop",
    links: [
      { href: "/products", label: "The Blend" },
      { href: "/wholesale", label: "Wholesale & B2B" },
      { href: "/stores", label: "Stores & Pavilions" },
      { href: "/track-order", label: "Track Order" },
    ],
  },
  {
    translationKey: "footer.learn",
    heading: "Learn",
    links: [
      { href: "/our-story", label: "Our Heritage" },
      { href: "/sourcing", label: "Botanical Sourcing" },
      { href: "/how-to-use", label: "The Brewing Ritual" },
      { href: "/journal", label: "The Journal" },
    ],
  },
  {
    translationKey: "footer.help",
    heading: "Help",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact Support" },
      { href: "/certifications", label: "Certifications" },
      { href: "/stores", label: "Experience Centers" },
    ],
  },
  {
    translationKey: "footer.legal",
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/returns", label: "Returns & Refunds" },
      { href: "/shipping", label: "Shipping Policy" },
    ],
  },
] as const;

export function SiteFooter() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith("/checkout")) {
    return null;
  }

  return (
    <footer className="mt-(--spacing-section-lg) border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]">
      <div className="container-page pb-28 pt-(--spacing-section) lg:pb-(--spacing-section)">
        {/* Tier 1: Harvest Newsletter Highlight Card */}
        <div className="mb-12 lg:mb-16 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-raised)_55%,transparent)] p-6 sm:p-8 lg:p-10 shadow-sm backdrop-blur-md">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-line)]/40 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-wider text-[var(--accent-text)]">
                  <Sparkle size={12} weight="fill" />
                  Harvest Ledger
                </span>
              </div>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                {t("footer.newsletterTitle", "Subscribe to Batch Releases")}
              </h3>
              <p className="mt-2 max-w-xl text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                {t("footer.newsletterDesc", "Receive immediate notice when newly dried Moringa and wild honey batches are packaged at our Bakana estate, along with private tasting invitations.")}
              </p>
            </div>
            <div className="w-full max-w-md lg:justify-self-end">
              <NewsletterForm label="Enter your email for batch dispatch alerts" />
            </div>
          </div>
        </div>

        {/* Tier 2: Brand Provenance & Navigation Grid */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          {/* Brand Identity & Provenance */}
          <div className="max-w-md">
            <Wordmark full className="h-16 sm:h-20" />
            <p className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
              Moringa, Honey and Ginger Tea
            </p>
            <p className="mt-1 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
              Single-estate agricultural botanical blend grown in the Niger Delta and crafted for a warmer daily ritual. Worldwide fulfillment to the USA, Europe, and Pan-African corridors.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-[family-name:var(--font-mono)] text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-page)] px-3 py-1">
                <MapPin size={12} className="text-[var(--accent-text)]" />
                Bakana, Rivers State
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-page)] px-3 py-1">
                <GlobeHemisphereWest size={12} className="text-[var(--accent-text)]" />
                {t("footer.houstonHub", "Houston Hub (Americas)")}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-page)] px-3 py-1">
                {t("footer.afcftaCorridor", "AfCFTA Corridor (Africa)")}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-page)] px-3 py-1">
                {t("footer.singleEstate", "Single-Estate Origin")}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-page)] px-3 py-1">
                {t("footer.exportGrade", "Export Grade")}
              </span>
            </div>
          </div>

          {/* Navigation Columns (2 columns on mobile, 4 columns on tablet & desktop) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="min-w-0">
                <h2 className="font-[family-name:var(--font-mono)] text-[var(--text-eyebrow)] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                  {t(col.translationKey, col.heading)}
                </h2>
                <ul className="mt-4 grid gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center min-h-[28px] py-1 text-[var(--text-body-sm)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Bottom Legal, Compliance & Security Bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-6 text-[length:var(--text-caption)] text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>&copy; <CurrentYear /> Bakana Farms Limited.</span>
            <span>{t("footer.rights", "All rights reserved. Regulated Nigerian Agricultural Produce.")}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
              <ShieldCheck size={14} className="text-emerald-500" />
              Paystack 256-Bit SSL Encrypted
            </span>
            <span className="hidden sm:inline text-[var(--border-subtle)]">|</span>
            <span>NDPA 2023 & GAID 2025 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
