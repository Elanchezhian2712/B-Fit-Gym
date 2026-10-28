"use client";

import Link from "next/link";
import { Exercise } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ExerciseDemo } from "@/components/exercises/ExerciseDemo";
import { MuscleTags } from "@/components/exercises/MuscleTags";
import { ExerciseFlags } from "@/components/exercises/ExerciseFlags";
import { Clock, Weight } from "lucide-react";

// `position` is the exercise's 1-based place in a workout sequence; omit it in the library.
export function ExerciseCard({ exercise, position }: { exercise: Exercise; position?: number }) {
  const cat = getCategory(exercise.category);

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="block h-full group focus:outline-none cursor-pointer"
    >
      <GlassCard
        hover
        className="overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-300"
      >
        <div className="relative">
          <ExerciseDemo exercise={exercise} className="h-32 min-[440px]:h-36 sm:h-40" showLabel={false} />
          {position !== undefined && (
            <span
              className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-base-900"
              style={{ backgroundColor: cat.color }}
            >
              {position}
            </span>
          )}
        </div>
        <div className="p-3.5 sm:p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm sm:text-[15px] font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {exercise.name}
            </h3>
          </div>
          <MuscleTags exercise={exercise} accent={cat.color} className="mb-2.5" />
          <ExerciseFlags exercise={exercise} className="mb-2.5" />

          {exercise.warmup && (
            <Badge variant="warning" className="w-fit mb-2.5 text-[10px] sm:text-xs py-0.5 px-2">
              Warm-up: {exercise.warmup}
            </Badge>
          )}

          <div className="mt-auto pt-2.5 border-t border-white/[0.06] text-xs text-white/55 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <span className="font-semibold text-white/80 shrink-0">
              {exercise.sets} × {exercise.reps}
            </span>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs ml-auto">
              {exercise.workingWeight && (
                <span className="flex items-center gap-1 text-white/50 truncate max-w-[120px]" title={exercise.workingWeight}>
                  <Weight size={11} className="shrink-0" /> {exercise.workingWeight}
                </span>
              )}
              <span className="flex items-center gap-1 shrink-0">
                <Clock size={11} className="shrink-0" /> {exercise.rest}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

