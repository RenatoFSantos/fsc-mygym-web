"use client";

import { useTransition } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { startWorkoutAction } from "../actions";

type StartWorkoutButtonProps = {
  workoutPlanId: string;
  workoutDayId: string;
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
};

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
  className,
  size,
}: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      startWorkoutAction(workoutPlanId, workoutDayId);
    });
  };

  return (
    <Button
      className={className ?? "w-full rounded-full font-inter-tight"}
      size={size}
      disabled={isPending}
      onClick={handleClick}
    >
      Iniciar Treino
    </Button>
  );
}
