import { Exercise } from "@/lib/types";

export interface OverlapGroup {
  id: string;
  label: string;
  exerciseIds: string[];
  // How many from the group are worth doing in one session.
  pick: number;
  advice: string;
}

// Exercises that train the same movement pattern. Doing every one adds volume, not a new stimulus.
export const overlapGroups: OverlapGroup[] = [
  {
    id: "horizontal-press",
    label: "Flat horizontal press",
    exerciseIds: ["push-up", "flat-bench-press"],
    pick: 1,
    advice: "Push-ups and the flat bench press are the same pressing pattern. Use push-ups as a warm-up or when no bench is free, not as a second full block.",
  },
  {
    id: "chest-fly",
    label: "Chest fly",
    exerciseIds: ["cable-pec-fly", "butterfly-machine"],
    pick: 1,
    advice: "Cable flys and the pec deck are the same movement. One per session is enough, so pick whichever station is free.",
  },
  {
    id: "vertical-pull",
    label: "Vertical pull",
    exerciseIds: ["conventional-lat-pulldown", "behind-the-neck-lat-pulldown", "reverse-grip-close-grip-lat-pulldown"],
    pick: 2,
    advice: "All three are lat pulldowns. Keep the conventional and reverse-grip versions and drop behind-the-neck, which adds risk without adding benefit.",
  },
  {
    id: "horizontal-row",
    label: "Horizontal row",
    exerciseIds: ["close-grip-cable-row", "landmine-row", "one-arm-dumbbell-row"],
    pick: 2,
    advice: "These rows all hit the mid back and lats. Two variations per session is plenty.",
  },
  {
    id: "front-delt",
    label: "Front delt",
    exerciseIds: ["seated-shoulder-press-machine", "one-arm-dumbbell-front-raise"],
    pick: 1,
    advice: "Pressing already works the front delts hard, and chest days add more. Front raises are optional unless your front delts are lagging.",
  },
  {
    id: "supinated-curl",
    label: "Supinated curl",
    exerciseIds: ["bar-curl", "dumbbell-bicep-preacher-curl-one-arm", "dumbbell-concentration-curl-one-arm"],
    pick: 1,
    advice: "Bar, preacher and concentration curls are all palms-up curls. Incline and hammer curls each add something different. Of these three, one is enough.",
  },
  {
    id: "triceps-long-head",
    label: "Triceps extension (long head)",
    exerciseIds: ["decline-bench-barbell-triceps-extension", "dumbbell-overhead-triceps-extension"],
    pick: 1,
    advice: "Both are extensions with the arm angled overhead, which biases the long head. Pick one.",
  },
  {
    id: "triceps-arm-at-side",
    label: "Triceps extension (arm at side)",
    exerciseIds: ["cable-pushdown", "dumbbell-triceps-kickback"],
    pick: 1,
    advice: "Pushdowns and kickbacks both extend the elbow with the upper arm at your side. Pushdowns load more easily, so prefer them.",
  },
  {
    id: "leg-raise",
    label: "Leg / knee raise",
    exerciseIds: ["leg-raise", "captain-chair-leg-raise", "reverse-leg-crunch", "seated-knee-tuck"],
    pick: 2,
    advice: "These all curl the pelvis up toward the ribs. One or two per session covers it.",
  },
  {
    id: "crunch",
    label: "Crunch",
    exerciseIds: ["decline-bench-sit-up", "ab-crunch-machine", "rope-crunches"],
    pick: 1,
    advice: "These all flex the spine. Pick the one you can load and progress best.",
  },
];

export function getOverlapGroup(exerciseId: string) {
  return overlapGroups.find((g) => g.exerciseIds.includes(exerciseId));
}

export function needsReview(exercise: Exercise) {
  return Boolean(exercise.safety) || Boolean(getOverlapGroup(exercise.id));
}
