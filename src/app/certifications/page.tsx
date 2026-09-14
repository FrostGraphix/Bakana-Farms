import type { Metadata } from "next";
import Link from "next/link";
import { SealCheck, FileText, Info } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Verified Bakana Farms certification records, regulatory disclosures, and lab compliance.",
};

export default function CertificationsPage() {
  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Certifications" },
        ]}
      />

      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Regulatory & Standards
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          Only verified marks appear.
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          In strict adherence to consumer transparency and Nigerian food regulations, Bakana Farms does not display unverified seals, placeholder registration numbers, or uncertified laboratory badges.
        </p>
      </div>

      <div className="mt-12 max-w-2xl space-y-6">
        <div className="glass-card rounded-[var(--radius-lg)] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
              <SealCheck size={24} weight="light" aria-hidden />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                Statutory Filings Ledger
              </h2>
              <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">
                Formal NAFDAC registration, laboratory nutritional profiling, and export phytosanitary documentation are in active review with the regulatory authorities. Official document reference numbers will be published here upon issuance.
              </p>
              <div className="mt-4 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-disabled)]">
                <Info size={16} />
                <span>Audited publication date: Active review 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
                Commercial compliance inquiries
              </h3>
              <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                Institutional buyers requiring food safety audit dossiers may request interim documentation.
              </p>
            </div>
            <Button asChild variant="secondary" className="shrink-0">
              <Link href="/contact">Request documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
