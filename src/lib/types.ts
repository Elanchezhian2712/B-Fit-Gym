export type CategorySlug =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "abs-cardio";

export interface Category {
  slug: CategorySlug;
  name: string;
  level?: string;
  color: string;
  colorSoft: string;
  description: string;
  estimatedDuration: number; // minutes
}

export type AnimationType =
  | "pushup"
  | "press-horizontal"
  | "fly"
  | "pullover"
  | "pulldown"
  | "row"
  | "press-overhead"
  | "raise-lateral"
  | "raise-front"
  | "upright-row"
  | "face-pull"
  | "shrug"
  | "curl"
  | "curl-unilateral"
  | "dip"
  | "extension-triceps"
  | "pushdown"
  | "kickback"
  | "squat"
  | "leg-press"
  | "legcurl"
  | "leg-extension"
  | "calf-raise"
  | "stretch"
  | "plank"
  | "leg-raise"
  | "knee-tuck"
  | "reverse-crunch"
  | "crunch"
  | "cable-crunch"
  | "high-knees"
  | "jump"
  | "walk";

// Emphasis regions within a muscle group. These are biases, not isolated muscles.
export type MuscleRegion =
  | "front-delts"
  | "side-delts"
  | "rear-delts"
  | "traps"
  | "upper-chest"
  | "middle-chest"
  | "lower-chest";

export interface ExerciseSafety {
  level: "replace" | "caution";
  note: string;
  alternativeId?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: CategorySlug;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  emphasis?: MuscleRegion[];
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isBodyweight: boolean;
  unilateral: boolean; // one arm / one side at a time
  warmup: string | null;
  workingWeight: string | null;
  sets: number;
  reps: string;
  rest: string;
  animation: AnimationType;
  safety?: ExerciseSafety;
  instructions: string[];
  commonMistakes: string[];
}

export interface WeightEntry {
  date: string; // ISO date
  weight: number;
}

export interface SetLog {
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  completed: boolean;
}

export interface WorkoutSessionLog {
  id: string;
  category: CategorySlug;
  date: string; // ISO date
  exerciseLogs: ExerciseLog[];
  durationSeconds: number;
  completed: boolean;
}

export interface DailyTracker {
  date: string;
  gymCompleted: boolean;
  breakfastCompleted: boolean;
  lunchCompleted: boolean;
  postWorkoutCompleted: boolean;
  dinnerCompleted: boolean;
  waterLiters: number;
}
