import type { CatalogProduct } from "./types";

/**
 * Development catalogue.
 *
 * Used only until Postgres is provisioned, and only outside
 * production. Every field here traces to the Discovery workbook.
 *
 * Prices are PLACEHOLDERS and are marked as such. Discovery left
 * pricing and MOQ blank, so no figure here is a real commercial
 * number. They exist so the cart arithmetic can be exercised, and
 * they must be replaced from the client's own pricing before any
 * environment takes a real payment.
 */
export const FIXTURE_PRODUCTS: CatalogProduct[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "moringa-ginger-tea",
    name: "Moringa, Honey + Ginger Tea",
    tagline: "A warmer daily ritual.",
    description:
      "Moringa, honey and ginger tea packed into twenty individual tea bags.",
    taxClass: "standard",
    countryOfOrigin: "NG",
    ingredients: ["Moringa", "Honey", "Ginger"],
    preparation:
      "Place one tea bag in a cup. Add hot water and allow it to steep before drinking.",
    images: [
      { url: "/images/bakana-moringa-honey-ginger-hero-8k.webp", alt: "Bakana Farms Moringa, Honey and Ginger Tea box", isCutout: false },
      { url: "/images/bakana-open-box-honey-8k.webp", alt: "Open Bakana Farms Moringa, Honey and Ginger Tea box", isCutout: false },
    ],
    variants: [
      {
        id: "22222222-2222-4222-8222-222222222221",
        sku: "BF-MG-20",
        name: "20 tea bags · 40g",
        priceNgn: 1200000,
        priceUsd: 2400,
        compareAtNgn: null,
        weightGrams: 40,
        stockOnHand: 84,
        stockReserved: 0,
        lowStockThreshold: 12,
        isActive: true,
      },
    ],
  },
];
