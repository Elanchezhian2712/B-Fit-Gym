"use client";

import { useState } from "react";
import {
  Dumbbell,
  Clock,
  TrendingUp,
  Target,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { Exercise } from "@/lib/types";
import { parseWarmup, parseRestSeconds } from "@/lib/utils";
import { RestTimer } from "@/components/session/RestTimer";

interface ExerciseStatBarProps {
  exercise: Exercise;
}

export function ExerciseStatBar({ exercise }: ExerciseStatBarProps) {
  const [showPlanDetails, setShowPlanDetails] = useState(true);
  const [timerActive, setTimerActive] = useState(false);

  const totalSets = exercise.warmup ? exercise.sets + 1 : exercise.sets;
  const warmupInfo = exercise.warmup ? parseWarmup(exercise.warmup) : null;
  const restSeconds = parseRestSeconds(exercise.rest);

  // Set-by-set plan generator
  const setRows = [];
  if (warmupInfo) {
    setRows.push({
      number: "W",
      type: "Warm-Up",
      isWarmup: true,
      weight: warmupInfo.weight,
      reps: `${warmupInfo.reps} Reps`,
      focus: "Warm up joint & groove movement path",
    });
  }

  for (let i = 1; i <= exercise.sets; i++) {
    const isLast = i === exercise.sets;
    setRows.push({
      number: `${i}`,
      type: `Working Set ${i}`,
      isWarmup: false,
      weight: exercise.workingWeight || (exercise.isBodyweight ? "Bodyweight" : "Target Load"),
      reps: `${exercise.reps} Reps`,
      focus: isLast
        ? "Maximum effort / near technical failure"
        : i === 1
        ? "Controlled eccentric & target depth"
        : "Maintain explosive concentric tempo",
    });
  }

  return (
    <div className="space-y-4 mb-7">
      {/* 4 High-Impact Metric Cards in 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Volume */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-emerald-500/[0.02] p-3.5 sm:p-4 flex flex-col justify-between hover:border-emerald-500/35 transition-colors">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Dumbbell size={13} /> Target Volume
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">
                {totalSets} Sets
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {exercise.reps}{" "}
              <span className="text-xs font-normal text-white/50">reps/set</span>
            </p>
          </div>
          <p className="text-[11px] text-white/45 mt-2 flex items-center gap-1 truncate">
            <Layers size={11} className="text-emerald-400/80 shrink-0" />
            {exercise.warmup ? `1 Warm-up + ${exercise.sets} Working Sets` : `${exercise.sets} Working Sets`}
          </p>
        </div>

        {/* Metric 2: Working Load */}
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.08] to-orange-500/[0.02] p-3.5 sm:p-4 flex flex-col justify-between hover:border-orange-500/35 transition-colors">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <TrendingUp size={13} /> Target Load
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300">
                {exercise.isBodyweight ? "Bodyweight" : "Progression"}
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white line-clamp-1">
              {exercise.workingWeight || (exercise.isBodyweight ? "Bodyweight" : "Standard")}
            </p>
          </div>
          <p className="text-[11px] text-white/45 mt-2 flex items-center gap-1 truncate">
            <Sparkles size={11} className="text-orange-400/80 shrink-0" />
            {exercise.isBodyweight ? "Bodyweight load" : "Progressive overload"}
          </p>
        </div>

        {/* Metric 3: Rest Interval */}
        <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/[0.08] to-fuchsia-500/[0.02] p-3.5 sm:p-4 flex flex-col justify-between hover:border-fuchsia-500/35 transition-colors">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5">
                <Clock size={13} /> Rest Interval
              </span>
              <button
                type="button"
                onClick={() => setTimerActive((v) => !v)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/20 hover:bg-fuchsia-500/35 text-fuchsia-300 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                title="Toggle quick rest countdown"
              >
                <Timer size={10} />
                {timerActive ? "Hide" : "Start"}
              </button>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {exercise.rest}
            </p>
          </div>
          <p className="text-[11px] text-white/45 mt-2 flex items-center gap-1 truncate">
            Recovery between sets
          </p>
        </div>

        {/* Metric 4: Target & Equipment */}
        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.08] to-sky-500/[0.02] p-3.5 sm:p-4 flex flex-col justify-between hover:border-sky-500/35 transition-colors">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Target size={13} /> Muscle Focus
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300">
                {exercise.difficulty}
              </span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-white tracking-tight line-clamp-1">
              {exercise.targetMuscle}
            </p>
          </div>
          <p className="text-[11px] text-white/45 mt-2 truncate">
            {exercise.equipment}
          </p>
        </div>
      </div>

      {/* Embedded Quick Rest Timer Drawer */}
      {timerActive && (
        <div className="p-4 rounded-2xl bg-base-900/90 border border-fuchsia-500/30 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Timer size={14} className="text-fuchsia-400" />
              Active Rest Timer ({restSeconds}s Target)
            </span>
            <button
              onClick={() => setTimerActive(false)}
              className="text-xs text-white/50 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <RestTimer
            seconds={restSeconds}
            onComplete={() => setTimerActive(false)}
            onSkip={() => setTimerActive(false)}
          />
        </div>
      )}

      {/* Structured Set-by-Set Progression Protocol */}
      <div className="rounded-2xl border border-white/10 bg-base-900/60 backdrop-blur-md overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPlanDetails((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-white">
              Set-by-Set Progression Plan
            </span>
            <span className="text-[10px] text-white/45 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              {setRows.length} Total Sets
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <span>{showPlanDetails ? "Collapse" : "Expand"}</span>
            {showPlanDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {showPlanDetails && (
          <div className="p-3 sm:p-4 pt-1 border-t border-white/[0.06]">
            <div className="space-y-2">
              {setRows.map((row) => (
                <div
                  key={row.type}
                  className={`flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl border transition-all ${
                    row.isWarmup
                      ? "bg-amber-500/[0.04] border-amber-500/20"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  {/* Left: Badge & Type */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        row.isWarmup
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-primary/20 text-primary border border-primary/30"
                      }`}
                    >
                      {row.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white truncate">
                        {row.type}
                      </p>
                      <p className="text-[11px] text-white/45 truncate hidden sm:block">
                        {row.focus}
                      </p>
                    </div>
                  </div>

                  {/* Right: Load & Reps */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {row.weight}
                      </p>
                      <p className="text-[11px] font-semibold text-primary/80">
                        {row.reps}
                      </p>
                    </div>
                    <CheckCircle2 size={16} className="text-white/20 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
