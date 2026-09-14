"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast({
        title: "Signed out",
        description: "You have been safely signed out.",
        variant: "default",
      });
      router.push("/sign-in");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={loading}
      loadingLabel="Signing out"
      onClick={handleSignOut}
      className={className}
    >
      <SignOut size={16} aria-hidden />
      Sign out
    </Button>
  );
}
