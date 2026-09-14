import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/server/auth/clerk";
import { CustomerAuthFlow } from "@/components/auth/customer-auth-flow";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <main className="container-page w-full min-w-0 max-w-full flex min-h-[85vh] flex-col items-center justify-center pt-28 sm:pt-32 pb-16">
      {isClerkConfigured() ? (
        <SignUp />
      ) : (
        <CustomerAuthFlow initialMode="register" />
      )}
    </main>
  );
}
