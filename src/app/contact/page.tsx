import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { SupportForm } from "@/components/forms/support-form";
import {
  Package,
  Buildings,
  MapPin,
  ChatCircleDots,
  Briefcase,
  Question,
  Clock,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Contact Bakana Farms customer care, office locations, wholesale trade desks, and careers.",
};

const LOCATIONS = [
  {
    name: "Bakana Estate & Processing Grooves",
    role: "Cultivation & Primary Drying Facility",
    address: "Bakana Island, Degema LGA, Rivers State, Nigeria",
    contact: "Farm Gate & Phytosanitary Inspection",
  },
  {
    name: "Lagos Trade & Logistics Desk",
    role: "Commercial Export & National Distribution",
    address: "Victoria Island, Lagos, Nigeria",
    contact: "export@bakanafarms.com",
  },
  {
    name: "Americas Trade Corridor",
    role: "North American Regional Hub",
    address: "Houston, Texas, USA",
    contact: "americas@bakanafarms.com",
  },
];

const CAREER_OPENINGS = [
  {
    role: "Agronomist & Soil Microbiologist",
    type: "Full-time · Rivers State Estate",
    description:
      "Overseeing organic soil mineralization, moringa canopy health, and sustainable bee pollination corridors.",
  },
  {
    role: "Phytosanitary & Quality Assurance Lead",
    type: "Full-time · Lagos / Port Harcourt",
    description:
      "Auditing batch moisture levels, laboratory microbial tests, and international export food safety compliance.",
  },
  {
    role: "International Freight & Trade Operations",
    type: "Full-time · Lagos / Remote",
    description:
      "Managing maritime bill of ladings, AfCFTA customs corridors, and airfreight master carton dispatches.",
  },
];

export default function ContactPage() {
  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-24">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      {/* Hero Header */}
      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Direct Inquiries & Support
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          How can we help?
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          Reach our estate team for consumer support, retail stockist inquiries, wholesale export orders, or career opportunities.
        </p>
      </div>

      {/* Quick Navigation Anchor Bar */}
      <div className="mt-10 flex flex-wrap gap-2">
        <a
          href="#support"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-2 text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <ChatCircleDots size={16} aria-hidden />
          <span>Support & Inquiries</span>
        </a>
        <a
          href="#locations"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-2 text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <MapPin size={16} aria-hidden />
          <span>Office Locations</span>
        </a>
        <a
          href="#careers"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-2 text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <Briefcase size={16} aria-hidden />
          <span>Careers</span>
        </a>
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-2 text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <Question size={16} aria-hidden />
          <span>Browse FAQ</span>
        </Link>
      </div>

      {/* Section 1: Support Form & Quick Cards */}
      <section id="support" className="mt-16 scroll-mt-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--accent-text)] font-semibold">
              Customer & Technical Care
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-semibold text-[var(--text-primary)]">
              Send us a message
            </h2>
            <p className="mt-3 text-[length:var(--text-body)] leading-relaxed text-[var(--text-secondary)]">
              For existing retail purchases, please provide your order reference number so our fulfillment desk can immediately pull your dispatch record.
            </p>

            <div className="mt-8 grid gap-4">
              <Link
                href="/track-order"
                className="glass-card group flex items-center gap-4 rounded-[var(--radius-lg)] p-4 transition-all duration-200 hover:border-[var(--accent-line)]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
                  <Package size={22} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                    Track an existing order
                  </p>
                  <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                    Live dispatch and courier milestones
                  </p>
                </div>
              </Link>

              <Link
                href="/wholesale"
                className="glass-card group flex items-center gap-4 rounded-[var(--radius-lg)] p-4 transition-all duration-200 hover:border-[var(--accent-line)]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
                  <Buildings size={22} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                    Wholesale & B2B enquiry
                  </p>
                  <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                    Pallet volume, export terms, and commercial samples
                  </p>
                </div>
              </Link>

              <div className="glass-card flex items-center gap-4 rounded-[var(--radius-lg)] p-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
                  <Clock size={22} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)]">Response window</p>
                  <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                    Inquiries reviewed within one business day
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SupportForm />
          </div>
        </div>
      </section>

      {/* Section 2: Office & Estate Locations */}
      <section id="locations" className="mt-24 scroll-mt-28 border-t border-[var(--border-subtle)] pt-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--accent-text)] font-semibold">
              Presence & Infrastructure
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
              Office & Estate Locations
            </h2>
            <p className="mt-2 text-[length:var(--text-body)] text-[var(--text-secondary)]">
              Where our botanicals are grown, processed, and shipped to the world.
            </p>
          </div>
          <Link
            href="/stores"
            className="inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-semibold text-[var(--accent-text)] hover:underline"
          >
            <span>View retail stockists</span>
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="glass-card flex flex-col justify-between rounded-[var(--radius-lg)] p-6 border border-[var(--border-subtle)] hover:border-[var(--accent-line)] transition-colors"
            >
              <div>
                <div className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
                  <MapPin size={20} />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
                  {loc.name}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-text)]">
                  {loc.role}
                </p>
                <p className="mt-3 text-[length:var(--text-body-sm)] text-[var(--text-secondary)] leading-relaxed">
                  {loc.address}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]/60 text-[length:var(--text-caption)] text-[var(--text-secondary)] font-medium">
                {loc.contact}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Careers */}
      <section id="careers" className="mt-24 scroll-mt-28 border-t border-[var(--border-subtle)] pt-16">
        <div>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--accent-text)] font-semibold">
            Work With Us
          </span>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
            Careers at Bakana Farms
          </h2>
          <p className="mt-2 max-w-[44rem] text-[length:var(--text-body)] text-[var(--text-secondary)]">
            We are building Nigeria&apos;s leading botanical wellness brand. We cultivate with scientific rigor, environmental ethics, and fair grower remuneration.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {CAREER_OPENINGS.map((pos) => (
            <div
              key={pos.role}
              className="glass-card flex flex-col justify-between rounded-[var(--radius-lg)] p-6 border border-[var(--border-subtle)]"
            >
              <div>
                <div className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
                  <Briefcase size={20} />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
                  {pos.role}
                </h3>
                <span className="mt-1 inline-block font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-text)]">
                  {pos.type}
                </span>
                <p className="mt-3 text-[length:var(--text-body-sm)] text-[var(--text-secondary)] leading-relaxed">
                  {pos.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]/60">
                <a
                  href="mailto:careers@bakanafarms.com?subject=Career%20Inquiry%20-%20Bakana%20Farms"
                  className="inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-semibold text-[var(--accent-text)] hover:underline"
                >
                  <span>Submit credentials</span>
                  <ArrowRight size={14} aria-hidden />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: FAQ Bridge */}
      <section className="mt-24 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]/60 p-8 sm:p-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--accent-text)] shadow-xs">
          <Question size={24} />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-2 max-w-[36rem] text-[length:var(--text-body)] text-[var(--text-secondary)] leading-relaxed">
          Have questions about our single-origin moringa sourcing, cold-filtered honey, export shipping timelines, or brewing rituals?
        </p>
        <div className="mt-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--action-primary-bg)] px-6 py-3 text-[length:var(--text-body-sm)] font-semibold text-[var(--action-primary-text)] shadow-md hover:opacity-95"
          >
            <span>Read full FAQ</span>
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
