import { NextResponse } from "next/server";
import { getCustomerSession } from "@/server/auth/customer";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, customer: session });
}
