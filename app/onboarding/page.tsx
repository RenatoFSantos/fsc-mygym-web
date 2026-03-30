import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";
import { Chat } from "./_components/chat";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  return (
    <main className="flex flex-col min-h-svh">
      <div className="flex items-center justify-between border-b border-border p-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary/[0.08] border border-primary/[0.08] flex items-center justify-center p-3 rounded-full shrink-0">
            <Sparkles className="size-[18px] text-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-inter-tight font-semibold text-base text-foreground leading-[1.05]">
              Coach AI
            </span>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-primary" />
              <span className="font-inter-tight text-xs text-primary leading-[1.15]">
                Online
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="font-inter-tight"
          asChild
        >
          <Link href="/">Acessar FIT.AI</Link>
        </Button>
      </div>
      <Chat />
    </main>
  );
}
