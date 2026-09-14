/**
 * Product Editorial Content Schema
 *
 * NON-NEGOTIABLE ARCHITECTURAL RULE (AGENTS.md):
 * Postgres is the system of record for commerce: price, stockOnHand,
 * stockReserved, SKU, variant details. Never add pricing, inventory,
 * or customer data to Sanity. Sanity holds editorial copy, tasting notes,
 * and high-resolution marketing photography only.
 */
export const productEditorial = {
  name: "productEditorial",
  title: "Product Editorial",
  type: "document",
  fields: [
    {
      name: "commerceProductId",
      title: "Commerce Product Slug / ID",
      type: "string",
      description: "Must match the product slug in Postgres (e.g. 'moringa-ginger-tea')",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "productName",
      title: "Display Name",
      type: "string",
      description: "Editorial display name (e.g. 'Moringa, Honey & Ginger Tea')",
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short promotional tagline (e.g. 'A warmer daily ritual')",
    },
    {
      name: "overview",
      title: "Editorial Overview",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich-text product overview and farm background",
    },
    {
      name: "tastingNotes",
      title: "Tasting Notes & Profile",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. ['Warm earthy moringa', 'Wild floral honey sweetness', 'Spicy ginger kick']",
    },
    {
      name: "preparationNotes",
      title: "Ritual & Preparation Notes",
      type: "array",
      of: [{ type: "block" }],
      description: "Brewing instructions: water temperature, steep time, ritual tips",
    },
    {
      name: "gallery",
      title: "Editorial Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description: "Required for accessibility (WCAG 2.2 AA)",
              validation: (rule: { required: () => unknown }) => rule.required(),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "productName",
      subtitle: "commerceProductId",
    },
  },
};
