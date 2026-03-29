"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startWorkoutAction } from "../actions";

type StartWorkoutButtonProps = {
  workoutPlanId: string;
  workoutDayId: string;
};

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
}: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      startWorkoutAction(workoutPlanId, workoutDayId);
    });
  };

  return (
    <Button
      className="w-full rounded-full font-inter-tight"
      disabled={isPending}
      onClick={handleClick}
    >
      Iniciar Treino
    </Button>
  );
}
