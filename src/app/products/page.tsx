import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { getAllProducts } from "@/server/catalog/queries";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { formatMoney, cn } from "@/lib/utils";
import { isInStock, isLowStock } from "@/server/catalog/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Products",
  description:
    "The Bakana Farms range, grown and blended on our own farms in Nigeria.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  if (products.length === 0) return <EmptyCatalog />;

  return (
    <main className="container-page pb-(--spacing-section-lg) pt-28 sm:pt-32">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
      />

      <Reveal className="mt-6 max-w-[52ch]">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.1] text-[var(--text-primary)]">
          The range
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          One blend for now, made properly, with more coming as each crop comes
          good.
        </p>
      </Reveal>

      <RevealGroup
        className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),28rem))] gap-x-6 gap-y-12 sm:mt-12"
        stagger={0.07}
      >
        {products.map((product) => {
          const cheapest = product.variants.reduce<
            (typeof product.variants)[number] | null
          >((min, v) => (min === null || v.priceNgn < min.priceNgn ? v : min), null);
          const anyInStock = product.variants.some(isInStock);
          const anyLow = product.variants.some(isLowStock);
          const cover = product.images[0];

          return (
            <RevealItem key={product.id} as="article">
              <Link href={`/products/${product.slug}`} className="group block">
                {cover ? (
                  <div
                    className={cn(
                      "relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)]",
                      cover.isCutout
                        ? "product-image-cutout"
                        : "bg-[var(--surface-subtle)]"
                    )}
                  >
                    <Image
                      src={cover.url}
                      alt={cover.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="product-image object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}

                {!anyInStock ? (
                  <span className="mt-4 inline-flex rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] px-2.5 py-1 text-[length:var(--text-caption)] font-medium text-[var(--text-secondary)]">
                      Sold out
                  </span>
                ) : anyLow ? (
                  <span className="mt-4 inline-flex rounded-[var(--radius-sm)] bg-[var(--state-warning-bg)] px-2.5 py-1 text-[length:var(--text-caption)] font-medium text-[var(--state-warning)]">
                      Low stock
                  </span>
                ) : null}

                <h2 className="mt-5 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold leading-snug text-[var(--text-primary)]">
                  {product.name}
                </h2>
                <p className="mt-1.5 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                  {product.tagline}
                </p>
                {cheapest ? (
                  <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] tabular-nums text-[var(--text-primary)]">
                    from {formatMoney(cheapest.priceNgn, "NGN")}
                  </p>
                ) : null}
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </main>
  );
}

/** Composed empty state, not a bare line of text. */
function EmptyCatalog() {
  return (
    <div className="container-page grid min-h-[60dvh] place-items-center py-(--spacing-section-lg)">
      <div className="max-w-[44ch] text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">
          Nothing is listed yet.
        </h1>
        <p className="mt-4 text-[length:var(--text-body)] leading-relaxed text-[var(--text-secondary)]">
          The first batch is still drying. Leave your email in the footer and we
          will tell you the day it is ready.
        </p>
      </div>
    </div>
  );
}
