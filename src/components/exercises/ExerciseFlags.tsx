import { ShieldAlert, Copy } from "lucide-react";
import { Exercise } from "@/lib/types";
import { getOverlapGroup } from "@/lib/data/exerciseReview";
import { cn } from "@/lib/utils";

// Compact review pills: safety flag and overlap with other exercises.
export function ExerciseFlags({ exercise, className }: { exercise: Exercise; className?: string }) {
  const overlap = getOverlapGroup(exercise.id);
  if (!exercise.safety && !overlap) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {exercise.safety?.level === "replace" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-500/15 text-rose-300 border border-rose-500/30">
          <ShieldAlert size={11} /> Replace
        </span>
      )}
      {exercise.safety?.level === "caution" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <ShieldAlert size={11} /> Caution
        </span>
      )}
      {overlap && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-white/[0.05] text-white/55 border border-white/10"
          title={overlap.advice}
        >
          <Copy size={10} /> Overlaps · pick {overlap.pick} of {overlap.exerciseIds.length}
        </span>
      )}
    </div>
  );
}
