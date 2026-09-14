"use client";

import * as React from "react";
import Image from "next/image";
import { Play, X, ArrowsOutSimple, FilmStrip, Camera, Package } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type MediaCategory = "all" | "photo" | "video" | "packaging";

interface MediaItem {
  id: string;
  title: string;
  category: "photo" | "video" | "packaging";
  categoryLabel: string;
  type: "image" | "video";
  src: string;
  thumbnail: string;
  caption: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "m-1",
    title: "The Full Ritual Composition",
    category: "photo",
    categoryLabel: "Photography",
    type: "image",
    src: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
    thumbnail: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
    caption:
      "Bakana Farms single-origin tea box surrounded by fresh moringa foliage, raw wild honey, and natural ginger roots.",
  },
  {
    id: "m-2",
    title: "Estate Ritual & Harvest Film",
    category: "video",
    categoryLabel: "Film & Motion",
    type: "video",
    src: "/videos/bakana-hero-film.mp4",
    thumbnail: "/images/bakana-hero-product-8k.webp",
    caption:
      "Cinematic study capturing the quiet morning clarity of botanical harvesting in Rivers State, Nigeria.",
  },
  {
    id: "m-3",
    title: "Twenty Moisture-Barrier Sachets",
    category: "packaging",
    categoryLabel: "Packaging Study",
    type: "image",
    src: "/images/bakana-open-box-honey-8k.webp",
    thumbnail: "/images/bakana-open-box-honey-8k.webp",
    caption:
      "Precision-sealed individual envelopes designed to shield active botanical oils from tropical humidity.",
  },
  {
    id: "m-4",
    title: "The Steeping Demonstration Film",
    category: "video",
    categoryLabel: "Film & Motion",
    type: "video",
    src: "/videos/bakana-product-film.mp4",
    thumbnail: "/images/bakana-open-box-8k.webp",
    caption:
      "Step-by-step unboxing and water infusion showing the natural golden amber color release.",
  },
  {
    id: "m-5",
    title: "Single-Estate Master Box Front",
    category: "packaging",
    categoryLabel: "Packaging Study",
    type: "image",
    src: "/images/bakana-hero-product-8k.webp",
    thumbnail: "/images/bakana-hero-product-8k.webp",
    caption:
      "Export grade carton finishing with gold foil embossing and NAFDAC compliance panels.",
  },
  {
    id: "m-6",
    title: "Harvest Tray & Botanical Details",
    category: "photo",
    categoryLabel: "Photography",
    type: "image",
    src: "/images/bakana-open-box-8k.webp",
    thumbnail: "/images/bakana-open-box-8k.webp",
    caption:
      "Close inspection of dried organic leaves and whole botanical components prior to batch encapsulation.",
  },
];

const TABS: { key: MediaCategory; label: string; icon?: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "all", label: "All Media" },
  { key: "photo", label: "Photography", icon: Camera },
  { key: "video", label: "Film & Motion", icon: FilmStrip },
  { key: "packaging", label: "Packaging Study", icon: Package },
];

export function GalleryClient() {
  const [selectedCategory, setSelectedCategory] = React.useState<MediaCategory>("all");
  const [activeItem, setActiveItem] = React.useState<MediaItem | null>(null);

  // Close lightbox on Escape
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveItem(null);
      }
    }
    if (activeItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem]);

  const filteredItems = selectedCategory === "all"
    ? MEDIA_ITEMS
    : MEDIA_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="mt-10">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => {
          const isActive = selectedCategory === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedCategory(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[length:var(--text-body-sm)] font-medium transition-colors duration-150 cursor-pointer",
                isActive
                  ? "bg-[var(--surface-inverse)] text-[var(--text-inverse)] shadow-xs"
                  : "border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              )}
            >
              {Icon && <Icon size={16} aria-hidden />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => setActiveItem(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveItem(item);
              }
            }}
            className="glass-card group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-line)] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
          >
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges and icons */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="rounded-full bg-black/60 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
                {item.categoryLabel}
              </span>
            </div>

            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play size={20} weight="fill" />
                </div>
              </div>
            )}

            {/* Caption bar */}
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-body)] font-semibold leading-snug drop-shadow-sm">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[length:var(--text-caption)] text-white/80">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/20 bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-2xl"
            >
              {/* Media viewer */}
              <div className="relative aspect-[16/10] w-full bg-black">
                {activeItem.type === "video" ? (
                  <video
                    src={activeItem.src}
                    controls
                    autoPlay
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={activeItem.src}
                    alt={activeItem.title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                )}
              </div>

              {/* Modal footer */}
              <div className="flex items-start justify-between p-5 sm:p-6">
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--accent-text)] font-semibold">
                    {activeItem.categoryLabel}
                  </span>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold">
                    {activeItem.title}
                  </h2>
                  <p className="mt-2 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                    {activeItem.caption}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  aria-label="Close media preview"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--surface-subtle)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
