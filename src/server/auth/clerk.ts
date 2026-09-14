import { auth, currentUser } from "@clerk/nextjs/server";

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY
  );
}

export async function authenticatedUser() {
  if (!isClerkConfigured()) return null;
  const { userId } = await auth();
  if (!userId) return null;
  return currentUser();
}

export function primaryEmail(
  user: NonNullable<Awaited<ReturnType<typeof currentUser>>>
) {
  const primary = user.emailAddresses.find(
    (address) => address.id === user.primaryEmailAddressId
  );
  return primary?.emailAddress.toLowerCase() ?? null;
}
