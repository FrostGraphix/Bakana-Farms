import { createHmac } from "node:crypto";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/server/db";

type RateLimitOptions = {
  scope: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

export async function checkRateLimit(
  request: Request,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  if (!hasDatabase()) {
    return {
      allowed: process.env.NODE_ENV !== "production",
      limit: options.limit,
      remaining: process.env.NODE_ENV !== "production" ? options.limit : 0,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  const now = Date.now();
  const windowStartMs = Math.floor(now / options.windowMs) * options.windowMs;
  const windowStart = new Date(windowStartMs);
  const expiresAt = new Date(windowStartMs + options.windowMs);
  const key = `${options.scope}:${identifyRequest(request)}`;
  const db = getDb();

  const [bucket] = await db
    .insert(schema.rateLimitBuckets)
    .values({ key, windowStart, expiresAt, count: 1 })
    .onConflictDoUpdate({
      target: [
        schema.rateLimitBuckets.key,
        schema.rateLimitBuckets.windowStart,
      ],
      set: {
        count: sql`${schema.rateLimitBuckets.count} + 1`,
        expiresAt,
      },
    })
    .returning({ count: schema.rateLimitBuckets.count });

  const count = bucket?.count ?? options.limit + 1;
  return {
    allowed: count <= options.limit,
    limit: options.limit,
    remaining: Math.max(0, options.limit - count),
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
  };
}

function identifyRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const agent = request.headers.get("user-agent") || "unknown";
  const secret = process.env.AUTH_SECRET || "bakana-local-rate-limit";

  return createHmac("sha256", secret)
    .update(`${address}\n${agent}`)
    .digest("hex");
}

export function rateLimitResponse(result: RateLimitResult): Response {
  return Response.json(
    { error: "Too many requests. Please retry shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
      },
    }
  );
}
