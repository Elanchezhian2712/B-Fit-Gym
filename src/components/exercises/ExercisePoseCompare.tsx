"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Maximize2, X, ZoomIn } from "lucide-react";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    if (lightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const imageSrc = usePngFallback
    ? `/images/${exercise.category}/${exercise.id}.png`
    : `/images/${exercise.category}/${exercise.id}.webp`;

  if (!imgError) {
    return (
      <>
        <div
          className={cn(
            "relative group overflow-hidden rounded-2xl bg-base-950 border border-white/10 flex items-center justify-center w-full transition-all duration-300",
            className
          )}
        >
          {/* Ambient colored spotlight glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
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

          {/* Top Info Bar */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-base-900/85 backdrop-blur-md border border-white/10 shadow-lg">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/90">
                Form Guide • {exercise.targetMuscle}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-900/85 hover:bg-base-800 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs font-semibold transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
              title="Inspect image in full view"
            >
              <Maximize2 size={13} />
              <span>Full View</span>
            </button>
          </div>

          {/* Main Showcase Image Container */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-5 md:p-6 cursor-zoom-in"
          >
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
              className="w-full h-auto max-h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Hover zoom prompt */}
            <div className="absolute inset-0 bg-base-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-base-900/90 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 shadow-2xl">
                <ZoomIn size={14} className="text-primary" />
                Tap to inspect full resolution
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6 cursor-zoom-out"
            >
              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-6xl w-full max-h-[92vh] bg-base-900 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] cursor-default flex flex-col gap-3 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{exercise.name}</h3>
                      <p className="text-xs text-white/50">
                        High-Definition Form Demonstration
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Lightbox Image Container - full visibility without cutoff */}
                <div className="relative w-full rounded-2xl overflow-y-auto bg-base-950/90 p-2 sm:p-4 flex items-center justify-center flex-1 min-h-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={`${exercise.name} full breakdown`}
                    className="w-auto h-auto max-w-full max-h-[78vh] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
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
