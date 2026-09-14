export const article = {
  name: "article",
  title: "Journal article",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (rule: { required: () => unknown }) => rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule: { required: () => unknown }) => rule.required() },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (rule: { required: () => unknown }) => rule.required() },
    { name: "publishedAt", title: "Published at", type: "datetime", validation: (rule: { required: () => unknown }) => rule.required() },
    { name: "mainImage", title: "Main image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alternative text", type: "string" }] },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alternative text", type: "string" }] }] },
    { name: "seoTitle", title: "SEO title", type: "string" },
    { name: "seoDescription", title: "SEO description", type: "text", rows: 3 },
  ],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "mainImage" } },
};
