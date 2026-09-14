import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { getJournalArticles } from "@/server/cms/sanity";
import { NewspaperClipping, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Journal",
  description: "Bakana Farms field notes, botanical harvest insights, and herbal brewing guides.",
};

export default async function JournalPage() {
  const articles = await getJournalArticles();

  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Journal" },
        ]}
      />

      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Field Notes & Stories
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          Farm stories need evidence.
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          Documenting the cultivation of moringa, regional beekeeping, and ginger processing in Rivers State, Nigeria.
        </p>
      </div>

      {articles.length ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article._id}>
              <Link
                href={`/journal/${article.slug}`}
                className="glass-card group flex h-full flex-col justify-between rounded-[var(--radius-lg)] p-6 transition-all duration-200 hover:border-[var(--accent-line)]"
              >
                <div>
                  <time className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-text)]">
                    {new Date(article.publishedAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-medium text-[var(--text-accent)]">
                  <span>Read note</span>
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 max-w-2xl">
          <EmptyState
            icon={NewspaperClipping}
            title="Editorial dispatches are in preparation"
            description="Our first batch of farm journal entries, agronomic photography, and botanical profiles is currently in editorial review."
            action={{
              label: "Explore our story",
              href: "/our-story",
            }}
          />
        </div>
      )}
    </main>
  );
}
