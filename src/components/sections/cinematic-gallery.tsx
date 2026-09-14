"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const FRAMES = [
  {
    src: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
    alt: "Bakana Farms tea box surrounded by moringa, honey and ginger",
    label: "The full ritual",
    position: "object-center",
  },
  {
    src: "/images/bakana-open-box-honey-8k.webp",
    alt: "Open Bakana Farms Moringa, Honey and Ginger Tea box",
    label: "Twenty moments",
    position: "object-center",
  },
  {
    src: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
    alt: "Close detail of Bakana Farms Moringa, Honey and Ginger Tea packaging",
    label: "Rooted details",
    position: "object-[72%_55%]",
  },
] as const;

export function CinematicGallery() {
  const reduce = useReducedMotion();

  return (
    <section id="product-study" className="scroll-mt-16 overflow-hidden bg-[var(--scene-bg)] py-(--spacing-section-lg) text-[var(--scene-text)]">
      <div className="container-page flex items-end justify-between gap-8">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-[var(--scene-accent)]">Product study</p>
          <h2 className="mt-5 max-w-[11ch] text-[length:var(--text-display-lg)] leading-[.98] text-[var(--scene-text)]">Look closer. Then steep.</h2>
        </div>
        <p className="hidden max-w-[24ch] text-right text-[var(--scene-muted)] md:block">Swipe through every detail.</p>
      </div>

      <div className="scroll-x mt-12 flex snap-x snap-mandatory gap-4 px-[max(clamp(1.25rem,.11rem+4.862vw,4rem),calc((100vw-var(--container-page))/2+4rem))] pb-5">
        {FRAMES.map((frame, index) => (
          <motion.figure
            key={`${frame.label}-${index}`}
            initial={reduce ? false : { opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: index * 0.08 }}
            className="group relative aspect-[4/5] w-[82vw] max-w-[34rem] shrink-0 snap-center overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-[var(--scene-bg-soft)] sm:w-[64vw] lg:w-[38vw]"
          >
            <Image src={frame.src} alt={frame.alt} fill sizes="(max-width:640px) 82vw, (max-width:1024px) 64vw, 38vw" quality={90} className={`object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.045] ${frame.position}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <span className="text-[length:var(--text-h2)] text-white">{frame.label}</span>
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-white/70">0{index + 1}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
