"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CatalogImage } from "@/server/catalog/types";

type ProductVideo = {
  url: string;
  label: string;
  poster: string;
};

type ProductMedia =
  | ({ kind: "image" } & CatalogImage)
  | ({ kind: "video" } & ProductVideo);

/**
 * Product gallery.
 *
 * Below md it is a native scroll-snap carousel: real scrolling
 * rather than a JS-driven slider, so it keeps momentum, works with
 * a keyboard, and costs nothing on the interaction path. Above md
 * it becomes a thumbnail rail plus a main frame.
 *
 * Every frame reserves its aspect ratio before the image loads.
 * This is the single largest CLS risk on the site.
 */
export function ProductGallery({
  images,
  videos = [],
  productName,
}: {
  images: CatalogImage[];
  videos?: ProductVideo[];
  productName: string;
}) {
  const media: ProductMedia[] = [
    ...images.map((image) => ({ kind: "image" as const, ...image })),
    ...videos.map((video) => ({ kind: "video" as const, ...video })),
  ];
  const [active, setActive] = React.useState(0);
  const current = media[active] ?? media[0];

  if (!current) return null;

  return (
    <div className="lg:sticky lg:top-24">
      {/* Mobile: scroll-snap strip */}
      <div
        className="scroll-x -mx-(--spacing-gutter) flex snap-x snap-mandatory gap-3 px-(--spacing-gutter) md:hidden"
        role="region"
        aria-label={`${productName} media gallery`}
      >
        {media.map((item, i) => (
          <div
            key={item.url}
            className={cn(
              "relative aspect-[4/5] w-[86%] shrink-0 snap-center overflow-hidden rounded-[var(--radius-lg)] sm:w-[72%]",
              item.kind === "image" && item.isCutout ? "product-image-cutout" : "bg-[var(--surface-subtle)]"
            )}
          >
            {item.kind === "image" ? (
              <Image src={item.url} alt={item.alt} fill priority={i === 0} sizes="86vw" className="product-image object-cover" />
            ) : (
              <video controls playsInline preload="metadata" poster={item.poster} className="size-full object-cover" aria-label={item.label}>
                <source src={item.url} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: main frame plus rail */}
      <div className="hidden gap-4 md:grid md:grid-cols-[auto_1fr]">
        <div className="flex flex-col gap-3">
          {media.map((item, i) => (
            <button
              key={item.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${item.kind} ${i + 1} of ${media.length}`}
              aria-current={i === active}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] transition-all duration-[220ms]",
                "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
                item.kind === "image" && item.isCutout
                  ? "product-image-cutout"
                  : "bg-[var(--surface-subtle)]",
                i === active
                  ? "ring-2 ring-[var(--accent-line)]"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image src={item.kind === "image" ? item.url : item.poster} alt="" fill sizes="64px" className="product-image object-cover" />
              {item.kind === "video" ? <span aria-hidden className="absolute inset-0 grid place-items-center bg-black/25 text-xs font-semibold text-white">PLAY</span> : null}
            </button>
          ))}
        </div>

        <div
          className={cn(
            "relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)]",
            current.kind === "image" && current.isCutout
              ? "product-image-cutout"
              : "bg-[var(--surface-subtle)]"
          )}
        >
          {current.kind === "image" ? (
            <Image key={current.url} src={current.url} alt={current.alt} fill priority sizes="(max-width: 1024px) 60vw, 45vw" className="product-image object-cover" />
          ) : (
            <video key={current.url} controls playsInline preload="metadata" poster={current.poster} className="size-full object-cover" aria-label={current.label}>
              <source src={current.url} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
