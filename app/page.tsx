import Link from "next/link";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserTrainData, getHomePageData } from "./_lib/fetch-generated";
import dayjs from "dayjs";
import { Flame } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "./_components/navbar";
import { WorkoutDayCard } from "./_components/workout-day-card";

const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const WEEK_DAY_HEADERS = ["S", "T", "Q", "Q", "S", "S", "D"];

const DAY_JS_TO_API = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const WEEK_DAY_TO_INDEX: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  console.log('Session=', session);

  if (!session?.data?.user) redirect("/auth");

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomePageData(today.format("YYYY-MM-DD")),
    getCurrentUserTrainData()
  ]) 
  
  console.log('Home Data=', homeData)

  if (homeData.status === 404 || (trainData.status === 200 && trainData.data === null)) {
    redirect("/onboarding");
  }

  if (homeData.status !== 200) {
    throw new Error("Failed to fetch home data");
  }

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = homeData.data;

  const todayWeekDay = DAY_JS_TO_API[dayjs().day()];
  const weekStart = today.startOf('week');

  return (
    <main className="flex flex-col pb-24">
      <section className="relative h-[296px] rounded-b-[20px] overflow-hidden bg-foreground">
        {todayWorkoutDay?.coverImageUrl && (
          <Image
            src={todayWorkoutDay.coverImageUrl}
            alt={todayWorkoutDay.name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
        <div className="absolute inset-0 flex flex-col justify-between p-5 pb-10">
          <span className="text-primary-foreground text-[22px] uppercase font-anton">
            FIT.AI
          </span>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-primary-foreground text-2xl font-semibold font-inter-tight">
                Olá, {session.data.user.name}
              </h1>
              <p className="text-primary-foreground/70 text-sm font-inter-tight">
                Bora treinar hoje?
              </p>
            </div>
            <div>
              <Button className="rounded-full px-4 py-2 text-sm font-semibold font-inter-tight">
                Bora!
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 p-5">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold font-inter-tight">
              Consistência
            </h2>
            <Button variant="link" className="text-primary text-xs p-0 h-auto font-inter-tight">
              Ver histórico
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-border rounded-[12px] p-5 flex-1">
              <div className="flex justify-between">
                {WEEK_DAYS.map((day, index) => {
                  const dayDate = weekStart.add(WEEK_DAY_TO_INDEX[day], 'day').format('YYYY-MM-DD');
                  const dayData = consistencyByDay[dayDate];
                  const isToday = day === todayWeekDay;
                  const isCompleted = dayData?.workoutDayCompleted;
                  const isStarted = dayData?.workoutDayStarted && !isCompleted;

                  let squareClass = "w-5 h-5 rounded-[6px] border border-border bg-background";
                  if (isCompleted) squareClass = "w-5 h-5 rounded-[6px] bg-primary";
                  else if (isStarted) squareClass = "w-5 h-5 rounded-[6px] bg-day-started";

                  if (isToday) {
                    squareClass += " ring-2 ring-primary ring-offset-1";
                  }

                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <span className="text-muted-foreground text-xs font-inter-tight">
                        {WEEK_DAY_HEADERS[index]}
                      </span>
                      <div className={squareClass} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-streak-bg rounded-[12px] px-5 py-[18px]">
              <Flame className="size-5 text-foreground" />
              <span className="text-foreground text-base font-semibold font-inter-tight">
                {workoutStreak}
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold font-inter-tight">
              Treino de Hoje
            </h2>
            <Button variant="link" className="text-primary text-xs p-0 h-auto font-inter-tight" asChild>
              <Link href={`/workout-plans/${homeData.data.activeWorkoutPlanId}`}>
                Ver treinos
              </Link>
            </Button>
          </div>
          <WorkoutDayCard workoutDay={todayWorkoutDay} />
        </section>
      </div>

      <Navbar />
    </main>
  );
}
