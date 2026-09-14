import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateCustomer } from "@/server/auth/customer";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = LoginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const result = await authenticateCustomer(email, password);

    if (result.status === "needs_password_setup") {
      return NextResponse.json({
        status: "needs_password_setup",
        email: result.email,
        message: "Welcome! Please create a secure password to complete your account setup.",
      });
    }

    if (result.status === "user_not_found") {
      return NextResponse.json(
        { status: "user_not_found", error: result.error },
        { status: 404 }
      );
    }

    if (result.status === "invalid_credentials") {
      return NextResponse.json(
        { status: "invalid_credentials", error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: "success",
      customerId: result.customerId,
      email: result.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
