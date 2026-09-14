export type CatalogImage = {
  url: string;
  alt: string;
  /**
   * A product shot masked onto a transparent or white background.
   * These become glowing rectangles on a dark page, so they get a
   * sand mat instead of sitting directly on the surface.
   */
  isCutout: boolean;
};

export type CatalogVariant = {
  id: string;
  sku: string;
  name: string;
  priceNgn: number;
  priceUsd: number | null;
  compareAtNgn: number | null;
  weightGrams: number;
  stockOnHand: number;
  stockReserved: number;
  lowStockThreshold: number;
  isActive: boolean;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  taxClass: "standard" | "zero_rated" | "exempt";
  countryOfOrigin: string;
  ingredients: string[];
  preparation: string;
  images: CatalogImage[];
  variants: CatalogVariant[];
};

/** Sellable stock is on-hand minus what carts are holding. */
export function availableStock(variant: CatalogVariant): number {
  return Math.max(0, variant.stockOnHand - variant.stockReserved);
}

export function isLowStock(variant: CatalogVariant): boolean {
  const available = availableStock(variant);
  return available > 0 && available <= variant.lowStockThreshold;
}

export function isInStock(variant: CatalogVariant): boolean {
  return availableStock(variant) > 0;
}
