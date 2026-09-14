"use client";

import * as React from "react";
import { MagnifyingGlass, Funnel, Storefront, Sparkle } from "@phosphor-icons/react";
import { StoreCard } from "./store-card";
import type { StoreLocation } from "@/server/stores/data";

interface StoresDirectoryClientProps {
  initialStores: StoreLocation[];
}

export function StoresDirectoryClient({ initialStores }: StoresDirectoryClientProps) {
  const [selectedRegion, setSelectedRegion] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const regions = React.useMemo(() => {
    const set = new Set(initialStores.map((s) => s.city));
    return ["all", ...Array.from(set)];
  }, [initialStores]);

  const filteredStores = React.useMemo(() => {
    return initialStores.filter((store) => {
      const matchesRegion = selectedRegion === "all" || store.city === selectedRegion;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        store.name.toLowerCase().includes(q) ||
        store.city.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.amenities.some((a) => a.toLowerCase().includes(q));

      return matchesRegion && matchesSearch;
    });
  }, [initialStores, selectedRegion, searchQuery]);

  return (
    <div>
      {/* Controls Bar: Search & Region Filter Pills */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Region Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {regions.map((region) => {
            const isActive = selectedRegion === region;
            const label = region === "all" ? "All Locations" : region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`rounded-full px-4 py-2 text-[length:var(--text-body-sm)] font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] shadow-md"
                    : "border border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, street or amenity..."
            aria-label="Filter stores"
            className="w-full h-11 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-page)] pl-10 pr-4 text-[length:var(--text-body)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--border-focus)] focus:outline-none"
          />
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length > 0 ? (
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--border-subtle)] p-12 text-center bg-[var(--surface-subtle)]/50">
          <Storefront size={40} className="text-[var(--text-secondary)]" aria-hidden />
          <p className="mt-3 font-medium text-[var(--text-primary)]">No experience centers found</p>
          <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
            Try adjusting your search query or switching to &ldquo;All Locations&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedRegion("all");
              setSearchQuery("");
            }}
            className="mt-4 text-[length:var(--text-body-sm)] font-medium text-[var(--accent-text)] hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* In-Store Experience Callout Banner */}
      <div className="mt-16 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-subtle)_60%,transparent)] p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
              <Sparkle size={20} weight="fill" />
            </div>
            <div>
              <h4 className="font-[family-name:var(--font-display)] text-[length:var(--text-body-lg)] font-semibold text-[var(--text-primary)]">
                Complimentary Morning Ritual Cupping
              </h4>
              <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                Walk into any Bakana Farms flagship to experience freshly steeped Moringa, Honey and Ginger tea, guided by our herbalists.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-page)] px-4 py-2 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] font-semibold text-[var(--accent-text)]">
              Walk-ins Welcome Daily
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
