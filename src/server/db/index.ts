import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Lazy connection.
 *
 * Initialising at module scope would make every build and every
 * import require a live DATABASE_URL, including on a machine that
 * has only checked the repo out. The client is created on first
 * real use instead, and the absence of a URL is a loud error at
 * that point rather than a confusing one at import time.
 *
 * Serverless functions share a hard file-descriptor ceiling across
 * concurrent executions, so the pool stays small and the platform
 * scales horizontally instead.
 */

const globalForDb = globalThis as unknown as {
  __bakanaClient?: ReturnType<typeof postgres>;
  __bakanaDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (globalForDb.__bakanaDb) return globalForDb.__bakanaDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in."
    );
  }

  const client =
    globalForDb.__bakanaClient ??
    postgres(connectionString, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });

  const db = drizzle(client, { schema });

  // Cache across hot reloads in development so we do not leak a
  // new pool on every file change.
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__bakanaClient = client;
    globalForDb.__bakanaDb = db;
  }

  return db;
}

/**
 * Close the pool. Scripts only.
 *
 * `process.exit()` with live postgres sockets trips a libuv
 * assertion on Windows. Long-running server code should never call
 * this: the pool is meant to be reused across invocations.
 */
export async function closeDb(): Promise<void> {
  const client = globalForDb.__bakanaClient;
  if (!client) return;
  await client.end({ timeout: 5 });
  globalForDb.__bakanaClient = undefined;
  globalForDb.__bakanaDb = undefined;
}

export { schema };
