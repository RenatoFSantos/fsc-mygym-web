import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { getUserWorkoutStats, getHomePageData, getCurrentUserTrainData } from "@/app/_lib/fetch-generated";
import { GetUserWorkoutStats200ConsistencyByDay } from "@/app/_lib/fetch-generated";
import { Navbar } from "@/app/_components/navbar";
import { Flame, CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";

const MONTH_ABBR = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function getWeeksForMonth(monthStart: Dayjs): Array<Array<Dayjs | null>> {
  const monthEnd = monthStart.endOf("month");
  const dow = monthStart.day();
  const offset = dow === 0 ? 6 : dow - 1;
  let weekStart = monthStart.subtract(offset, "day");

  const weeks: Array<Array<Dayjs | null>> = [];

  while (weekStart.isBefore(monthEnd.add(1, "day"))) {
    const week: Array<Dayjs | null> = [];
    for (let d = 0; d < 7; d++) {
      const day = weekStart.add(d, "day");
      if (
        day.month() === monthStart.month() &&
        day.year() === monthStart.year()
      ) {
        week.push(day);
      } else {
        week.push(null);
      }
    }
    if (week.some((d) => d !== null)) {
      weeks.push(week);
    }
    weekStart = weekStart.add(7, "day");
  }

  return weeks;
}

function getCellClass(
  day: Dayjs,
  consistencyByDay: GetUserWorkoutStats200ConsistencyByDay
): string {
  const dateKey = day.format("YYYY-MM-DD");
  const data = consistencyByDay[dateKey];
  if (data?.workoutDayCompleted) return "size-5 rounded-[6px] bg-primary";
  if (data?.workoutDayStarted) return "size-5 rounded-[6px] bg-day-started";
  return "size-5 rounded-[6px] border border-border";
}

function formatTotalTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h${String(minutes).padStart(2, "0")}m`;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.format("YYYY-MM-DD");

  const [homeData, trainData, statsResponse] = await Promise.all([
    getHomePageData(today.format("YYYY-MM-DD")),
    getCurrentUserTrainData(),
    getUserWorkoutStats({ from, to }),
  ]);

  if (homeData.status === 404 || (trainData.status === 200 && trainData.data === null)) {
    redirect("/onboarding");
  }

  if (statsResponse.status !== 200) {
    throw new Error("Failed to fetch stats");
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = statsResponse.data;

  const months = [
    today.subtract(2, "month").startOf("month"),
    today.subtract(1, "month").startOf("month"),
    today.startOf("month"),
  ];

  return (
    <main className="flex flex-col pb-24">
      <div className="flex h-14 items-center px-5">
        <span className="text-foreground text-[22px] uppercase font-anton">
          FIT.AI
        </span>
      </div>

      <div className="px-5">
        <div
          className="overflow-hidden rounded-[12px] px-5 py-10 flex flex-col items-center justify-center gap-6"
          style={{
            background:
              workoutStreak > 0
                ? "var(--streak-banner-active)"
                : "var(--streak-banner-inactive)",
          }}
        >
          <div className="backdrop-blur-[4px] bg-white/12 border border-white/12 rounded-[99px] p-3">
            <Flame className="size-8 text-primary-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-primary-foreground text-[48px] leading-[0.95] font-semibold font-inter-tight">
              {workoutStreak} dias
            </span>
            <span className="text-primary-foreground/60 text-base font-inter-tight">
              Sequência Atual
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h2 className="text-foreground text-lg font-semibold font-inter-tight">
          Consistência
        </h2>

        <div className="border border-border rounded-[12px] p-5 overflow-x-auto">
          <div className="flex gap-1 items-start">
            {months.map((month) => {
              const weeks = getWeeksForMonth(month);
              return (
                <div
                  key={month.format("YYYY-MM")}
                  className="flex flex-col gap-[6px] shrink-0"
                >
                  <span className="text-[12px] text-stats-label font-inter-tight">
                    {MONTH_ABBR[month.month()]}
                  </span>
                  <div className="flex gap-1 items-start">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((day, di) =>
                          day === null ? (
                            <div key={di} className="size-5" />
                          ) : (
                            <div
                              key={di}
                              className={getCellClass(day, consistencyByDay)}
                            />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-stats-card-bg rounded-[12px] p-5 flex flex-col gap-5 items-center">
            <div className="bg-stats-card-bg rounded-[99px] p-[9px] flex items-center justify-center w-[34px] h-[34px]">
              <CircleCheck className="size-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <span className="text-[24px] font-semibold font-inter-tight text-foreground leading-[1.15]">
                {completedWorkoutsCount}
              </span>
              <span className="text-[12px] text-stats-label font-inter-tight text-center">
                Treinos Feitos
              </span>
            </div>
          </div>

          <div className="flex-1 bg-stats-card-bg rounded-[12px] p-5 flex flex-col gap-5 items-center">
            <div className="bg-stats-card-bg rounded-[99px] p-[9px] flex items-center justify-center w-[34px] h-[34px]">
              <CirclePercent className="size-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <span className="text-[24px] font-semibold font-inter-tight text-foreground leading-[1.15]">
                {Math.round(conclusionRate * 100)}%
              </span>
              <span className="text-[12px] text-stats-label font-inter-tight text-center">
                Taxa de conclusão
              </span>
            </div>
          </div>
        </div>

        <div className="bg-stats-card-bg rounded-[12px] p-5 flex flex-col gap-5 items-center w-full">
          <div className="bg-stats-card-bg rounded-[99px] p-[9px] flex items-center justify-center w-[34px] h-[34px]">
            <Hourglass className="size-4 text-foreground" />
          </div>
          <div className="flex flex-col gap-[6px] items-center">
            <span className="text-[24px] font-semibold font-inter-tight text-foreground leading-[1.15]">
              {formatTotalTime(totalTimeInSeconds)}
            </span>
            <span className="text-[12px] text-stats-label font-inter-tight">
              Tempo Total
            </span>
          </div>
        </div>
      </div>

      <Navbar />
    </main>
  );
}
