import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Drop, Fire, Sparkle, Heart } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "How To Use",
  description: "Preparation guide for Bakana Farms moringa, honey and ginger tea sachets.",
};

const STEPS = [
  {
    number: "01",
    title: "Unwrap & Place",
    body: "Place one individually wrapped sachet into your favorite cup or heat-resistant mug.",
    icon: Drop,
  },
  {
    number: "02",
    title: "Fresh Hot Water",
    body: "Pour 200ml of freshly boiled water (approx. 90°C to 95°C) directly over the sachet.",
    icon: Fire,
  },
  {
    number: "03",
    title: "Steep 3–5 Mins",
    body: "Allow the botanicals to steep for 3 to 5 minutes so the warm ginger root and moringa infuse thoroughly.",
    icon: Sparkle,
  },
  {
    number: "04",
    title: "Savor Warmly",
    body: "Inhale the restorative aroma and sip slowly. Add fresh lemon or a drizzle of natural honey if desired.",
    icon: Heart,
  },
] as const;

export default function HowToUsePage() {
  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "How To Use" },
        ]}
      />

      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Preparation Ritual
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          One simple daily ritual.
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          Each sachet is sealed to preserve active volatile oils and harvest freshness until the moment hot water releases them.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="glass-card flex flex-col justify-between rounded-[var(--radius-lg)] p-6 transition-all duration-200 hover:border-[var(--accent-line)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold text-[var(--accent-text)]">
                    {step.number}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--text-primary)]">
                    <Icon size={20} />
                  </div>
                </div>
                <h2 className="mt-6 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h2>
                <p className="mt-3 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                  {step.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
              Ready for your morning cup?
            </h3>
            <p className="mt-2 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
              Experience the balanced blend of sun-dried moringa, golden honey, and spicy ginger.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/products">Choose your pack</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
