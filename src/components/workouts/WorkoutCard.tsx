"use client";

import Link from "next/link";
import { Clock, Dumbbell } from "lucide-react";
import { Category } from "@/lib/types";
import { getExercisesByCategory } from "@/lib/data/exercises";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ExerciseIllustration } from "@/components/exercises/ExerciseIllustration";

export function WorkoutCard({ category }: { category: Category }) {
  const exerciseCount = getExercisesByCategory(category.slug).length;

  return (
    <GlassCard hover className="overflow-hidden flex flex-col animate-fadeIn">
      <ExerciseIllustration category={category.slug} className="h-36" iconSize={44} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-bold text-white">{category.name}</h3>
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: category.color }}
          />
        </div>
        <p className="text-xs text-white/45 mb-4 flex-1">{category.description}</p>

        <div className="flex items-center gap-4 mb-5 text-white/55 text-xs">
          <span className="flex items-center gap-1.5">
            <Dumbbell size={13} /> {exerciseCount} Exercises
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> ~{category.estimatedDuration} min
          </span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link href={`/session/${category.slug}`} className="flex-1">
            <Button size="sm" className="w-full">
              Start Workout
            </Button>
          </Link>
          <Link href={`/workouts/${category.slug}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
