"use client";

import { Check } from "lucide-react";
import { SetLog } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SetTrackerProps {
  set: SetLog;
  previous?: SetLog | null;
  defaultWeight: string;
  defaultReps: string;
  accent: string;
  onChange: (patch: Partial<SetLog>) => void;
  onToggleComplete: () => void;
}

export function SetTracker({
  set,
  previous,
  defaultWeight,
  defaultReps,
  accent,
  onChange,
  onToggleComplete,
}: SetTrackerProps) {
  const isWarmup = set.setNumber === 0;
  const warmupColor = "#FBBF24";

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border transition-colors",
        set.completed ? "border-transparent" : isWarmup ? "border-muscle-legs/25 bg-muscle-legs/[0.04]" : "border-white/[0.06] bg-white/[0.02]"
      )}
      style={
        set.completed
          ? { backgroundColor: `${isWarmup ? warmupColor : accent}14`, borderColor: `${isWarmup ? warmupColor : accent}40` }
          : undefined
      }
    >
      <div
        className={cn(
          "h-7 sm:h-8 rounded-lg flex items-center justify-center font-bold shrink-0",
          isWarmup ? "px-1.5 sm:px-2 text-[9px] sm:text-[10px] uppercase tracking-wide" : "w-7 sm:w-8 text-xs sm:text-sm"
        )}
        style={{ backgroundColor: `${isWarmup ? warmupColor : accent}22`, color: isWarmup ? warmupColor : accent }}
      >
        {isWarmup ? "Warm-up" : set.setNumber}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-semibold text-white/35">
          Weight {previous ? `(prev ${previous.weight || "-"})` : ""}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={set.weight}
          placeholder={defaultWeight}
          onChange={(e) => onChange({ weight: e.target.value })}
          className="bg-transparent border-b border-white/15 focus:border-primary outline-none text-sm font-semibold text-white py-1 placeholder:text-white/25 placeholder:font-normal"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-semibold text-white/35">
          Reps {previous ? `(prev ${previous.reps || "-"})` : ""}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={set.reps}
          placeholder={defaultReps}
          onChange={(e) => onChange({ reps: e.target.value })}
          className="bg-transparent border-b border-white/15 focus:border-primary outline-none text-sm font-semibold text-white py-1 placeholder:text-white/25 placeholder:font-normal"
        />
      </label>

      <button
        onClick={onToggleComplete}
        aria-label={set.completed ? "Mark set incomplete" : "Mark set complete"}
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 cursor-pointer",
          set.completed ? "border-transparent" : "border-white/20 hover:border-white/40"
        )}
        style={set.completed ? { backgroundColor: isWarmup ? warmupColor : accent } : undefined}
      >
        {set.completed && <Check size={17} className="text-base-900" strokeWidth={3} />}
      </button>
    </div>
  );
}
