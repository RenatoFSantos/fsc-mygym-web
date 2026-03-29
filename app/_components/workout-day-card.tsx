import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Dumbbell, Timer } from "lucide-react";
import { GetHomePageData200TodayWorkoutDay } from "@/app/_lib/fetch-generated";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "SEG",
  TUESDAY: "TER",
  WEDNESDAY: "QUA",
  THURSDAY: "QUI",
  FRIDAY: "SEX",
  SATURDAY: "SAB",
  SUNDAY: "DOM",
};

type WorkoutDayCardProps = {
  workoutDay: GetHomePageData200TodayWorkoutDay;
};

export function WorkoutDayCard({ workoutDay }: WorkoutDayCardProps) {
  const durationInMinutes = Math.round(workoutDay.estimatedDurationInSeconds / 60);

  return (
    <Link href={`/workout-plans/${workoutDay.workoutPlanId}/days/${workoutDay.id}`}>
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
          <div className="flex">
            <div className="flex items-center gap-1.5 bg-foreground/16 backdrop-blur-sm rounded-full px-[10px] py-[5px]">
              <CalendarDays className="size-3.5 text-primary-foreground" />
              <span className="text-primary-foreground text-xs font-semibold font-inter-tight">
                {WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-primary-foreground text-2xl font-semibold font-inter-tight">
              {workoutDay.name}
            </h3>
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
                  {workoutDay.exercisesCount} exercícios
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
