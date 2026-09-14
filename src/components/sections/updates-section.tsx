"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, NewspaperClipping } from "@phosphor-icons/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

interface UpdateCard {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  href: string;
  image: string;
}

const RECENT_UPDATES: UpdateCard[] = [
  {
    id: "update-1",
    title: "Estate Harvest & Global Export Corridor Launch",
    category: "Announcements",
    date: "Sep 2026",
    excerpt:
      "Bakana Farms formalises dedicated export distribution pathways with single-origin botanical tracing to North America and Europe.",
    href: "/updates/category/announcements",
    image: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
  },
  {
    id: "update-2",
    title: "Moringa Intercropping & Soil Nutrient Recovery",
    category: "Case Studies",
    date: "Aug 2026",
    excerpt:
      "A field analysis documenting leaf yield, organic microbial vitality, and sustainable bee foraging cycles across our estate groves.",
    href: "/updates/category/case-studies",
    image: "/images/bakana-open-box-honey-8k.webp",
  },
  {
    id: "update-3",
    title: "Visual Archive: Sun, Soil, and the Twenty-Sachet Ritual",
    category: "Media Gallery",
    date: "Aug 2026",
    excerpt:
      "Explore high-resolution photography and films capturing botanical harvesting, drying racks, and the quiet clarity of morning tea.",
    href: "/updates/gallery",
    image: "/images/bakana-hero-product-8k.webp",
  },
];

export function UpdatesSection() {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--surface-page)] py-(--spacing-section-lg) text-[var(--text-primary)]">
      <div className="container-page">
        {/* Section Header */}
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
              News & Field Notes
            </p>
            <h2 className="mt-4 max-w-[14ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.02] text-[var(--text-primary)]">
              Recent Updates.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[length:var(--text-body)] text-[var(--text-secondary)]">
            Dispatches from the estate, harvest observations, and international distribution milestones.
          </p>
        </Reveal>

        {/* 3-Card Grid */}
        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.08}>
          {RECENT_UPDATES.map((card) => (
            <RevealItem key={card.id}>
              <Link
                href={card.href}
                className="glass-card group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-line)] hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-subtle)]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
                    {card.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-text)]">
                      {card.date}
                    </span>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                      {card.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-semibold text-[var(--accent-text)]">
                    <span>Read more</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* View All CTA */}
        <Reveal delay={0.2} className="mt-14 text-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/updates">
              <span>View all updates & media</span>
              <ArrowRight size={16} aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
