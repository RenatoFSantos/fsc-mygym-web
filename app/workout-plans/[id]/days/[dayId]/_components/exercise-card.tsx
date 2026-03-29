"use client";

import { CircleHelp, Zap } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { GetWorkoutDays200ExercisesItem } from "@/app/_lib/fetch-generated";
import { Button } from "@/components/ui/button";

type ExerciseCardProps = {
  exercise: GetWorkoutDays200ExercisesItem;
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString,
  );

  const handleHelpClick = () => {
    setChatInitialMessage(
      `Como executar o exercício ${exercise.name} corretamente?`,
    );
    setChatOpen(true);
  };

  return (
    <div className="border border-border rounded-[12px] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-base font-semibold font-inter-tight">
          {exercise.name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 shrink-0"
          onClick={handleHelpClick}
        >
          <CircleHelp className="size-5 text-muted-foreground" />
        </Button>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <span className="bg-muted text-muted-foreground text-xs font-semibold font-inter-tight rounded-full px-[10px] py-[5px] uppercase">
          {exercise.sets} séries
        </span>
        <span className="bg-muted text-muted-foreground text-xs font-semibold font-inter-tight rounded-full px-[10px] py-[5px] uppercase">
          {exercise.reps} reps
        </span>
        <span className="bg-muted text-muted-foreground text-xs font-semibold font-inter-tight rounded-full px-[10px] py-[5px] uppercase flex items-center gap-1">
          <Zap className="size-3.5" />
          {exercise.restTimeInSeconds}s
        </span>
      </div>
    </div>
  );
}
