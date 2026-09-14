import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/server/auth/customer";

export async function POST() {
  await clearCustomerSession();
  return NextResponse.json({ success: true });
}
