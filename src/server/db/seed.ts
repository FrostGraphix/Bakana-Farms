import { config } from "dotenv";
import { getDb, schema } from "./index";
import { FIXTURE_PRODUCTS } from "@/server/catalog/fixtures";

config({ path: ".env.local" });

/**
 * Seeds the development catalogue.
 *
 * Prices here are PLACEHOLDERS carried over from the fixtures.
 * Discovery left pricing and MOQ blank, so no figure in this file
 * is a real commercial number. Replace from the client's own
 * pricing before any environment takes a real payment.
 *
 * Safe to re-run: it clears the catalogue tables first, and it
 * refuses to run against a deployed database.
 */
async function seed() {
  if (process.env.VERCEL_ENV ?? process.env.DEPLOY_ENV) {
    throw new Error("Refusing to seed a deployed environment.");
  }

  const db = getDb();

  console.log("Clearing catalogue tables...");
  await db.delete(schema.stockMovements);
  await db.delete(schema.cartItems);
  await db.delete(schema.carts);
  await db.delete(schema.variants);
  await db.delete(schema.products);

  for (const product of FIXTURE_PRODUCTS) {
    console.log(`Inserting ${product.name}...`);

    const [inserted] = await db
      .insert(schema.products)
      .values({
        id: product.id,
        slug: product.slug,
        name: product.name,
        taxClass: product.taxClass,
        countryOfOrigin: product.countryOfOrigin,
        isActive: true,
      })
      .returning({ id: schema.products.id });

    if (!inserted) throw new Error(`Failed to insert ${product.slug}`);

    for (const [index, variant] of product.variants.entries()) {
      await db.insert(schema.variants).values({
        id: variant.id,
        productId: inserted.id,
        sku: variant.sku,
        name: variant.name,
        priceNgn: variant.priceNgn,
        priceUsd: variant.priceUsd,
        compareAtNgn: variant.compareAtNgn,
        weightGrams: variant.weightGrams,
        stockOnHand: variant.stockOnHand,
        stockReserved: 0,
        lowStockThreshold: variant.lowStockThreshold,
        position: index,
        isActive: true,
      });

      // Opening balance, so the ledger reconciles against
      // stock_on_hand from the very first row.
      await db.insert(schema.stockMovements).values({
        variantId: variant.id,
        delta: variant.stockOnHand,
        reason: "intake",
        note: "seed opening balance",
      });
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
