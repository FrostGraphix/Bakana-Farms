import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "@/components/product/product-gallery";
import { BuyBox } from "@/components/product/buy-box";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { getProductBySlug, getProductSlugs } from "@/server/catalog/queries";
import { cn, formatMoney } from "@/lib/utils";
import { isInStock } from "@/server/catalog/types";
import { Buildings, ArrowRight, Storefront } from "@phosphor-icons/react/dist/ssr";

export const revalidate = 300;

export async function generateStaticParams() {
  /**
   * A database that is unreachable at BUILD time degrades to
   * on-demand rendering rather than failing the deploy. Prerender
   * is an optimisation here, not a correctness requirement, and a
   * transient connection blip should not take the site down.
   */
  try {
    const slugs = await getProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.warn(
      "generateStaticParams: catalogue unreachable, falling back to on-demand rendering.",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} | Bakana Farms`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Bakana Farms`,
      description: product.description,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const primary = product.variants[0];

  return (
    <>
      {/* Product structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images.map((i) => i.url),
            brand: { "@type": "Brand", name: "Bakana Farms" },
            countryOfOrigin: product.countryOfOrigin,
            offers: product.variants.map((v) => ({
              "@type": "Offer",
              sku: v.sku,
              price: (v.priceNgn / 100).toFixed(2),
              priceCurrency: "NGN",
              availability: isInStock(v)
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            })),
          }),
        }}
      />

      <article className="container-page mobile-sticky-clear pt-28 sm:pt-32 pb-16 lg:pb-(--spacing-section-lg)">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name },
          ]}
          className="mb-6"
        />

        {/* Main Sneako-Inspired Split Product Grid */}
        <div
          className={cn(
            "grid gap-10 lg:gap-16",
            product.images.length > 0 && "lg:grid-cols-[1.1fr_1fr]"
          )}
        >
          {/* Media Showcase */}
          {product.images.length > 0 ? (
            <ProductGallery
              images={product.images}
              videos={[
                {
                  url: "/videos/bakana-product-film.mp4",
                  label: `${product.name} product film`,
                  poster: product.images[0]?.url ?? "/images/bakana-open-box-honey-8k.webp",
                },
                {
                  url: "/videos/bakana-hero-film.mp4",
                  label: `${product.name} ritual film`,
                  poster: product.images[1]?.url ?? product.images[0]?.url ?? "/images/bakana-open-box-honey-8k.webp",
                },
              ]}
              productName={product.name}
            />
          ) : null}

          {/* Buy Box & Narrative Panel */}
          <div className="max-w-[42rem]">
            <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--text-primary)]">
              {product.name}
            </h1>
            <p className="mt-2 text-[length:var(--text-body-lg)] text-[var(--text-secondary)]">
              {product.tagline}
            </p>

            <div className="mt-6">
              <BuyBox product={product} />
            </div>

            {/* B2B / Wholesale Master Carton Cross-Sell */}
            <div className="mt-10 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]/60 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-page)] text-[var(--accent-text)] shadow-sm">
                  <Buildings size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[length:var(--text-body)] text-[var(--text-primary)]">
                    Commercial Hospitality & Export Pallets
                  </h3>
                  <p className="mt-1 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                    Purchasing for high-end wellness spas, corporate gift programs, or international retail distribution? We provide custom export master cartons and wholesale pricing tiers.
                  </p>
                  <Link
                    href="/wholesale"
                    className="mt-3 inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-semibold text-[var(--accent-text)] hover:underline"
                  >
                    <span>Request B2B commercial terms</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* In-Person Store Experience Card */}
            <div className="mt-4 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]/40 p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-page)] text-[var(--text-primary)] shadow-sm">
                  <Storefront size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[length:var(--text-body)] text-[var(--text-primary)]">
                    In-Person Tea Tasting Pavilions
                  </h3>
                  <p className="mt-1 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                    Experience our fresh harvest cupping at our Victoria Island Experience Center, Rivers State Estate Pavilion, or Maitama Flagship.
                  </p>
                  <Link
                    href="/stores"
                    className="mt-3 inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)] hover:underline"
                  >
                    <span>Explore store locations & maps</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {primary ? <StickyBuyBar name={product.name} priceNgn={primary.priceNgn} /> : null}
    </>
  );
}

/**
 * Mobile sticky buy bar.
 *
 * Ensures customers on mobile can immediately access the purchase CTA
 * without scrolling all the way back up. Clears iOS safe-area inset.
 */
function StickyBuyBar({ name, priceNgn }: { name: string; priceNgn: number }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[15] border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-page)_92%,transparent)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">
            {name}
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] tabular-nums text-[var(--text-secondary)]">
            from {formatMoney(priceNgn, "NGN")}
          </p>
        </div>
        <a
          href="#main"
          className="shrink-0 rounded-[var(--radius-md)] bg-[var(--action-primary-bg)] px-5 py-2.5 text-[length:var(--text-body-sm)] font-semibold text-[var(--action-primary-text)] shadow-md"
        >
          Select & Buy
        </a>
      </div>
    </div>
  );
}
