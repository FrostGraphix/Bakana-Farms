"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  Play,
  Pause,
} from "@phosphor-icons/react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface VideoSlide {
  id: string;
  chapter: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  ctaText: string;
  ctaHref: string;
}

const SLIDES: VideoSlide[] = [
  {
    id: "provenance",
    chapter: "01",
    eyebrow: "Grown with Intention",
    title: "Steep the",
    highlight: "goodness.",
    description:
      "Hand-harvested Nigerian Moringa leaves, cold-filtered wildflower honey, and warming ginger blended for daily vitality.",
    videoSrc: "/videos/bakana-hero-film.mp4",
    posterSrc: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
    ctaText: "Shop the collection",
    ctaHref: "/products",
  },
  {
    id: "craft",
    chapter: "02",
    eyebrow: "Crafted for Freshness",
    title: "Measured",
    highlight: "moments.",
    description:
      "Twenty individually wrapped pyramid sachets designed to protect pure botanicals from moisture and light.",
    videoSrc: "/videos/bakana-product-film.mp4",
    posterSrc: "/images/bakana-open-box-honey-8k.webp",
    ctaText: "Explore our blend",
    ctaHref: "/sourcing",
  },
  {
    id: "ritual",
    chapter: "03",
    eyebrow: "Trade & Heritage",
    title: "Rooted in",
    highlight: "Bakana.",
    description:
      "Grown for shelves worldwide. Export-grade packaging meeting international phytosanitary and retail standards.",
    videoSrc: "/videos/bakana-hero-film.mp4",
    posterSrc: "/images/bakana-hero-product-8k.webp",
    ctaText: "Wholesale enquiries",
    ctaHref: "/wholesale",
  },
];

const AUTO_INTERVAL_MS = 8000;

export function VideoCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = React.useRef<number | null>(null);
  const reduce = useReducedMotion();

  const fallbackSlide: VideoSlide = SLIDES[0] ?? {
    id: "fallback",
    chapter: "01",
    eyebrow: "Grown with Intention",
    title: "Steep the",
    highlight: "goodness.",
    description: "Moringa, honey and ginger tea.",
    videoSrc: "/videos/bakana-hero-film.mp4",
    posterSrc: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
    ctaText: "Shop Bakana",
    ctaHref: "/products",
  };
  const currentSlide: VideoSlide = SLIDES[activeIndex] ?? fallbackSlide;

  const goToSlide = React.useCallback((index: number) => {
    setActiveIndex((index + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const nextSlide = React.useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const prevSlide = React.useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Handle timer progression
  React.useEffect(() => {
    if (!isPlaying || reduce) return;

    const interval = 50;
    const increment = (interval / AUTO_INTERVAL_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, reduce, nextSlide]);

  // Synchronize video playback with active slide
  React.useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex && isPlaying && !reduce) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Browser autoplay policy graceful fallback
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isPlaying, reduce]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    const firstTouch = e.touches[0];
    if (firstTouch) {
      touchStartX.current = firstTouch.clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) {
      nextSlide();
    } else if (diffX < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Bakana Farms Experience Showcase"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="cinematic-hero relative min-h-[92svh] sm:min-h-[100svh] overflow-hidden bg-[var(--scene-bg)] text-[var(--scene-text)]"
    >
      {/* Background Videos with Crossfade */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              idx === activeIndex ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            <video
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              muted
              loop
              playsInline
              preload={idx === 0 ? "auto" : "metadata"}
              poster={slide.posterSrc}
              className="size-full object-cover object-[60%_center] sm:object-center"
            >
              <source src={slide.videoSrc} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>

      {/* Atmospheric Overlays */}
      <div
        aria-hidden
        className="absolute inset-0 z-2 bg-[linear-gradient(90deg,rgba(10,18,13,0.92)_0%,rgba(10,18,13,0.72)_48%,rgba(10,18,13,0.2)_82%),linear-gradient(0deg,rgba(10,18,13,0.8)_0%,transparent_50%)]"
      />
      <div
        aria-hidden
        className="hero-aurora absolute -left-[16rem] top-[18%] size-[42rem] rounded-full bg-[color-mix(in_srgb,var(--scene-accent)_18%,transparent)] blur-[120px] z-2"
      />

      {/* Content Container */}
      <div className="container-page relative z-3 flex min-h-[92svh] sm:min-h-[100svh] flex-col justify-end pb-12 pt-32 sm:pb-16 sm:pt-40 lg:justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE.brand }}
            className="max-w-[42rem]"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--scene-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--scene-bg)_65%,transparent)] px-3.5 py-1 text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--scene-accent)] backdrop-blur-md">
              <span>Chapter {currentSlide.chapter}</span>
              <span className="opacity-40">•</span>
              <span>{currentSlide.eyebrow}</span>
            </div>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,7.5vw,7.8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-[var(--scene-text)]">
              {currentSlide.title}{" "}
              <span className="italic text-[var(--scene-accent)]">
                {currentSlide.highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-[34ch] text-[length:var(--text-body-lg)] leading-relaxed text-[var(--scene-muted)]">
              {currentSlide.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="border border-[color-mix(in_srgb,var(--scene-accent)_40%,transparent)] bg-[var(--scene-text)] text-[var(--scene-bg)] hover:bg-[var(--surface-raised)]"
                asChild
              >
                <Link href={currentSlide.ctaHref} className="group">
                  {currentSlide.ctaText}{" "}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="border border-[color-mix(in_srgb,var(--scene-text)_30%,transparent)] bg-transparent text-[var(--scene-text)] hover:bg-[color-mix(in_srgb,var(--scene-text)_10%,transparent)]"
                asChild
              >
                <Link href="/our-story">Our story</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Bottom Control Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 sm:mt-16">
          {/* Slide Chapter Indicators */}
          <div className="flex items-center gap-3">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.eyebrow}`}
                className="group relative flex flex-col items-start gap-1 text-left"
              >
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--scene-muted)] transition-colors group-hover:text-[var(--scene-text)]">
                  {slide.chapter}
                </span>
                <div className="relative h-1 w-10 sm:w-16 rounded-full bg-white/20 overflow-hidden">
                  {idx === activeIndex && (
                    <div
                      className="absolute inset-y-0 left-0 bg-[var(--scene-accent)] transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  {idx < activeIndex && (
                    <div className="absolute inset-0 bg-[var(--scene-accent)]/80" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Pill Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause video slideshow" : "Play video slideshow"}
              className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-[var(--scene-text)] backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause size={14} weight="bold" aria-hidden />
              ) : (
                <Play size={14} weight="bold" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous chapter"
              className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-[var(--scene-text)] backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <CaretLeft size={16} aria-hidden />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next chapter"
              className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-[var(--scene-text)] backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <CaretRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
