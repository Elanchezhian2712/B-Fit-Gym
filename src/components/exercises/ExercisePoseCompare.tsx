"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Exercise } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { ExerciseAnimation } from "./ExerciseAnimation";
import { arrowDirection } from "./movementMeta";
import { cn } from "@/lib/utils";
import { useExerciseImage } from "@/lib/useExerciseImage";

interface ExercisePoseCompareProps {
  exercise: Exercise;
  className?: string;
}

const ARROW_ROTATION: Record<string, number> = {
  up: 0,
  down: 180,
  back: -90,
};

function DirectionArrows({ direction }: { direction: string }) {
  if (direction === "none") return null;

  const arrows =
    direction === "out"
      ? [-35, 35]
      : direction === "in"
      ? [145, -145]
      : [ARROW_ROTATION[direction] ?? 0];

  return (
    <div className="absolute inset-x-0 top-6 flex items-center justify-center gap-6 pointer-events-none z-20">
      {arrows.map((deg, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <ArrowUp size={20} className="text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]" strokeWidth={3} />
        </motion.div>
      ))}
    </div>
  );
}

export function ExercisePoseCompare({ exercise, className }: ExercisePoseCompareProps) {
  const cat = getCategory(exercise.category);
  const direction = arrowDirection[exercise.animation];
  const { src: customImage } = useExerciseImage(exercise.category, exercise.id);

  if (customImage) {
    return (
      <div className="relative overflow-hidden bg-black flex items-center justify-center w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customImage} alt={`${exercise.name} form demonstration`} className="w-full h-auto" />
        <span className="absolute bottom-2.5 right-3 z-10 text-[9px] font-bold uppercase tracking-wider text-white/40 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
          Form Demo
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative grid grid-cols-2 overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${cat.color}20 0%, #101010 75%)` }}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 50% 10%, ${cat.color}40, transparent 65%)` }}
      />
      <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 -translate-x-1/2" />

      {(["start", "end"] as const).map((phase) => (
        <div key={phase} className="relative flex flex-col items-center justify-center px-2 py-3">
          <span
            className={cn(
              "absolute top-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-20",
              phase === "start" ? "bg-white/10 text-white/60" : "bg-primary/20 text-primary"
            )}
          >
            {phase === "start" ? "Start Position" : "Finish Position"}
          </span>
          {phase === "end" && <DirectionArrows direction={direction} />}
          <ExerciseAnimation
            animation={exercise.animation}
            color={cat.color}
            phase={phase}
            highlight
            className="h-full w-auto max-w-[80%] mt-4"
          />
        </div>
      ))}

      <span className="absolute bottom-2.5 right-3 z-10 text-[9px] font-bold uppercase tracking-wider text-white/40 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
        Form Demo
      </span>
    </div>
  );
}
