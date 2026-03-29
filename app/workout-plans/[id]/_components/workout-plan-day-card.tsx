import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Dumbbell, Timer, Zap } from "lucide-react";
import { GetWorkplansId200WorkoutDaysItem } from "@/app/_lib/fetch-generated";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

type WorkoutPlanDayCardProps = {
  workoutDay: GetWorkplansId200WorkoutDaysItem;
  workoutPlanId: string;
};

export function WorkoutPlanDayCard({
  workoutDay,
  workoutPlanId,
}: WorkoutPlanDayCardProps) {
  const dayLabel = WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;

  if (workoutDay.isRest) {
    return (
      <div className="relative h-[110px] rounded-[12px] overflow-hidden bg-rest-day-bg flex flex-col justify-between p-5">
        <div className="flex">
          <div className="flex items-center gap-1.5 bg-foreground/8 rounded-full px-[10px] py-[5px]">
            <CalendarDays className="size-3.5 text-foreground" />
            <span className="text-foreground text-xs font-semibold font-inter-tight uppercase">
              {dayLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-foreground" />
          <span className="text-foreground text-2xl font-semibold font-inter-tight">
            Descanso
          </span>
        </div>
      </div>
    );
  }

  const durationInMinutes = Math.round(
    workoutDay.estimatedDurationInSeconds / 60,
  );

  return (
    <Link href={`/workout-plans/${workoutPlanId}/days/${workoutDay.id}`}>
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
              <span className="text-primary-foreground text-xs font-semibold font-inter-tight uppercase">
                {dayLabel}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-primary-foreground text-2xl font-semibold font-inter-tight">
              {workoutDay.name}
            </h3>
            <div className="flex items-center gap-2">
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
