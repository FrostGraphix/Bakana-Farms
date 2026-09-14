import { ClerkProvider } from "@clerk/nextjs";
import { isClerkConfigured } from "@/server/auth/clerk";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) return children;
  return <ClerkProvider>{children}</ClerkProvider>;
}
