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
  { day: "Monday", shortDay: "Mon", categories: ["shoulders", "abs-cardio"], isRestDay: false, isRecoveryDay: false },
  { day: "Tuesday", shortDay: "Tue", categories: ["biceps", "triceps", "abs-cardio"], isRestDay: false, isRecoveryDay: false },
  { day: "Wednesday", shortDay: "Wed", categories: ["chest", "legs", "abs-cardio"], isRestDay: false, isRecoveryDay: false },
  { day: "Thursday", shortDay: "Thu", categories: ["back", "abs-cardio"], isRestDay: false, isRecoveryDay: false },
  { day: "Friday", shortDay: "Fri", categories: ["legs", "abs-cardio"], isRestDay: false, isRecoveryDay: false },
  {
    day: "Saturday",
    shortDay: "Sat",
    categories: [],
    isRestDay: false,
    isRecoveryDay: true,
    recoveryActivities: ["Light walking", "Stretching"],
  },
  { day: "Sunday", shortDay: "Sun", categories: [], isRestDay: true, isRecoveryDay: false },
];

export function getTodaySchedule(): DaySchedule {
  const jsDay = new Date().getDay(); // 0 = Sunday
  const index = jsDay === 0 ? 6 : jsDay - 1;
  return weeklySchedule[index];
}

// Shoulders and legs days get the full abs workout; every other training day gets the light 3-exercise abs finisher.
export function isFullAbsDay(categories: CategorySlug[]): boolean {
  return categories.includes("shoulders") || categories.includes("legs");
}
