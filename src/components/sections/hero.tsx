"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/motion";

export function Hero() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.14]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const fade = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section ref={sectionRef} className="cinematic-hero relative -mt-20 min-h-[100svh] overflow-hidden bg-[var(--scene-bg)] text-[var(--scene-text)]">
      <motion.div aria-hidden style={reduce ? undefined : { y: imageY, scale: imageScale }} className="absolute inset-0">
        <video
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/bakana-moringa-honey-ginger-hero-8k.webp"
          className="size-full object-cover object-[63%_center] sm:object-center"
        >
          <source src="/videos/bakana-hero-film.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,13,.94)_0%,rgba(10,18,13,.72)_43%,rgba(10,18,13,.12)_75%),linear-gradient(0deg,rgba(10,18,13,.76)_0%,transparent_45%)]" />
      <div aria-hidden className="hero-aurora absolute -left-[18rem] top-[15%] size-[44rem] rounded-full bg-[color-mix(in_srgb,var(--scene-accent)_20%,transparent)] blur-[110px]" />

      <motion.div style={reduce ? undefined : { y: copyY, opacity: fade }} className="container-page relative flex min-h-[100svh] flex-col justify-end pb-10 pt-36 sm:pb-14 lg:justify-center lg:pb-20">
        <motion.p initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE.brand }} className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--scene-accent)]">
          Grown with intention
        </motion.p>
        <h1 className="mt-5 max-w-[10ch] font-[family-name:var(--font-display)] text-[clamp(3.4rem,8.2vw,8.9rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-[var(--scene-text)]">
          <HeroLine delay={0.08}>Steep the</HeroLine>
          <HeroLine delay={0.16} accent>goodness.</HeroLine>
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48, duration: 0.7, ease: EASE.brand }} className="mt-8 flex max-w-[34rem] flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[29ch] text-[length:var(--text-body-lg)] leading-relaxed text-[var(--scene-muted)]">Moringa, honey and ginger tea. A warmer daily ritual.</p>
          <Button size="lg" className="border border-[color-mix(in_srgb,var(--scene-accent)_45%,transparent)] bg-[var(--scene-text)] text-[var(--scene-bg)] hover:bg-[var(--surface-raised)]" asChild>
            <Link href="/products" className="group">Shop Bakana <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} aria-hidden /></Link>
          </Button>
        </motion.div>
        <div className="mt-12 flex items-center justify-between border-t border-white/20 pt-5 lg:absolute lg:inset-x-[max(clamp(1.25rem,.11rem+4.862vw,4rem),env(safe-area-inset-left,0px))] lg:bottom-9 lg:mt-0">
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--scene-text)_65%,transparent)]">Scroll to discover</span>
          <ArrowDown className="hero-float text-[var(--scene-accent)]" size={20} aria-hidden />
        </div>
      </motion.div>
    </section>
  );
}

function HeroLine({ children, delay, accent = false }: { children: React.ReactNode; delay: number; accent?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className={accent ? "block italic text-[var(--scene-accent)]" : "block"} initial={reduce ? false : { y: "110%", rotate: 2 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.95, delay, ease: EASE.brand }}>
        {children}
      </motion.span>
    </span>
  );
}
