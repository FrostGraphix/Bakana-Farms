import { NextResponse } from "next/server";
import { z } from "zod";
import { setupCustomerPassword } from "@/server/auth/customer";

const SetupPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/\d/, "Password must contain at least one number."),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = SetupPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid password requirements." },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName } = parsed.data;
    const result = await setupCustomerPassword({
      email,
      password,
      firstName,
      lastName,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Could not save password." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      customerId: result.customerId,
      message: "Your password has been successfully configured.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Password setup failed. Please try again." },
      { status: 500 }
    );
  }
}
