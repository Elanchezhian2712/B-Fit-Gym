"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock, Dumbbell, CheckCircle2 } from "lucide-react";
import { Category, Exercise } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { cn } from "@/lib/utils";

interface CategoryWorkoutSectionProps {
  category: Category;
  exercises: Exercise[];
  completed: boolean;
}

export function CategoryWorkoutSection({ category, exercises, completed }: CategoryWorkoutSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-3 sm:space-y-4">
      <GlassCard
        hover
        className="p-4 sm:p-6 relative overflow-hidden"
        style={{ backgroundImage: `linear-gradient(135deg, ${category.color}1f 0%, transparent 70%)` }}
      >
        <span
          className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
          style={{ backgroundColor: category.color }}
          aria-hidden="true"
        />

        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4 pl-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: category.color }}>
                {category.name}
              </p>
              {completed && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-md">
                  <CheckCircle2 size={11} /> Completed
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white mt-1">
              {category.name} Workout{category.level ? ` – ${category.level}` : ""}
            </h2>
            <div className="flex items-center gap-3.5 sm:gap-4 mt-2 sm:mt-3 text-white/55 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Dumbbell size={13} className="shrink-0" /> {exercises.length} Exercises
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="shrink-0" /> ~{category.estimatedDuration} min
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link href={`/session/${category.slug}`} className="flex-1 sm:flex-none">
              <Button size="md" className="w-full sm:w-auto sm:px-6 sm:py-3 sm:text-base">
                {completed ? "Redo Workout" : "Start Workout"}
              </Button>
            </Link>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-10 h-10 shrink-0 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
              aria-label={expanded ? "Collapse exercises" : "Expand exercises"}
              aria-expanded={expanded}
            >
              <ChevronDown size={18} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
            </button>
          </div>
        </div>

        {!expanded && exercises.length > 0 && (
          <p className="text-xs text-white/40 mt-4 pt-4 border-t border-white/[0.06] truncate pl-3">
            {exercises.map((e) => e.name).join(" · ")}
          </p>
        )}
      </GlassCard>

      {expanded && (
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
