"use client";

import * as React from "react";
import { MapPin, NavigationArrow, ArrowSquareOut, Plus, Minus } from "@phosphor-icons/react";
import type { StoreLocation } from "@/server/stores/data";

interface StoreMapProps {
  store: StoreLocation;
  className?: string;
}

/**
 * Interactive Store Map.
 *
 * Implements the split-view map panel seen in the Sneako Framer design.
 * Uses a privacy-preserving, self-contained OpenStreetMap embed centered
 * on the exact coordinates, with custom Bakana UI overlays, zoom controls,
 * and direct one-click route calculation to Google Maps.
 */
export function StoreMap({ store, className }: StoreMapProps) {
  const [zoomOffset, setZoomOffset] = React.useState(0);
  const { lat, lng } = store.coordinates;

  // Compute a bounding box around the coordinates adjusted by zoom
  const delta = Math.max(0.003, 0.012 * Math.pow(0.5, zoomOffset));
  const bbox = [
    (lng - delta * 1.5).toFixed(5),
    (lat - delta).toFixed(5),
    (lng + delta * 1.5).toFixed(5),
    (lat + delta).toFixed(5),
  ].join("%2C");

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className={`relative size-full min-h-[380px] lg:min-h-[640px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] shadow-sm ${className ?? ""}`}>
      {/* Map Iframe */}
      <iframe
        title={`Map location for ${store.name}`}
        src={embedUrl}
        className="size-full border-0 grayscale-[15%] contrast-[105%]"
        loading="lazy"
      />

      {/* Floating Directions & Pin Pill */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-page)_90%,transparent)] px-3.5 py-1.5 backdrop-blur-md shadow-md">
          <MapPin size={18} weight="fill" className="text-[var(--accent-text)]" aria-hidden />
          <span className="font-medium text-[length:var(--text-body-sm)] text-[var(--text-primary)]">
            {store.city}
          </span>
          <span className="h-3 w-px bg-[var(--border-subtle)]" />
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
            {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
          </span>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--action-primary-bg)] px-4 py-2 text-[length:var(--text-body-sm)] font-medium text-[var(--action-primary-text)] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <NavigationArrow size={16} weight="bold" />
          <span>Get Directions</span>
          <ArrowSquareOut size={14} className="opacity-70" />
        </a>
      </div>

      {/* Zoom Control Cluster */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={() => setZoomOffset((z) => Math.min(z + 1, 3))}
          aria-label="Zoom in"
          className="flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-page)_92%,transparent)] text-[var(--text-primary)] backdrop-blur-md shadow-md transition-colors hover:bg-[var(--surface-subtle)]"
        >
          <Plus size={16} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => setZoomOffset((z) => Math.max(z - 1, -2))}
          aria-label="Zoom out"
          className="flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-page)_92%,transparent)] text-[var(--text-primary)] backdrop-blur-md shadow-md transition-colors hover:bg-[var(--surface-subtle)]"
        >
          <Minus size={16} weight="bold" />
        </button>
      </div>

      {/* Map attribution footnote */}
      <div className="absolute bottom-2 left-3 pointer-events-none">
        <span className="rounded px-1.5 py-0.5 text-[9px] font-[family-name:var(--font-mono)] text-[var(--text-secondary)]/70 bg-[var(--surface-page)]/80 backdrop-blur-sm">
          © OpenStreetMap contributors
        </span>
      </div>
    </div>
  );
}
