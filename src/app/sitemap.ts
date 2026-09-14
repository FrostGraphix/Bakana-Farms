import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/server/catalog/queries";
import { getJournalArticles } from "@/server/cms/sanity";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/certifications", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.4, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.5, changeFrequency: "yearly" },
  { path: "/shipping", priority: 0.5, changeFrequency: "monthly" },
  { path: "/our-story", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sourcing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/how-to-use", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/journal", priority: 0.5, changeFrequency: "weekly" },
  { path: "/wholesale", priority: 0.8, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  try {
    const [productSlugs, articles] = await Promise.all([
      getProductSlugs(),
      getJournalArticles(),
    ]);
    const productEntries = productSlugs.map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    const articleEntries = articles.map((article) => ({
      url: `${SITE_URL}/journal/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    return [...staticEntries, ...productEntries, ...articleEntries];
  } catch {
    return staticEntries;
  }
}
