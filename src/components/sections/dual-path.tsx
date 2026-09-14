import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Globe,
  Drop,
  Sun,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ATTRIBUTES = [
  { label: "MOQ", value: "500 boxes" },
  { label: "Incoterms", value: "FOB Lagos" },
  { label: "Lead Time", value: "10–14 days" },
  { label: "Certs", value: "NAFDAC · Export" },
] as const;

const PILLARS = [
  {
    icon: ShoppingBag,
    title: "Ecommerce Checkout",
    description: "Cards, transfer & multi-currency, so global customers can buy directly.",
  },
  {
    icon: Globe,
    title: "Export Portal",
    description: "A dedicated flow for distributors, separate from retail checkout.",
  },
  {
    icon: Drop,
    title: "Ingredient Story",
    description: "Every product page explains sourcing, honestly and specifically.",
  },
  {
    icon: Sun,
    title: "Fast, Light Build",
    description: "Engineered for speed — critical for international buyers on all connections.",
  },
] as const;

export function DualPath() {
  return (
    <section
      aria-labelledby="dual-path-heading"
      className="border-y border-[var(--border-subtle)] bg-[var(--surface-subtle)] py-(--spacing-section-lg)"
    >
      <div className="container-page">
        <Reveal>
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Product &amp; Shop Design
          </p>
          <h2
            id="dual-path-heading"
            className="mt-3 max-w-[22ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-[1.08] text-[var(--text-primary)]"
          >
            Built to sell — one box or a container load.
          </h2>
        </Reveal>

        {/* Dual Mockup Showcase */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left Frame: Retail B2C Shop */}
          <Reveal delay={0.06}>
            <BrowserWindow url="bakanafarms.com/shop/blend">
              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:items-center sm:p-8">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[linear-gradient(160deg,var(--surface-page),var(--surface-subtle))] p-4">
                  <Image
                    src="/images/bakana-hero-product-8k.webp"
                    alt="Bakana Farms Moringa, Honey & Ginger Tea Box"
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-contain p-2 transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="inline-flex w-fit items-center rounded-full bg-[var(--state-success-bg)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[var(--state-success)]">
                    In Stock
                  </span>

                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold leading-tight text-[var(--text-primary)]">
                    Moringa, Honey &amp; Ginger — 20 Bags
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex text-[var(--accent-line)]" aria-hidden>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} weight="fill" />
                      ))}
                    </div>
                    <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                      128 reviews
                    </span>
                  </div>

                  <div className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold italic text-[var(--accent-warm)]">
                    $14.00{" "}
                    <span className="font-[family-name:var(--font-mono)] text-sm not-italic font-normal text-[var(--text-secondary)]">
                      · ₦12,000
                    </span>
                  </div>

                  <p className="mt-2 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                    Single-origin, hand-blended, sun-honest wellness tea — ready to ship worldwide.
                  </p>

                  <Button className="mt-6 rounded-full" asChild full>
                    <Link href="/products/moringa-ginger-tea">
                      Add To Cart
                    </Link>
                  </Button>
                </div>
              </div>
            </BrowserWindow>
          </Reveal>

          {/* Right Frame: Wholesale B2B Export */}
          <Reveal delay={0.12}>
            <BrowserWindow
              url="bakanafarms.com/wholesale"
              dark
            >
              <div className="flex h-full flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="inline-flex w-fit items-center rounded-full border border-[color-mix(in_srgb,var(--scene-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--scene-accent)_15%,transparent)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[var(--scene-accent)]">
                    For Distributors
                  </span>

                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--scene-text)]">
                    Wholesale &amp; Export
                  </h3>

                  <p className="mt-2 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--scene-muted)] opacity-90">
                    Minimum order quantities, shipping terms and certification — laid out clearly, so a buyer never has to email to ask the basics.
                  </p>

                  {/* 4-Box Specification Matrix */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {ATTRIBUTES.map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--scene-text)_15%,transparent)] bg-[color-mix(in_srgb,var(--scene-text)_6%,transparent)] p-3.5 backdrop-blur-sm"
                      >
                        <span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[var(--scene-muted)] opacity-70">
                          {label}
                        </span>
                        <p className="mt-1 font-medium text-[var(--scene-text)]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="mt-8 rounded-full border border-transparent bg-[var(--scene-accent)] font-medium text-[var(--scene-bg)] hover:bg-[var(--accent-line)]"
                  asChild
                  full
                >
                  <Link href="/wholesale">
                    Request Export Quote
                  </Link>
                </Button>
              </div>
            </BrowserWindow>
          </Reveal>
        </div>

        {/* 4 Feature Pillars from Discovery */}
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <RevealItem key={title}>
              <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[var(--elevation-raised)]">
                <span className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--surface-subtle)] text-[var(--accent-warm)]">
                  <Icon size={22} weight="light" aria-hidden />
                </span>
                <h4 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
                  {title}
                </h4>
                <p className="mt-2 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                  {description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function BrowserWindow({
  url,
  children,
  dark = false,
}: {
  url: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border shadow-[var(--elevation-overlay)]",
        dark
          ? "border-[color-mix(in_srgb,var(--scene-accent)_20%,transparent)] bg-[var(--scene-bg)] text-[var(--scene-text)]"
          : "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)]"
      )}
    >
      {/* Browser Chrome Header */}
      <div
        className={cn(
          "flex items-center gap-3 border-b px-4 py-3",
          dark
            ? "border-[color-mix(in_srgb,var(--scene-text)_10%,transparent)] bg-[var(--scene-bg-soft)]"
            : "border-[var(--border-subtle)] bg-[var(--surface-page)]"
        )}
      >
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[var(--state-error)]" />
          <span className="size-2.5 rounded-full bg-[var(--state-warning)]" />
          <span className="size-2.5 rounded-full bg-[var(--state-success)]" />
        </div>

        <div
          className={cn(
            "flex flex-1 items-center justify-center rounded-full border px-4 py-1 text-center font-[family-name:var(--font-mono)] text-[11px]",
            dark
              ? "border-[color-mix(in_srgb,var(--scene-text)_10%,transparent)] bg-[color-mix(in_srgb,var(--scene-bg)_60%,black)] text-[var(--scene-muted)]"
              : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]"
          )}
        >
          {url}
        </div>
      </div>

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
