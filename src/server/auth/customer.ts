import crypto from "node:crypto";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/server/db";
import { mergeGuestCartIntoCustomerCart } from "@/server/cart/service";

const SESSION_COOKIE_NAME = "bakana_customer_session";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function getSecretKey(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    process.env.PAYSTACK_SECRET_KEY ||
    "bakana-farms-production-salt-key-v1"
  );
}

/**
 * Hash password using Node's scrypt.
 * Output format: salt:derivedKey (hex encoded).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify password in constant time to prevent timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

/**
 * Sign session payload to ensure tamper-proof authentication.
 */
function signPayload(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSecretKey());
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex")}`;
}

/**
 * Verify signature and decode session payload.
 */
function verifySessionToken(
  token: string
): { customerId: string; email: string } | null {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return null;
    const payload = token.slice(0, lastDot);
    const signature = token.slice(lastDot + 1);

    const expected = crypto
      .createHmac("sha256", getSecretKey())
      .update(payload)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    if (!decoded.customerId || !decoded.email) return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Issue a signed session cookie.
 */
export async function setCustomerSession(
  customerId: string,
  email: string
): Promise<void> {
  const payload = Buffer.from(
    JSON.stringify({ customerId, email, issuedAt: Date.now() })
  ).toString("base64url");

  const token = signPayload(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Check for active guest cart and merge it into customer's cart
  const guestToken = cookieStore.get("bakana_guest_cart")?.value;
  if (guestToken) {
    try {
      await mergeGuestCartIntoCustomerCart({ guestToken, customerId });
    } catch {
      // Cart merge failure should not block login
    }
  }
}

/**
 * Read and verify customer session from cookie.
 */
export async function getCustomerSession(): Promise<{
  customerId: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Destroy customer session.
 */
export async function clearCustomerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export type AuthResult =
  | { status: "success"; customerId: string; email: string }
  | { status: "needs_password_setup"; customerId: string; email: string }
  | { status: "invalid_credentials"; error: string }
  | { status: "user_not_found"; error: string };

/**
 * Authenticate customer or detect first-time login requiring password setup.
 */
export async function authenticateCustomer(
  emailInput: string,
  passwordInput?: string
): Promise<AuthResult> {
  if (!hasDatabase()) {
    return { status: "invalid_credentials", error: "Database unavailable." };
  }

  const email = emailInput.trim().toLowerCase();
  const db = getDb();

  const customer = await db.query.customers.findFirst({
    where: eq(schema.customers.email, email),
  });

  if (!customer) {
    return {
      status: "user_not_found",
      error: "No account found with this email.",
    };
  }

  // FIRST LOGIN / NO PASSWORD CASE: Customer exists (e.g. from guest checkout)
  // but has not created a password yet. Prompt them to set their own password!
  if (!customer.passwordHash) {
    return {
      status: "needs_password_setup",
      customerId: customer.id,
      email: customer.email,
    };
  }

  if (!passwordInput) {
    return {
      status: "invalid_credentials",
      error: "Please enter your password.",
    };
  }

  const isValid = verifyPassword(passwordInput, customer.passwordHash);
  if (!isValid) {
    return {
      status: "invalid_credentials",
      error: "Incorrect password. Try again or reset.",
    };
  }

  await setCustomerSession(customer.id, customer.email);
  return { status: "success", customerId: customer.id, email: customer.email };
}

/**
 * First-time password setup or password registration.
 */
export async function setupCustomerPassword(params: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ success: boolean; error?: string; customerId?: string }> {
  const { email: rawEmail, password, firstName, lastName } = params;
  const email = rawEmail.trim().toLowerCase();

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long.",
    };
  }

  if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    return {
      success: false,
      error: "Password must contain both letters and numbers.",
    };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database unavailable." };
  }

  const db = getDb();
  const passwordHash = hashPassword(password);

  const [customer] = await db
    .insert(schema.customers)
    .values({
      email,
      passwordHash,
      firstName: firstName || null,
      lastName: lastName || null,
      emailVerifiedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.customers.email,
      set: {
        passwordHash,
        firstName: firstName || sql`customers.first_name`,
        lastName: lastName || sql`customers.last_name`,
        emailVerifiedAt: sql`COALESCE(customers.email_verified_at, NOW())`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: schema.customers.id });

  if (!customer) {
    return { success: false, error: "Failed to create account." };
  }

  await setCustomerSession(customer.id, email);
  return { success: true, customerId: customer.id };
}
