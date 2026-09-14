import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllProducts } from "@/server/catalog/queries";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Bakana Farms products.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q?.trim() ?? "";
  const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const products = await getAllProducts();
  const matches = words.length === 0 ? [] : products.filter((product) => {
    const haystack = [product.name, product.tagline, product.description, ...product.ingredients].join(" ").toLocaleLowerCase();
    return words.every((word) => haystack.includes(word));
  });

  return (
    <main className="container-page pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
      />

      <div className="mt-6 max-w-2xl">
        <p className="eyebrow">Find your ritual</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold text-[var(--text-primary)]">Search Bakana.</h1>
      </div>

      <form action="/search" className="mt-8 flex w-full max-w-2xl min-w-0 max-w-full gap-3" role="search">
        <label className="relative flex-1 min-w-0">
          <span className="sr-only">Search products</span>
          <MagnifyingGlass aria-hidden size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Try moringa, ginger, honey, export..."
            className="h-14 w-full min-w-0 max-w-full rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] pl-12 pr-4 text-[length:var(--text-body)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
          />
        </label>
        <button
          type="submit"
          className="h-14 shrink-0 rounded-full bg-[var(--action-primary-bg)] px-7 font-medium text-[var(--action-primary-text)] cursor-pointer hover:bg-[var(--action-primary-bg-hover)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
        >
          Search
        </button>
      </form>

      {query ? <p className="mt-8 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">{matches.length} result{matches.length === 1 ? "" : "s"} for “{query}”.</p> : <p className="mt-8 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">Enter an ingredient or blend name.</p>}

      {matches.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((product) => {
            const variant = product.variants[0];
            const image = product.images[0];
            return (
              <Link key={product.id} href={`/products/${product.slug}`} className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] transition-all hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-subtle)]">
                  {image ? <Image src={image.url} alt={image.alt} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : null}
                </div>
                <div className="p-5">
                  <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)]">{product.name}</h2>
                  <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">{product.tagline}</p>
                  {variant ? <p className="mt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-body-sm)] font-semibold text-[var(--text-primary)]">{formatMoney(variant.priceNgn, "NGN")}</p> : null}
                </div>
              </Link>
            );
          })}
        </div>
      ) : query ? (
        <div className="mt-8">
          <EmptyState
            title="No matching products found"
            description={`We couldn't find anything matching "${query}". Try searching for moringa, honey, ginger, or tea.`}
            action={{
              label: "View all products",
              href: "/products",
            }}
          />
        </div>
      ) : null}
    </main>
  );
}
