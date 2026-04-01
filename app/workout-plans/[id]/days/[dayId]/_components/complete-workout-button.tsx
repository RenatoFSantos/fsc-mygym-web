"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { completeWorkoutAction } from "../actions";

type CompleteWorkoutButtonProps = {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
};

export function CompleteWorkoutButton({
  workoutPlanId,
  workoutDayId,
  sessionId,
}: CompleteWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      completeWorkoutAction(workoutPlanId, workoutDayId, sessionId);
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full font-inter-tight"
      disabled={isPending}
      onClick={handleClick}
    >
      Marcar como concluído
    </Button>
  );
}
