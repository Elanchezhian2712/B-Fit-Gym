import { Dumbbell, Weight, Clock, ListChecks, Route } from "lucide-react";
import { Exercise } from "@/lib/types";
import { parseWarmup } from "@/lib/utils";

interface ExerciseStatBarProps {
  exercise: Exercise;
}

const MOVEMENT_KEYWORDS =
  /press|pull|curl|raise|lower|extend|squat|crunch|row|shrug|push|drive|tuck|swing/i;

function getMovementPath(exercise: Exercise): string {
  const match = exercise.instructions.find((i) => MOVEMENT_KEYWORDS.test(i));
  return match ?? exercise.instructions[0] ?? "Follow a slow, controlled range of motion.";
}

function getWeightPlan(exercise: Exercise): { label: string; value: string }[] {
  if (exercise.warmup) {
    const warm = parseWarmup(exercise.warmup);
    return [
      { label: "Warm-up", value: `${warm.weight} × ${warm.reps}` },
      ...Array.from({ length: exercise.sets }, (_, i) => ({
        label: `Set ${i + 1}`,
        value: `${exercise.workingWeight ?? "BW"} × ${exercise.reps}`,
      })),
    ];
  }
  if (exercise.workingWeight) {
    return [{ label: `All ${exercise.sets} Sets`, value: `${exercise.workingWeight} × ${exercise.reps}` }];
  }
  return [{ label: `All ${exercise.sets} Sets`, value: "Bodyweight — no added weight" }];
}

export function ExerciseStatBar({ exercise }: ExerciseStatBarProps) {
  const totalSets = exercise.warmup ? exercise.sets + 1 : exercise.sets;
  const weightPlan = getWeightPlan(exercise);
  const keyPoints = exercise.instructions.slice(0, 4);
  const movementPath = getMovementPath(exercise);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-7">
      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-400 mb-2 flex items-center gap-1.5">
          <Dumbbell size={12} /> Sets × Reps
        </p>
        <p className="text-sm font-bold text-white">
          {totalSets} Sets × {exercise.reps}
        </p>
        {exercise.warmup && <p className="text-[11px] text-white/40 mt-1">(1 Warm-up + {exercise.sets} Working)</p>}
      </div>

      <div className="rounded-xl border border-orange-500/25 bg-orange-500/[0.07] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-orange-400 mb-2 flex items-center gap-1.5">
          <Weight size={12} /> Weight (Your Plan)
        </p>
        <ul className="space-y-0.5">
          {weightPlan.map((row) => (
            <li key={row.label} className="text-xs text-white/75 flex justify-between gap-2">
              <span className="text-white/40">{row.label}:</span>
              <span className="font-semibold text-right">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/[0.07] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-fuchsia-400 mb-2 flex items-center gap-1.5">
          <Clock size={12} /> Rest
        </p>
        <p className="text-sm font-bold text-white">{exercise.rest}</p>
        <p className="text-[11px] text-white/40 mt-1">between sets</p>
      </div>

      <div className="rounded-xl border border-red-500/25 bg-red-500/[0.07] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-red-400 mb-2 flex items-center gap-1.5">
          <ListChecks size={12} /> Key Points
        </p>
        <ul className="space-y-1">
          {keyPoints.map((k, i) => (
            <li key={i} className="text-[11px] text-white/70 flex gap-1.5">
              <span className="text-red-400 shrink-0">•</span>
              {k}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/[0.07] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-yellow-400 mb-2 flex items-center gap-1.5">
          <Route size={12} /> Movement Path
        </p>
        <p className="text-xs text-white/75 leading-relaxed">{movementPath}</p>
      </div>
    </div>
  );
}
