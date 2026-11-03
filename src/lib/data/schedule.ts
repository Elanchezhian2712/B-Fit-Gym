import { CategorySlug } from "@/lib/types";

export interface DaySchedule {
  day: string;
  shortDay: string;
  categories: CategorySlug[];
  isRestDay: boolean;
  isRecoveryDay: boolean;
  recoveryActivities?: string[];
}

export const weeklySchedule: DaySchedule[] = [
  // Push / Pull / Legs: push and pull twice a week, legs on Wed and again alongside Saturday's pull.
  { day: "Monday", shortDay: "Mon", categories: ["chest", "shoulders", "triceps"], isRestDay: false, isRecoveryDay: false },
  { day: "Tuesday", shortDay: "Tue", categories: ["back", "biceps"], isRestDay: false, isRecoveryDay: false },
  { day: "Wednesday", shortDay: "Wed", categories: ["legs", "abs-cardio"], isRestDay: false, isRecoveryDay: false },
  { day: "Thursday", shortDay: "Thu", categories: [], isRestDay: true, isRecoveryDay: false },
  { day: "Friday", shortDay: "Fri", categories: ["chest", "shoulders", "triceps"], isRestDay: false, isRecoveryDay: false },
  { day: "Saturday", shortDay: "Sat", categories: ["back", "biceps", "legs"], isRestDay: false, isRecoveryDay: false },
  { day: "Sunday", shortDay: "Sun", categories: [], isRestDay: true, isRecoveryDay: false },
];

export function getTodaySchedule(): DaySchedule {
  const jsDay = new Date().getDay(); // 0 = Sunday
  const index = jsDay === 0 ? 6 : jsDay - 1;
  return weeklySchedule[index];
}

// A dedicated legs day (no chest paired with it) gets the Leg Press/Hamstring Curl variant;
// a Chest+Legs combo day gets the Hack Squat/Leg Extension/Lunge variant instead.
export function isDedicatedLegDay(categories: CategorySlug[]): boolean {
  return categories.includes("legs") && !categories.includes("chest");
}

// Shoulders day and the dedicated legs day get the full abs workout; every other training day
// (including the Chest+Legs combo day) gets the light 3-exercise abs finisher.
export function isFullAbsDay(categories: CategorySlug[]): boolean {
  return categories.includes("shoulders") || isDedicatedLegDay(categories);
}

// Chest paired with back is an accessory session (flys/pullover), not a full pressing day.
export function isChestAccessoryDay(categories: CategorySlug[]): boolean {
  return categories.includes("chest") && categories.includes("back");
}

// The `light` argument for getExercisesByCategory given the day's categories (undefined = no variants).
export function getWorkoutVariant(slug: CategorySlug, categories: CategorySlug[]): boolean | undefined {
  if (slug === "abs-cardio") return !isFullAbsDay(categories);
  if (slug === "legs") return !isDedicatedLegDay(categories);
  // Full chest days stay undefined so they keep the plain "chest" workout key.
  if (slug === "chest") return isChestAccessoryDay(categories) ? true : undefined;
  return undefined;
}
