import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { getJournalArticles } from "@/server/cms/sanity";
import {
  Megaphone,
  FileText,
  NewspaperClipping,
  CalendarBlank,
  Sparkle,
  ImageSquare,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Updates & Media",
  description:
    "Company announcements, agricultural case studies, press releases, events, celebrations, and media from Bakana Farms.",
};

export const CATEGORIES = [
  { slug: "all", label: "All Updates", href: "/updates" },
  { slug: "announcements", label: "Announcements", href: "/updates/category/announcements", icon: Megaphone },
  { slug: "case-studies", label: "Case Studies", href: "/updates/category/case-studies", icon: FileText },
  { slug: "press-releases", label: "Press Releases", href: "/updates/category/press-releases", icon: NewspaperClipping },
  { slug: "events", label: "Events", href: "/updates/category/events", icon: CalendarBlank },
  { slug: "celebrations", label: "Celebrations", href: "/updates/category/celebrations", icon: Sparkle },
  { slug: "gallery", label: "Media Gallery", href: "/updates/gallery", icon: ImageSquare },
] as const;

export const FEATURED_UPDATES = [
  {
    id: "announcement-1",
    title: "Estate Harvest & Global Export Corridor Launch",
    category: "announcements",
    categoryLabel: "Announcements",
    date: "2026-09-01",
    excerpt:
      "Bakana Farms formalises dedicated export distribution pathways across West Africa and international trade desks with single-origin botanical tracing.",
    href: "/updates/category/announcements",
  },
  {
    id: "case-study-1",
    title: "Moringa Intercropping & Soil Nutrient Recovery in Rivers State",
    category: "case-studies",
    categoryLabel: "Case Studies",
    date: "2026-08-18",
    excerpt:
      "A field analysis documenting leaf yield, organic microbial vitality, and sustainable bee foraging cycles across our estate groves.",
    href: "/updates/category/case-studies",
  },
  {
    id: "press-release-1",
    title: "Official Statement on Export Packaging Quality Assurance",
    category: "press-releases",
    categoryLabel: "Press Releases",
    date: "2026-08-04",
    excerpt:
      "Bakana Farms confirms batch integrity and triple-sealed moisture barrier sachets designed for maritime and airfreight export stability.",
    href: "/updates/category/press-releases",
  },
  {
    id: "event-1",
    title: "African Agro-Allied Trade Fair & Tasting Pavilion",
    category: "events",
    categoryLabel: "Events",
    date: "2026-07-22",
    excerpt:
      "Showcasing cold-filtered honey infusions and warming ginger blends to trade delegates and specialty buyers in Lagos and London.",
    href: "/updates/category/events",
  },
  {
    id: "celebration-1",
    title: "Celebrating Estate Expansion & Community Farm Partnerships",
    category: "celebrations",
    categoryLabel: "Celebrations",
    date: "2026-06-30",
    excerpt:
      "Marking key milestones with regional beekeepers, harvesters, and our cultivation team who make the daily ritual possible.",
    href: "/updates/category/celebrations",
  },
  {
    id: "gallery-feature",
    title: "Visual Archive: Sun, Soil, and the Twenty-Sachet Ritual",
    category: "gallery",
    categoryLabel: "Media Gallery",
    date: "2026-06-12",
    excerpt:
      "Explore high-resolution photography and films capturing botanical harvesting, drying racks, and the art of morning clarity.",
    href: "/updates/gallery",
  },
];

export default async function UpdatesPage() {
  const sanityArticles = await getJournalArticles();

  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Updates & Media" },
        ]}
      />

      {/* Header */}
      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          News, Notes & Visual Archive
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          Updates & Media
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          Company announcements, agricultural case studies, official press releases, upcoming events, and photographic archives from our Bakana estate in Rivers State.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <nav aria-label="Updates Categories" className="mt-10 overflow-x-auto pb-2 scrollbar-none">
        <ul className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isAll = cat.slug === "all";
            return (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[length:var(--text-body-sm)] font-medium transition-colors duration-150 ${
                    isAll
                      ? "bg-[var(--surface-inverse)] text-[var(--text-inverse)]"
                      : "border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {"icon" in cat && cat.icon && <cat.icon size={16} aria-hidden />}
                  <span>{cat.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Grid of Updates */}
      <div className="mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_UPDATES.map((update) => (
            <article
              key={update.id}
              className="glass-card group flex h-full flex-col justify-between rounded-[var(--radius-lg)] p-6 transition-all duration-200 hover:border-[var(--accent-line)] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[var(--surface-subtle)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--accent-text)] font-semibold">
                    {update.categoryLabel}
                  </span>
                  <time className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                    {new Date(update.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h2 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
                  {update.title}
                </h2>

                <p className="mt-3 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                  {update.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]/60">
                <Link
                  href={update.href}
                  className="inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-medium text-[var(--accent-text)] hover:underline"
                >
                  <span>Explore {update.categoryLabel}</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Additional CMS Articles if present */}
        {sanityArticles.length > 0 && (
          <div className="mt-16 border-t border-[var(--border-subtle)] pt-12">
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-semibold text-[var(--text-primary)]">
              Published Field Notes
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sanityArticles.map((article) => (
                <article
                  key={article._id}
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
                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)] transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/journal/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-medium text-[var(--accent-text)]"
                    >
                      <span>Read article</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
