import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { shoppingAgent } from "@/server/ai/shopping-agent";
import { checkRateLimit, rateLimitResponse } from "@/server/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit(request, {
    scope: "ai-chat",
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return Response.json(
      { error: "The shopping guide is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }

  const messages =
    typeof body === "object" && body !== null && "messages" in body
      ? (body as { messages?: UIMessage[] }).messages
      : undefined;

  if (!Array.isArray(messages) || messages.length > 24) {
    return Response.json({ error: "Invalid conversation" }, { status: 422 });
  }

  return createAgentUIStreamResponse({
    agent: shoppingAgent,
    uiMessages: messages,
    timeout: { totalMs: 28_000 },
  });
}
