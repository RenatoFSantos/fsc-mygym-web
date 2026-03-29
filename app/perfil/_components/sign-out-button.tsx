"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (!error) {
      router.push("/auth");
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="gap-2 text-destructive hover:text-destructive px-4 py-2 rounded-full"
    >
      <span className="text-[16px] font-semibold font-inter-tight leading-none">
        Sair da conta
      </span>
      <LogOut className="size-4" />
    </Button>
  );
}
