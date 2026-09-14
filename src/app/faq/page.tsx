import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CaretDown, Question } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Verified answers about Bakana Farms blend, preparation, orders, and commercial terms.",
};

const FAQS = [
  {
    question: "What ingredients are included in the blend?",
    answer: "Pure moringa leaf, honey and ginger. We never add artificial fillers, preservatives, artificial sweeteners, or synthetic flavorings.",
  },
  {
    question: "How should I prepare the tea?",
    answer: "Place one individually wrapped sachet into your cup. Pour 200ml of freshly boiled hot water and allow it to steep for 3 to 5 minutes to release the botanical oils and warmth.",
  },
  {
    question: "How do I track an existing shipment?",
    answer: "Visit our Track Order page with your order reference (found in your confirmation email) and the email address used during checkout. Live carrier status and dispatch milestones will display instantly.",
  },
  {
    question: "Can commercial retailers and distributors order wholesale?",
    answer: "Yes. We offer wholesale carton allocations and master cases for verified retailers and corporate gifting. Please submit a wholesale enquiry or contact our B2B desk directly.",
  },
  {
    question: "Are medical or therapeutic benefits promised?",
    answer: "No. Bakana Farms adheres strictly to food safety regulations and provides transparent botanical, ingredient, and preparation facts only. We make no unverified medical or curative claims.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We accept secure local and international card payments, bank transfers, and mobile money via Paystack with end-to-end PCI DSS compliance.",
  },
] as const;

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
      />

      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Help & Answers
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          Frequently asked questions.
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          Honest answers about the harvest blend, daily ritual, delivery, and wholesale terms.
        </p>
      </div>

      <div className="mt-12 max-w-3xl space-y-4">
        {FAQS.map((faq, index) => (
          <details
            key={faq.question}
            className="glass-card group rounded-[var(--radius-lg)] p-5 sm:p-6 transition-all duration-200 open:border-[var(--accent-line)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)] focus:outline-none">
              <span className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-text)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{faq.question}</span>
              </span>
              <CaretDown
                size={18}
                className="shrink-0 text-[var(--text-secondary)] transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="mt-4 pl-7 leading-relaxed text-[var(--text-secondary)]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-14 max-w-3xl rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">
              Still have a question?
            </h2>
            <p className="mt-2 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
              Our customer care team is here to assist with order tracking, sachet preparation, and buyer requests.
            </p>
          </div>
          <Button asChild variant="primary" className="shrink-0">
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
