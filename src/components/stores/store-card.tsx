import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Phone, ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import type { StoreLocation } from "@/server/stores/data";

export function StoreCard({ store }: { store: StoreLocation }) {
  return (
    <article className="glass-card group flex flex-col overflow-hidden rounded-[var(--radius-xl)] transition-all duration-300 hover:border-[var(--accent-line)]/50 hover:shadow-xl">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-subtle)]">
        <Image
          src={store.image.url}
          alt={store.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {store.badge ? (
            <span className="rounded-full bg-[var(--accent-line)] px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[var(--action-primary-bg)] shadow-sm">
              {store.badge}
            </span>
          ) : <span />}

          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open Today
          </span>
        </div>

        {/* City Overlay */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--accent-line)]">
            {store.city} · {store.country}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--text-accent)]">
          {store.name}
        </h3>

        <div className="mt-4 grid gap-2.5 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--accent-text)]" aria-hidden />
            <span className="leading-snug">{store.address}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock size={16} className="shrink-0 text-[var(--accent-text)]" aria-hidden />
            <span>{store.hours.days}: {store.hours.opens} – {store.hours.closes}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone size={16} className="shrink-0 text-[var(--accent-text)]" aria-hidden />
            <span>{store.phone}</span>
          </div>
        </div>

        {/* Amenities Pills */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {store.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]"
            >
              <CheckCircle size={12} className="text-[var(--accent-text)]" />
              {amenity}
            </span>
          ))}
          {store.amenities.length > 3 && (
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-2 py-1 text-[11px] text-[var(--text-secondary)]">
              +{store.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
          <Link
            href={`/stores/${store.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--action-primary-bg)] px-4 py-3 text-[length:var(--text-body-sm)] font-medium text-[var(--action-primary-text)] transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>View Store & Map</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </article>
  );
}
