import { tool } from "ai";
import { z } from "zod";
import { formatMoney } from "@/lib/utils";
import { getAllProducts } from "@/server/catalog/queries";
import { availableStock } from "@/server/catalog/types";

export const searchProducts = tool({
  description:
    "Search the verified Bakana Farms catalogue by name, ingredient, pack size, price, and availability.",
  inputSchema: z.object({
    query: z.string().max(120).optional().default(""),
    maximumPriceNgn: z.number().nonnegative().optional(),
    inStockOnly: z.boolean().optional().default(true),
  }),
  execute: async ({ query, maximumPriceNgn, inStockOnly }) => {
    const normalized = query.trim().toLowerCase();
    const products = await getAllProducts();

    const matches = products
      .map((product) => ({
        ...product,
        variants: product.variants.filter((variant) => {
          const searchable = [
            product.name,
            product.tagline,
            product.description,
            product.ingredients.join(" "),
            variant.name,
            variant.sku,
          ]
            .join(" ")
            .toLowerCase();
          const matchesQuery = !normalized || searchable.includes(normalized);
          const matchesPrice =
            maximumPriceNgn === undefined ||
            variant.priceNgn <= maximumPriceNgn * 100;
          const matchesStock = !inStockOnly || availableStock(variant) > 0;
          return matchesQuery && matchesPrice && matchesStock;
        }),
      }))
      .filter((product) => product.variants.length > 0)
      .map((product) => ({
        id: product.id,
        name: product.name,
        tagline: product.tagline,
        url: `/products/${product.slug}`,
        ingredients: product.ingredients,
        preparation: product.preparation,
        variants: product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          priceNgn: variant.priceNgn,
          priceFormatted: formatMoney(variant.priceNgn, "NGN"),
          available: availableStock(variant),
        })),
      }));

    return {
      found: matches.length > 0,
      products: matches,
      message:
        matches.length > 0
          ? `Found ${matches.length} matching product${matches.length === 1 ? "" : "s"}.`
          : "No matching products are currently available.",
    };
  },
});
