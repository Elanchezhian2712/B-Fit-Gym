"use client";

import { Exercise } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { ExerciseAnimation } from "./ExerciseAnimation";
import { cn } from "@/lib/utils";
import { useExerciseImage } from "@/lib/useExerciseImage";

interface ExerciseDemoProps {
  exercise: Exercise;
  className?: string;
  figureClassName?: string;
  showLabel?: boolean;
}

export function ExerciseDemo({ exercise, className, figureClassName, showLabel = true }: ExerciseDemoProps) {
  const cat = getCategory(exercise.category);
  const { src: customImage } = useExerciseImage(exercise.category, exercise.id);

  if (customImage) {
    return (
      <div className={cn("relative overflow-hidden bg-black", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customImage} alt={`${exercise.name} form demonstration`} className="w-full h-full object-cover" />
        {showLabel && (
          <span className="absolute bottom-2.5 right-3 z-10 text-[9px] font-bold uppercase tracking-wider text-white/40 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
            Form Demo
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden flex items-center justify-center", className)}
      style={{
        background: `linear-gradient(135deg, ${cat.color}33 0%, #101010 70%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${cat.color}55, transparent 60%)`,
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id={`grid-${exercise.id}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${exercise.id})`} />
      </svg>

      <ExerciseAnimation
        animation={exercise.animation}
        color={cat.color}
        className={cn("relative z-10 h-full w-auto max-w-[70%]", figureClassName)}
      />

      {showLabel && (
        <span className="absolute bottom-2.5 right-3 z-10 text-[9px] font-bold uppercase tracking-wider text-white/40 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
          Form Demo
        </span>
      )}
    </div>
  );
}
