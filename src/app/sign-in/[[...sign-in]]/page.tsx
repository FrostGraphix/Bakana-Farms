import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/server/auth/clerk";
import { CustomerAuthFlow } from "@/components/auth/customer-auth-flow";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="container-page w-full min-w-0 max-w-full flex min-h-[85vh] flex-col items-center justify-center pt-28 sm:pt-32 pb-16">
      {isClerkConfigured() ? (
        <SignIn />
      ) : (
        <CustomerAuthFlow initialMode="sign-in" />
      )}
    </main>
  );
}
