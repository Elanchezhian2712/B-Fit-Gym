"use client";

import Link from "next/link";
import { Exercise } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ExerciseDemo } from "@/components/exercises/ExerciseDemo";
import { Clock, Weight } from "lucide-react";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
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
        <ExerciseDemo exercise={exercise} className="h-36 sm:h-40" showLabel={false} />
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[15px] font-bold text-white group-hover:text-primary transition-colors leading-snug">
              {exercise.name}
            </h3>
          </div>
          <p className="text-xs mb-3 font-medium" style={{ color: cat.color }}>
            {exercise.targetMuscle}
          </p>

          {exercise.warmup && (
            <Badge variant="warning" className="w-fit mb-2.5">
              Warm-up: {exercise.warmup}
            </Badge>
          )}

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-white/55">
            <span className="font-semibold text-white/80">
              {exercise.sets} × {exercise.reps}
            </span>
            {exercise.workingWeight && (
              <span className="flex items-center gap-1">
                <Weight size={12} /> {exercise.workingWeight}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={12} /> {exercise.rest}
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

