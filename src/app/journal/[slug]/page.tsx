import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import {
  getJournalArticle,
  getJournalArticles,
} from "@/server/cms/sanity";

export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await getJournalArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getJournalArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getJournalArticle(slug);
  if (!article) notFound();

  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/journal" },
          { label: article.title },
        ]}
      />

      <article className="mx-auto mt-8 max-w-[70ch]">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={16} aria-hidden />
          <span>Back to journal</span>
        </Link>

        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Field Dispatch
        </span>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] sm:text-[length:var(--text-display-lg)] font-semibold leading-tight text-[var(--text-primary)]">
          {article.title}
        </h1>

        <time className="mt-4 block font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-text)]">
          {new Date(article.publishedAt).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>

        <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-8">
          {article.excerpt}
        </p>

        {article.body ? (
          <div className="mt-8 space-y-6 leading-relaxed text-[var(--text-secondary)] [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-[length:var(--text-h2)] [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)] [&_a]:text-[var(--text-accent)] [&_a]:underline">
            <PortableText value={article.body} />
          </div>
        ) : null}
      </article>
    </main>
  );
}
