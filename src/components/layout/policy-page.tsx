"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "@phosphor-icons/react";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { printPdf } from "@/lib/export";
import { cn } from "@/lib/utils";

export type PolicySection = {
  title: string;
  body?: string;
  bullets?: string[];
  content?: React.ReactNode;
};

export function PolicyPage({
  eyebrow,
  title,
  summary,
  lastUpdated = "September 13, 2026",
  sections,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  lastUpdated?: string;
  sections: PolicySection[];
}) {
  const handlePrint = () => {
    printPdf({
      title,
      subtitle: summary,
      meta: [
        { label: "Document", value: eyebrow },
        { label: "Last Updated", value: lastUpdated },
        { label: "Jurisdiction", value: "Federal Republic of Nigeria (NDPA 2023 / GAID 2025)" },
      ],
      sections: sections.map((s) => ({
        heading: s.title,
        body: s.body ?? (typeof s.content === "string" ? s.content : ""),
        bullets: s.bullets,
      })),
    });
  };

  return (
    <main className="min-h-[85vh] pt-28 sm:pt-32 pb-20">
      {/* Hero Header */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]/50 py-12 sm:py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: eyebrow },
              ]}
            />

            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print or save as PDF"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3.5 py-1.5 text-[length:var(--text-caption)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <Printer size={14} aria-hidden />
              <span>Print / Save PDF</span>
            </button>
          </div>

          <div className="mt-8 max-w-[48rem]">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
            >
              <ArrowLeft size={16} aria-hidden />
              <span>Back to home</span>
            </Link>

            <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
              {eyebrow}
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
              {title}
            </h1>

            <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
              {summary}
            </p>

            <p className="mt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-disabled)]">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-[14rem_1fr] md:py-16 lg:gap-16">
        {/* Sticky On-This-Page Sidebar */}
        <aside className="hidden md:block md:sticky md:top-28 md:self-start">
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Sections
          </p>
          <nav className="mt-4 grid gap-1.5" aria-label="Page sections">
            {sections.map((section, index) => (
              <a
                key={section.title}
                href={`#section-${index + 1}`}
                className="rounded-[var(--radius-sm)] py-1.5 text-[length:var(--text-body-sm)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] line-clamp-1"
              >
                {String(index + 1).padStart(2, "0")}. {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Section Cards */}
        <div className="flex flex-col gap-8">
          {sections.map((section, index) => (
            <article
              id={`section-${index + 1}`}
              key={section.title}
              className="glass-card scroll-mt-28 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)]/70 pb-3">
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold text-[var(--accent-text)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--text-disabled)]">
                  Bakana Legal
                </span>
              </div>

              <h2 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                {section.title}
              </h2>

              {section.body && (
                <p className="mt-3 text-[length:var(--text-body)] leading-relaxed text-[var(--text-secondary)]">
                  {section.body}
                </p>
              )}

              {section.content && (
                <div className="mt-3 leading-relaxed text-[var(--text-secondary)]">
                  {section.content}
                </div>
              )}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 grid gap-2 border-t border-[var(--border-subtle)]/40 pt-4 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--accent-line)]" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
