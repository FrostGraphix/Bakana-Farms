import { sql } from "drizzle-orm";
import { getDb, hasDatabase } from "@/server/db";

/**
 * Readiness checks the commerce system of record.
 * No credentials or connection details leave this module.
 */
export async function isCommerceReady(): Promise<boolean> {
  if (!hasDatabase()) return false;

  try {
    await getDb().execute(sql`select 1`);
    return true;
  } catch (error) {
    console.error("health.database_unavailable", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return false;
  }
}
