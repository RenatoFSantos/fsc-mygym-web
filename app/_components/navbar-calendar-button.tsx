"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarCalendarButtonProps = {
  href: string;
};

export function NavbarCalendarButton({ href }: NavbarCalendarButtonProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/workout-plans/");

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href={href}>
        <Calendar className={cn("size-6", isActive && "text-primary")} />
      </Link>
    </Button>
  );
}
