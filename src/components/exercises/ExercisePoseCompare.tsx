"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Exercise } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { ExerciseAnimation } from "./ExerciseAnimation";
import { arrowDirection } from "./movementMeta";
import { cn } from "@/lib/utils";

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
  const [imgError, setImgError] = useState(false);
  const [usePngFallback, setUsePngFallback] = useState(false);

  const imageSrc = usePngFallback
    ? `/images/${exercise.category}/${exercise.id}.png`
    : `/images/${exercise.category}/${exercise.id}.webp`;

  if (!imgError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-base-950 border border-white/10 flex items-center justify-center w-full",
          className
        )}
      >
        {/* Ambient category colored spotlight glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${cat.color}60 0%, transparent 75%)`,
          }}
        />

        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Info Badge */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-base-900/85 backdrop-blur-md border border-white/10 shadow-lg">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/90">
              Form Guide • {exercise.targetMuscle}
            </span>
          </div>
        </div>

        {/* Clean Showcase Image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-5 md:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`${exercise.name} form demonstration`}
            onError={() => {
              if (!usePngFallback) {
                setUsePngFallback(true);
              } else {
                setImgError(true);
              }
            }}
            className="w-full h-auto max-h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
    );
  }

  // Fallback SVG Animation View if image doesn't exist
  return (
    <div
      className={cn("relative grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10", className)}
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
