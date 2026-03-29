import Image from "next/image";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { Goal } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkplansId } from "@/app/_lib/fetch-generated";
import { Navbar } from "@/app/_components/navbar";
import { EmptyState } from "@/app/_components/empty-state";
import { WorkoutPlanDayCard } from "./_components/workout-plan-day-card";

const WEEK_DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session?.data?.user) redirect("/auth");

  const response = await getWorkplansId(id);

  if (response.status === 404) notFound();

  if (response.status !== 200) {
    throw new Error("Failed to fetch workout plan");
  }

  const workoutPlan = response.data;

  const sortedWorkoutDays = [...workoutPlan.workoutDays].sort(
    (a, b) =>
      WEEK_DAY_ORDER.indexOf(a.weekDay as (typeof WEEK_DAY_ORDER)[number]) -
      WEEK_DAY_ORDER.indexOf(b.weekDay as (typeof WEEK_DAY_ORDER)[number]),
  );

  const bannerImageUrl =
    sortedWorkoutDays.find((d) => !d.isRest && d.coverImageUrl)
      ?.coverImageUrl ?? null;

  return (
    <main className="flex flex-col pb-24">
      <section className="relative h-[296px] rounded-b-[20px] overflow-hidden bg-foreground">
        {bannerImageUrl && (
          <Image
            src={bannerImageUrl}
            alt={workoutPlan.name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80" />
        <div className="absolute inset-0 flex flex-col justify-between p-5 pb-10">
          <span className="text-primary-foreground text-[22px] uppercase font-anton">
            FIT.AI
          </span>
          <div className="flex flex-col gap-3">
            <div className="flex">
              <div className="flex items-center gap-1 bg-primary rounded-full px-[10px] py-[5px]">
                <Goal className="size-4 text-primary-foreground" />
                <span className="text-primary-foreground text-xs font-semibold font-inter-tight uppercase">
                  {workoutPlan.name}
                </span>
              </div>
            </div>
            <h1 className="text-primary-foreground text-2xl font-semibold font-inter-tight">
              Plano de Treino
            </h1>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 p-5">
        {sortedWorkoutDays.length === 0 ? (
          <EmptyState message="Nenhuma atividade foi encontrada." />
        ) : (
          sortedWorkoutDays.map((day) => (
            <WorkoutPlanDayCard
              key={day.id}
              workoutDay={day}
              workoutPlanId={id}
            />
          ))
        )}
      </div>

      <Navbar />
    </main>
  );
}
