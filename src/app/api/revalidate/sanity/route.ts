import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!secret || !signature) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.text();
  if (!(await isValidSignature(body, signature, secret))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { _type?: string };
  try {
    payload = JSON.parse(body) as { _type?: string };
  } catch {
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }

  if (payload._type === "article") revalidateTag("journal", "max");
  return Response.json({ revalidated: true });
}
