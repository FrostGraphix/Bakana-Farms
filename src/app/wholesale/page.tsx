import type { Metadata } from "next";
import Link from "next/link";
import { WholesaleEnquiryForm } from "@/components/forms/wholesale-enquiry-form";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShieldCheck,
  Certificate,
  Sparkle,
  ArrowRight,
  Globe,
  Clock,
  CaretDown,
  EnvelopeSimple,
  Headset,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Wholesale & B2B Distribution",
  description:
    "Direct estate wholesale, export packaging, and carton allocations for verified retailers and distributors.",
};

const B2B_HIGHLIGHTS = [
  {
    icon: Package,
    title: "Master Carton Specs",
    description: "100 unit packs per master carton, individually foil-sealed to preserve active botanical freshness.",
  },
  {
    icon: ShieldCheck,
    title: "Estate Origin",
    description: "Moringa cultivated and sun-dried on Bakana farms in Nigeria with strict chain-of-custody tracking.",
  },
  {
    icon: Certificate,
    title: "Export Compliance",
    description: "Phytosanitary inspection dossiers and batch certificates of analysis provided for international consignments.",
  },
  {
    icon: Sparkle,
    title: "Evaluation Samples",
    description: "Sample packs and laboratory spec sheets dispatched to verified procurement teams upon request.",
  },
] as const;

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Inquiry & Market Scope",
    body: "Specify your destination country, expected monthly carton volume, and target delivery timeframe.",
  },
  {
    step: "02",
    title: "Sample & Quality Assay",
    body: "Receive physical sample packs and moisture assay records for buyer tasting and technical approval.",
  },
  {
    step: "03",
    title: "Commercial Terms & Proforma",
    body: "Finalize FOB or CIF shipping terms, payment milestones, and reserve warehouse batch inventory.",
  },
  {
    step: "04",
    title: "Dispatch & Documentation",
    body: "Order fulfillment from estate packhouse with full export bill of lading and customs documentation.",
  },
] as const;

const WHOLESALE_FAQS = [
  {
    question: "What is the standard commercial packaging format?",
    answer: "Each retail pack contains 20 unbleached tea sachets (40g net weight). Master export cartons are packed with 100 units, palletized and shrink-wrapped with moisture-barrier liners.",
  },
  {
    question: "What shipping and delivery terms are available?",
    answer: "We support FOB arrangements (Port of Lagos or Port Harcourt) as well as CIF to designated international ports. For North American partners, consignments can be coordinated via our Houston, Texas Americas Trade Desk. For West African destinations, preferential cross-border transit is handled via our Accra desk under AfCFTA protocols.",
  },
  {
    question: "Can we request buyer evaluation samples prior to commitment?",
    answer: "Yes. In the wholesale form, specify that you require a commercial evaluation pack. Our trade desk will confirm delivery details and dispatch sample units directly to your office.",
  },
  {
    question: "Do you offer private labeling or custom packaging?",
    answer: "For qualified annual volume contracts, custom co-packaging and branded outer cartons can be discussed during commercial review.",
  },
] as const;

export default function WholesalePage() {
  return (
    <main className="min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Wholesale & B2B" },
          ]}
        />

        {/* Hero Section */}
        <div className="mt-8 max-w-[54rem]">
          <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3.5 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
            B2B & Trade Desk
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] sm:text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
            Commercial allocations for global distributors.
          </h1>
          <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
            Direct estate packaging, verified phytosanitary records, and flexible pallet allocation for specialty grocers, wellness retailers, and export trade partners.
          </p>

          {/* Trade Trust Signals */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              "100 Sachets / Master Carton",
              "Lagos · Port Harcourt · Houston · Accra",
              "Phytosanitary & Lab Certified",
              "AfCFTA Cross-Border Transit",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[length:var(--text-caption)] font-medium text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick Hero Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="md">
              <a href="#wholesale-form">
                <span>Apply for Commercial Allocation</span>
                <ArrowRight size={16} />
              </a>
            </Button>
            <Button asChild variant="secondary" size="md">
              <Link href="/contact">
                <EnvelopeSimple size={16} />
                <span>Contact Trade Desk</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {B2B_HIGHLIGHTS.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <div
                key={highlight.title}
                className="glass-card flex flex-col justify-between rounded-[var(--radius-lg)] p-5 sm:p-6 transition-all duration-200 hover:border-[var(--accent-line)]"
              >
                <div>
                  <div className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                    {highlight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main 2-Column Split */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14 items-start">
          {/* Left Column: Pipeline & Commercial Guidelines */}
          <div className="space-y-8 min-w-0">
            <div>
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold uppercase tracking-wider text-[var(--accent-text)]">
                Procurement Roadmap
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
                From inquiry to container loading
              </h2>
              <p className="mt-2 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                Our trade desk coordinates export documentation, quality certifications, and secure payment escrow.
              </p>
            </div>

            <div className="space-y-4">
              {PIPELINE_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="glass-card flex items-start gap-4 rounded-[var(--radius-md)] p-4 sm:p-5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-bold text-[var(--accent-text)]">
                    {step.step}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-[family-name:var(--font-display)] text-[length:var(--text-body)] font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Trade Desk Card */}
            <div className="glass-card rounded-[var(--radius-lg)] p-6 border border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--text-accent)]">
                  <Headset size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">Need immediate trade assistance?</h4>
                  <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                    Contact our commercial team directly for sample tracking or tenders.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="sm">
                  <Link href="/contact" className="gap-1.5">
                    <EnvelopeSimple size={16} />
                    <span>Contact Trade Desk</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/certifications" className="gap-1.5">
                    <span>View Compliance Ledger</span>
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Pricing & MOQ Notice */}
            <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4 text-[length:var(--text-caption)] text-[var(--text-secondary)] leading-relaxed">
              <p className="font-medium text-[var(--text-primary)] mb-1">Commercial Transparency Note:</p>
              Unit carton pricing, minimum order quantities, and freight estimates vary based on destination customs duties, cargo insurance, and container configuration. Formal quotes follow commercial review.
            </div>
          </div>

          {/* Right Column: Wholesale Application Form */}
          <div className="min-w-0 w-full">
            <WholesaleEnquiryForm />
          </div>
        </div>

        {/* Wholesale FAQ Section */}
        <div className="mt-20 border-t border-[var(--border-subtle)] pt-14">
          <div className="max-w-2xl">
            <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
              Commercial Clarity
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
              Wholesale questions answered.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 max-w-3xl">
            {WHOLESALE_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="glass-card group rounded-[var(--radius-lg)] p-5 sm:p-6 transition-all duration-200 open:border-[var(--accent-line)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 rounded-[var(--radius-md)]">
                  <span>{faq.question}</span>
                  <CaretDown
                    size={18}
                    className="shrink-0 text-[var(--text-secondary)] transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
