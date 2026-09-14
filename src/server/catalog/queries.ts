import { eq, asc } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/server/db";
import { FIXTURE_PRODUCTS } from "./fixtures";
import type { CatalogProduct } from "./types";

/**
 * Catalogue reads.
 *
 * Fixture pricing must never reach a real buyer, so a deployed
 * environment with no database is a hard failure rather than a
 * silent fallback.
 *
 * The gate is a DEPLOYMENT signal, not NODE_ENV. `next build` sets
 * NODE_ENV=production for a local build too, so keying off it
 * would block development while protecting nothing extra: a laptop
 * build is not serving anyone.
 */
function assertFallbackAllowed(): void {
  const isDeployed = Boolean(
    process.env.VERCEL_ENV ?? process.env.DEPLOY_ENV
  );

  if (isDeployed) {
    throw new Error(
      "Catalogue requested with no DATABASE_URL in a deployed environment. " +
        "Refusing to serve fixture pricing."
    );
  }
}

export async function getAllProducts(): Promise<CatalogProduct[]> {
  if (!hasDatabase()) {
    assertFallbackAllowed();
    return FIXTURE_PRODUCTS;
  }

  try {
    const db = getDb();
    const rows = await db.query.products.findMany({
      where: eq(schema.products.isActive, true),
      with: {
        variants: {
          where: eq(schema.variants.isActive, true),
          orderBy: [asc(schema.variants.position)],
        },
      },
    });

    return rows.map(mapProduct);
  } catch (error) {
    assertFallbackAllowed();
    console.warn("Catalogue database unavailable. Using local fixtures.", error);
    return FIXTURE_PRODUCTS;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<CatalogProduct | null> {
  if (!hasDatabase()) {
    assertFallbackAllowed();
    return FIXTURE_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    const db = getDb();
    const row = await db.query.products.findFirst({
      where: eq(schema.products.slug, slug),
      with: {
        variants: {
          where: eq(schema.variants.isActive, true),
          orderBy: [asc(schema.variants.position)],
        },
      },
    });

    return row ? mapProduct(row) : null;
  } catch (error) {
    assertFallbackAllowed();
    console.warn("Catalogue database unavailable. Using local fixtures.", error);
    return FIXTURE_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }
}

export async function getProductSlugs(): Promise<string[]> {
  if (!hasDatabase()) {
    assertFallbackAllowed();
    return FIXTURE_PRODUCTS.map((p) => p.slug);
  }

  try {
    const db = getDb();
    const rows = await db
      .select({ slug: schema.products.slug })
      .from(schema.products)
      .where(eq(schema.products.isActive, true));

    return rows.map((r) => r.slug);
  } catch (error) {
    assertFallbackAllowed();
    console.warn("Catalogue database unavailable. Using local fixtures.", error);
    return FIXTURE_PRODUCTS.map((product) => product.slug);
  }
}

type ProductRow = typeof schema.products.$inferSelect & {
  variants: (typeof schema.variants.$inferSelect)[];
};

/**
 * Editorial fields (tagline, description, imagery, preparation)
 * come from Sanity and are joined in by the caller. Commerce
 * fields come from Postgres. The boundary is deliberate and must
 * not blur: price and stock never live in the CMS.
 */
function mapProduct(row: ProductRow): CatalogProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: "",
    description: "",
    taxClass: row.taxClass,
    countryOfOrigin: row.countryOfOrigin,
    ingredients: [],
    preparation: "",
    images: [],
    variants: row.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      priceNgn: v.priceNgn,
      priceUsd: v.priceUsd,
      compareAtNgn: v.compareAtNgn,
      weightGrams: v.weightGrams,
      stockOnHand: v.stockOnHand,
      stockReserved: v.stockReserved,
      lowStockThreshold: v.lowStockThreshold,
      isActive: v.isActive,
    })),
  };
}
