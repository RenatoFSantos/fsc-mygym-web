import Link from "next/link";
import {
  ChartNoAxesColumn,
  House,
  UserRound,
} from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { getHomePageData } from "@/app/_lib/fetch-generated";
import { NavbarCalendarButton } from "./navbar-calendar-button";
import { NavbarSparklesButton } from "./navbar-sparkles-button";
import { Chatbot } from "./chatbot";

export async function Navbar() {
  const homeData = await getHomePageData(dayjs().format("YYYY-MM-DD"));

  const calendarHref =
    homeData.status === 200
      ? `/workout-plans/${homeData.data.activeWorkoutPlanId}`
      : "/";

  return (
    <>
      <Chatbot />
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-[20px] px-6 py-4 flex justify-around items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <House className="size-6" />
          </Link>
        </Button>
        <NavbarCalendarButton href={calendarHref} />
        <NavbarSparklesButton />
        <Button variant="ghost" size="icon" asChild>
          <Link href="/stats">
            <ChartNoAxesColumn className="size-6" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/perfil">
            <UserRound className="size-6" />
          </Link>
        </Button>
      </nav>
    </>
  );
}
