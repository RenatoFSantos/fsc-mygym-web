"use server";

import { startWorkoutSession, updateWorkoutSession } from "@/app/_lib/fetch-generated";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

export async function startWorkoutAction(
  workoutPlanId: string,
  workoutDayId: string,
) {
  await startWorkoutSession(workoutPlanId, workoutDayId);
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}

export async function completeWorkoutAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string,
) {
  await updateWorkoutSession(workoutPlanId, workoutDayId, sessionId, {
    completedAt: dayjs().toISOString(),
  });
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}
