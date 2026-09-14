import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  EnvelopeSimple,
  CheckCircle,
  Tag,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { StoreMap } from "@/components/stores/store-map";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { getStoreBySlug, getStoreSlugs } from "@/server/stores/data";

interface StoreDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getStoreSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StoreDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = getStoreBySlug(slug);
  if (!store) return { title: "Store Not Found" };

  return {
    title: `${store.name} | Bakana Farms`,
    description: store.description,
    openGraph: {
      title: `${store.name} | Bakana Farms`,
      description: store.description,
      images: [{ url: store.image.url, alt: store.image.alt }],
    },
  };
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;

  return (
    <main className="container-page min-h-screen pt-28 sm:pt-32 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Stores", href: "/stores" },
          { label: store.name },
        ]}
      />

      {/* Top Back Button */}
      <div className="mt-4 flex items-center justify-between">
        <Link
          href="/stores"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-2 text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>Back to stores</span>
        </Link>

        {store.badge ? (
          <span className="rounded-full bg-[var(--accent-line)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[var(--action-primary-bg)]">
            {store.badge}
          </span>
        ) : null}
      </div>

      {/* Split Grid: Left Details & Right Map (modeled after Sneako) */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1.35fr] lg:gap-12">
        {/* Left Column: Store Details Card */}
        <div className="flex flex-col space-y-6">
          {/* Storefront Photography */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] shadow-sm">
            <Image
              src={store.image.url}
              alt={store.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          {/* Title & Street Address */}
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-semibold leading-tight text-[var(--text-primary)]">
              {store.name}
            </h1>
            <p className="mt-2 text-[length:var(--text-body)] text-[var(--text-secondary)]">
              {store.address}
            </p>
          </div>

          {/* Framer-Style Hours & Phone Info Card (Matches Sneako screenshot) */}
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]/70 p-5 shadow-sm backdrop-blur-sm">
            {/* Opens */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)]">
                Opens
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">
                {store.hours.opens}
              </span>
            </div>

            <div className="h-px w-full bg-[var(--border-subtle)]" />

            {/* Closes */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)]">
                Closes
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">
                {store.hours.closes}
              </span>
            </div>

            <div className="h-px w-full bg-[var(--border-subtle)]" />

            {/* Phone */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)]">
                Phone
              </span>
              <a
                href={`tel:${store.phone.replace(/[^0-9+]/g, "")}`}
                className="group inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] font-medium text-[var(--accent-text)] transition-colors hover:underline"
              >
                <span>{store.phone}</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="h-px w-full bg-[var(--border-subtle)]" />

            {/* Email */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)]">
                Email
              </span>
              <a
                href={`mailto:${store.email}`}
                className="font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] text-[var(--text-primary)] hover:underline"
              >
                {store.email}
              </a>
            </div>
          </div>

          {/* In-Store Amenities & Services */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
              Store Services & Amenities
            </h3>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {store.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-[length:var(--text-body-sm)] text-[var(--text-primary)]"
                >
                  <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--accent-text)]" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="border-t border-[var(--border-subtle)] pt-5">
            <p className="text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
              {store.description}
            </p>
          </div>
        </div>

        {/* Right Column: Full-Height Interactive Map */}
        <div className="flex flex-col">
          <StoreMap store={store} className="h-full min-h-[440px] lg:min-h-[640px]" />
        </div>
      </div>

      {/* Sneako-Style Bottom Promotion Banner */}
      <div className="mt-12 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--accent-line)]/40 bg-[var(--surface-subtle)] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-line)]/20 text-[var(--accent-text)]">
              <Tag size={20} weight="bold" />
            </div>
            <div>
              <p className="font-semibold text-[length:var(--text-body)] text-[var(--text-primary)]">
                {store.inStoreOffer ?? "Get a 10% discount when purchasing direct in-store."}
              </p>
              <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                Valid for both individual 20-sachet retail packs and commercial wholesale cartons.
              </p>
            </div>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--action-primary-bg)] px-5 py-2.5 text-[length:var(--text-body-sm)] font-medium text-[var(--action-primary-text)] shadow-md transition-transform hover:scale-[1.02]"
          >
            <span>Navigate to Store</span>
            <ArrowRight size={15} weight="bold" />
          </a>
        </div>
      </div>
    </main>
  );
}
