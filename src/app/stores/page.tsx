import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { StoresDirectoryClient } from "@/components/stores/stores-directory-client";
import { getAllStores } from "@/server/stores/data";

export const metadata: Metadata = {
  title: "Experience Centers & Global Trade Desks | Bakana Farms",
  description:
    "Visit our flagship retail boutiques, estate tasting pavilions, and international trade desks in Houston (Texas), Accra, Lagos, Rivers State, and Abuja. Sample botanical harvests and coordinate commercial allocations.",
};

export default function StoresPage() {
  const stores = getAllStores();

  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Stores & Hubs" },
        ]}
      />

      {/* Header Section */}
      <div className="mt-8 max-w-3xl">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Global Network & Flagships
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-tight text-[var(--text-primary)]">
          Flagship Boutiques, Estate Pavilions & Trade Desks
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          Explore our experience centers and commercial trade desks worldwide, spanning our Americas hub in Houston, Texas, our AfCFTA corridor in Accra, and our estate tasting pavilions across Nigeria. Taste freshly steeped harvests and coordinate bulk export allocations.
        </p>
      </div>

      {/* Stores Directory Grid & Filters */}
      <div className="mt-12">
        <StoresDirectoryClient initialStores={stores} />
      </div>

      {/* Visiting & Wholesale FAQ Section */}
      <section className="mt-20 border-t border-[var(--border-subtle)] pt-12">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
            Planning Your Visit
          </h2>
          <div className="mt-6 grid gap-6 text-[length:var(--text-body)] text-[var(--text-secondary)]">
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Do I need an appointment for tea tasting?</h3>
              <p className="mt-1 leading-relaxed text-[length:var(--text-body-sm)]">
                Walk-ins are welcome daily at our Victoria Island and Maitama boutiques. For groups of more than five or commercial buyer audits at our Rivers State estate pavilion, please message our support desk 24 hours in advance.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Can I collect wholesale and master carton orders in-store?</h3>
              <p className="mt-1 leading-relaxed text-[length:var(--text-body-sm)]">
                Yes. Online wholesale orders can be designated for same-day or next-day collection at any of our three hubs, with zero freight surcharges.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Are all batch numbers and harvest certificates available to inspect?</h3>
              <p className="mt-1 leading-relaxed text-[length:var(--text-body-sm)]">
                Every retail box carries its verifiable batch stamp, and physical copies of our moisture and phytosanitary analyses are available for commercial buyer inspection at every counter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
