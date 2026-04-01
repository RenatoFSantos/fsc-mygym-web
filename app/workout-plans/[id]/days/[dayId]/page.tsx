import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarDays, Dumbbell, Timer } from "lucide-react";
import { getWorkoutDays, getHomePageData, getCurrentUserTrainData } from "@/app/_lib/fetch-generated";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/app/_components/navbar";
import { EmptyState } from "@/app/_components/empty-state";
import { BackButton } from "./_components/back-button";
import { ExerciseCard } from "./_components/exercise-card";
import { StartWorkoutButton } from "./_components/start-workout-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";
import dayjs from "dayjs";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "SEG",
  TUESDAY: "TER",
  WEDNESDAY: "QUA",
  THURSDAY: "QUI",
  FRIDAY: "SEX",
  SATURDAY: "SAB",
  SUNDAY: "DOM",
};

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const { id: workoutPlanId, dayId: workoutDayId } = await params;

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  const [homeData, trainData, response] = await Promise.all([
    getHomePageData(dayjs().format("YYYY-MM-DD")),
    getCurrentUserTrainData(),
    getWorkoutDays(workoutPlanId, workoutDayId),
  ]);

  if (homeData.status === 404 || (trainData.status === 200 && trainData.data === null)) {
    redirect("/onboarding");
  }

  if (response.status !== 200) {
    return (
      <main className="flex flex-col pb-24">
        <div className="flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between">
            <BackButton />
            <span className="text-foreground text-lg font-semibold font-inter-tight">
              Treino de Hoje
            </span>
            <div className="size-10" />
          </div>
          <EmptyState message="Nenhuma atividade foi encontrada." />
        </div>
        <Navbar />
      </main>
    );
  }

  const workoutDay = response.data;
  const { sessions, exercises } = workoutDay;
  const durationInMinutes = Math.round(
    workoutDay.estimatedDurationInSeconds / 60,
  );

  const inProgressSession = sessions.find((s) => s.startedAt && !s.completedAt);
  const hasInProgress = Boolean(inProgressSession);
  const hasCompleted = sessions.some((s) => Boolean(s.completedAt));

  return (
    <main className="flex flex-col pb-24">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <BackButton />
          <span className="text-foreground text-lg font-semibold font-inter-tight">
            Treino de Hoje
          </span>
          <div className="size-10" />
        </div>

        <div className="relative h-[200px] rounded-[12px] overflow-hidden bg-foreground">
          {workoutDay.coverImageUrl && (
            <Image
              src={workoutDay.coverImageUrl}
              alt={workoutDay.name}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-foreground/16 backdrop-blur-sm rounded-full px-[10px] py-[5px]">
                <CalendarDays className="size-3.5 text-primary-foreground" />
                <span className="text-primary-foreground text-xs font-semibold font-inter-tight uppercase">
                  {WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay}
                </span>
              </div>
              {!hasInProgress && !hasCompleted && (
                <StartWorkoutButton
                  workoutPlanId={workoutPlanId}
                  workoutDayId={workoutDayId}
                  className="rounded-full font-inter-tight text-xs h-8 px-4"
                  size="sm"
                />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-primary-foreground text-2xl font-semibold font-inter-tight">
                {workoutDay.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Timer className="size-3.5 text-primary-foreground/70" />
                  <span className="text-primary-foreground/70 text-xs font-inter-tight">
                    {durationInMinutes}min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="size-3.5 text-primary-foreground/70" />
                  <span className="text-primary-foreground/70 text-xs font-inter-tight">
                    {exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {exercises.length === 0 ? (
            <EmptyState message="Nenhuma atividade foi encontrada." />
          ) : (
            exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))
          )}
        </div>

        {hasInProgress && inProgressSession ? (
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            sessionId={inProgressSession.id}
          />
        ) : hasCompleted ? (
          <Button
            variant="ghost"
            className="w-full rounded-full font-inter-tight"
            disabled
          >
            Concluído!
          </Button>
        ) : (
          <StartWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
          />
        )}
      </div>

      <Navbar />
    </main>
  );
}
