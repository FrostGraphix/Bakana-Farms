import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The beginnings of Bakana Farms.",
};

export default function OurStoryPage() {
  return (
    <main>
      <section className="container-page pt-28 sm:pt-32 pb-16 lg:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Our story" },
          ]}
        />
        <p className="eyebrow mt-8">Founded in 2022</p>
        <h1 className="mt-4 max-w-[16ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.06] text-[var(--text-primary)]">Rooted in Nigerian agriculture.</h1>
        <p className="mt-6 max-w-[58ch] text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">Bakana Farms began around one focused product: moringa, honey and ginger tea.</p>
      </section>
      <section className="border-y border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-tight">What guides the work.</h2>
          <div className="grid gap-8 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
            <p>Keep ingredients understandable. Keep preparation straightforward.</p>
            <p>Share only verified details. Never overstate product benefits.</p>
            <p>Build reliable trade relationships. Support everyday customers equally.</p>
          </div>
        </div>
      </section>
      <section className="container-page py-16 lg:py-24">
        <h2 className="max-w-[18ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-tight">The story remains open.</h2>
        <p className="mt-5 max-w-[55ch] text-[length:var(--text-body-lg)] text-[var(--text-secondary)]">Farm photography and deeper founder records will appear after approval.</p>
        <Button asChild size="lg" className="mt-8"><Link href="/products">Explore the blend</Link></Button>
      </section>
    </main>
  );
}
