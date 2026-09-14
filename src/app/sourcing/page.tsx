import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Sourcing",
  description: "Verified Bakana Farms botanical sourcing and origin ledger.",
};

const LEDGER = [
  {
    number: "01",
    ingredient: "Moringa leaf",
    origin: "Bakana Farms estate cultivation",
    status: "Verified estate harvest",
    description: "Sun-dried and cold-milled to retain chlorophyll and natural botanical integrity without chemical heat processing.",
    verified: true,
  },
  {
    number: "02",
    ingredient: "Pure Honey",
    origin: "Regional cooperative apiaries",
    status: "Verification documentation in progress",
    description: "Source batch records, moisture analysis, and apiary provenance logs are being compiled for publication.",
    verified: false,
  },
  {
    number: "03",
    ingredient: "Sun-Dried Ginger",
    origin: "Selected Nigerian root growers",
    status: "Verification documentation in progress",
    description: "Aroma profiling and oleoresin testing protocols are undergoing formal review prior to public release.",
    verified: false,
  },
] as const;

export default function SourcingPage() {
  return (
    <main className="min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <section className="container-page">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Sourcing" },
          ]}
        />

        <div className="mt-8 max-w-[48rem]">
          <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
            Source ledger
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
            Specific where verified.
          </h1>
          <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
            We publish verifiable agricultural origins. Where lab certification or apiary records are still undergoing documentation, we state the current status plainly rather than inventing claims.
          </p>
        </div>
      </section>

      <section className="mt-12 border-y border-[var(--border-subtle)] bg-[var(--surface-inverse)] text-[var(--text-inverse)]">
        <div className="container-page py-14 lg:py-20">
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck size={20} className="text-[var(--accent-line)]" aria-hidden />
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] uppercase tracking-wider text-[var(--text-inverse)]/80">
              Chain of custody ledger
            </p>
          </div>

          <div className="divide-y divide-[var(--border-strong)] border-y border-[var(--border-strong)]">
            {LEDGER.map((item) => (
              <div
                key={item.ingredient}
                className="grid gap-4 py-8 sm:grid-cols-[3rem_1fr_1.5fr] sm:items-baseline lg:gap-8"
              >
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-line)]">
                  {item.number}
                </span>

                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-inverse)]">
                    {item.ingredient}
                  </h2>
                  <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-inverse)]/80">
                    {item.origin}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    {item.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-raised)]/15 px-2.5 py-0.5 text-[length:var(--text-caption)] text-[var(--text-inverse)]">
                        <CheckCircle size={14} className="text-[var(--accent-line)]" weight="fill" />
                        {item.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-scrim)] px-2.5 py-0.5 text-[length:var(--text-caption)] text-[var(--text-inverse)]/80">
                        <Clock size={14} className="text-[var(--accent-line)]" />
                        {item.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 leading-relaxed text-[var(--text-inverse)]/80">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page mt-12">
        <div className="glass-card flex flex-col gap-6 rounded-[var(--radius-lg)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
              Request harvest specifications
            </h3>
            <p className="mt-2 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
              Commercial buyers can request moisture analysis and batch harvest certificates from our quality assurance team.
            </p>
          </div>
          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/contact">Inquire with quality desk</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
