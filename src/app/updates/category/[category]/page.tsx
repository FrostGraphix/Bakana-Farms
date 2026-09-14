import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { CATEGORIES, FEATURED_UPDATES } from "@/app/updates/page";
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<
  string,
  {
    title: string;
    eyebrow: string;
    description: string;
  }
> = {
  announcements: {
    title: "Company Announcements",
    eyebrow: "Official News & Dispatches",
    description:
      "Timely updates regarding Bakana Farms operations, global distribution hubs, harvest schedules, and organizational milestones.",
  },
  "case-studies": {
    title: "Field & Cultivation Studies",
    eyebrow: "Agronomy & Botanical Science",
    description:
      "Real-world implementation stories documenting moringa intercropping, sustainable apiculture, and natural ginger drying in Rivers State.",
  },
  "press-releases": {
    title: "Official Press Releases",
    eyebrow: "Public Records & Statements",
    description:
      "Formal statements, quality control documentation, export packaging integrity, and trade desk disclosures.",
  },
  events: {
    title: "Events & Trade Pavilions",
    eyebrow: "Exhibitions & Gatherings",
    description:
      "Past and upcoming trade exhibitions, distributor tastings, botanical symposiums, and export conferences.",
  },
  celebrations: {
    title: "Milestones & Celebrations",
    eyebrow: "Heritage & Community",
    description:
      "Honoring our growers, regional beekeeping co-operatives, and community partnerships in the Niger Delta.",
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) {
    return { title: "Updates & Media | Bakana Farms" };
  }
  return {
    title: `${meta.title} | Bakana Farms`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    notFound();
  }

  const filteredUpdates = FEATURED_UPDATES.filter(
    (u) => u.category === category
  );

  return (
    <main className="container-page min-h-[85vh] pt-28 sm:pt-32 pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Updates & Media", href: "/updates" },
          { label: meta.title },
        ]}
      />

      {/* Header */}
      <div className="mt-8 max-w-[48rem]">
        <span className="inline-block rounded-full border border-[var(--accent-line)]/50 bg-[var(--surface-subtle)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          {meta.eyebrow}
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-semibold leading-[1.04] text-[var(--text-primary)]">
          {meta.title}
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-secondary)]">
          {meta.description}
        </p>
      </div>

      {/* Categories Bar */}
      <nav aria-label="Updates Categories" className="mt-10 overflow-x-auto pb-2 scrollbar-none">
        <ul className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = cat.slug === category;
            return (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[length:var(--text-body-sm)] font-medium transition-colors duration-150 ${
                    isActive
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

      {/* Articles Grid */}
      <div className="mt-12">
        {filteredUpdates.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUpdates.map((update) => (
              <article
                key={update.id}
                className="glass-card group flex h-full flex-col justify-between rounded-[var(--radius-lg)] p-6 transition-all duration-200 hover:border-[var(--accent-line)] hover:shadow-md"
              >
                <div>
                  <time className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                    {new Date(update.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
                    {update.title}
                  </h2>
                  <p className="mt-3 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
                    {update.excerpt}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]/60">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--accent-text)] font-semibold">
                    Bakana Estate Verified
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]/50 p-12 text-center">
            <p className="text-[length:var(--text-body)] text-[var(--text-secondary)]">
              No articles currently published in this category. Check back soon for new dispatches.
            </p>
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/updates"
            className="inline-flex items-center gap-2 text-[length:var(--text-body-sm)] font-medium text-[var(--accent-text)] hover:underline"
          >
            <ArrowLeft size={16} aria-hidden />
            <span>Back to all updates</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
