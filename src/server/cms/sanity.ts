import { createClient } from "@sanity/client";
import type { PortableTextBlock } from "@portabletext/types";
import { unstable_cache } from "next/cache";

export type JournalArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  body?: PortableTextBlock[];
};

export function isSanityConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET
  );
}

function sanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) throw new Error("Sanity is not configured.");

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-09-01",
    token: process.env.SANITY_API_READ_TOKEN || undefined,
    useCdn: !process.env.SANITY_API_READ_TOKEN,
    perspective: "published",
  });
}

const getArticlesCached = unstable_cache(
  async () =>
    sanityClient().fetch<JournalArticle[]>(
      `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
        _id, title, "slug": slug.current, excerpt, publishedAt
      }`
    ),
  ["sanity-journal"],
  { revalidate: 300, tags: ["journal"] }
);

export async function getJournalArticles(): Promise<JournalArticle[]> {
  if (!isSanityConfigured()) return [];
  try {
    return await getArticlesCached();
  } catch (error) {
    console.warn("Sanity fetch failed, falling back to empty articles array:", error);
    return [];
  }
}

export async function getJournalArticle(slug: string): Promise<JournalArticle | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient().fetch<JournalArticle | null>(
      `*[_type == "article" && slug.current == $slug][0] {
        _id, title, "slug": slug.current, excerpt, publishedAt, body
      }`,
      { slug }
    );
  } catch (error) {
    console.warn(`Sanity fetch failed for article ${slug}:`, error);
    return null;
  }
}
