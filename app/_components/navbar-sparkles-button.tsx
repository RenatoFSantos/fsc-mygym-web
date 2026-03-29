"use client";

import { Sparkles } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

export function NavbarSparklesButton() {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );

  return (
    <Button
      size="icon"
      className="rounded-full p-4 bg-primary text-primary-foreground w-14 h-14"
      onClick={() => setChatOpen(true)}
    >
      <Sparkles className="size-6" />
    </Button>
  );
}
