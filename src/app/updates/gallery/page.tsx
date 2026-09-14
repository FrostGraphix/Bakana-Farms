import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Media Gallery",
  description:
    "High-resolution photography, harvest films, and packaging studies from Bakana Farms in Rivers State, Nigeria.",
};

export default function GalleryPage() {
  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Updates & Media", href: "/updates" },
          { label: "Media Gallery" },
        ]}
      />

      {/* Header */}
      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Visual Archive & Field Media
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          Media Gallery
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          Photos and films from our estate. Documenting moringa leaf drying, cold honey filtration, ginger preparation, and export ritual packaging.
        </p>
      </div>

      {/* Interactive Gallery */}
      <GalleryClient />
    </main>
  );
}
