"use client";

import { useEffect, useState } from "react";
import { CategorySlug } from "@/lib/types";
import { applyWorkoutOrder, getExercisesByCategory, getWorkoutKey } from "@/lib/data/exercises";
import { useFitnessStore } from "@/lib/store";

/** A workout's exercises in the user's saved order, with actions to rearrange or reset it. */
export function useWorkoutExercises(category: CategorySlug, light?: boolean) {
  const key = getWorkoutKey(category, light);
  const savedIds = useFitnessStore((s) => s.workoutOrders[key]);
  const setWorkoutOrder = useFitnessStore((s) => s.setWorkoutOrder);
  const resetWorkoutOrder = useFitnessStore((s) => s.resetWorkoutOrder);

  // The saved order lives in localStorage, so render the default order until mounted to match the server HTML.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const defaults = getExercisesByCategory(category, light);
  const exercises = applyWorkoutOrder(defaults, mounted ? savedIds : undefined);
  const isCustomOrder = exercises.some((e, i) => e.id !== defaults[i].id);

  return {
    exercises,
    isCustomOrder,
    setOrder: (ids: string[]) => setWorkoutOrder(key, category, ids),
    resetOrder: () => resetWorkoutOrder(key),
  };
}
