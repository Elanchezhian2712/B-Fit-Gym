"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams, notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Dumbbell,
  Check,
} from "lucide-react";
import { getExerciseById, getExercisesByCategory } from "@/lib/data/exercises";
import { getCategory } from "@/lib/data/categories";
import { ExercisePoseCompare } from "@/components/exercises/ExercisePoseCompare";
import { ExerciseStatBar } from "@/components/exercises/ExerciseStatBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useFitnessStore } from "@/lib/store";
import { useToast } from "@/components/common/ToastProvider";

export default function ExerciseDetailPage({ params }: { params?: { id?: string } }) {
  const routeParams = useParams();
  const id = ((params?.id || routeParams?.id) as string) || "";
  const exercise = id ? getExerciseById(id) : undefined;
  if (!exercise) notFound();

  const cat = getCategory(exercise.category);
  const router = useRouter();
  const { showToast } = useToast();
  const [skipped, setSkipped] = useState(false);
  const [completedJustNow, setCompletedJustNow] = useState(false);

  const activeSession = useFitnessStore((s) => s.activeSession);
  const startSession = useFitnessStore((s) => s.startSession);
  const goToExercise = useFitnessStore((s) => s.goToExercise);
  const markExerciseComplete = useFitnessStore((s) => s.markExerciseComplete);

  // Category sibling exercises for Prev/Next navigation
  const categoryExercises = getExercisesByCategory(exercise.category);
  const currentIndex = categoryExercises.findIndex((e) => e.id === exercise.id);
  const prevExercise = currentIndex > 0 ? categoryExercises[currentIndex - 1] : null;
  const nextExercise =
    currentIndex >= 0 && currentIndex < categoryExercises.length - 1
      ? categoryExercises[currentIndex + 1]
      : null;

  const handleStart = () => {
    if (!activeSession || activeSession.category !== exercise.category) {
      startSession(exercise.category);
    }
    const idx = Math.max(
      0,
      useFitnessStore.getState().activeSession!.exerciseIds.indexOf(exercise.id)
    );
    goToExercise(idx);
    router.push(`/session/${exercise.category}`);
  };

  const handleMarkComplete = () => {
    if (activeSession && activeSession.category === exercise.category) {
      markExerciseComplete(exercise.id);
    }
    setCompletedJustNow(true);
    showToast(`${exercise.name} marked as complete`, "success");
    setTimeout(() => setCompletedJustNow(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <Link
          href={`/exercises?category=${exercise.category}`}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
            <ChevronLeft size={16} />
          </div>
          <span>Back to {cat.name} Library</span>
        </Link>

        {/* Index counter in category */}
        {currentIndex >= 0 && (
          <span className="text-xs font-mono text-white/40">
            Exercise {currentIndex + 1} of {categoryExercises.length}
          </span>
        )}
      </div>

      {/* Main Showcase Glass Card */}
      <GlassCard className="overflow-hidden border-white/10 bg-base-900/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* 4-Phase Hero Visual with Lightbox */}
        <ExercisePoseCompare
          exercise={exercise}
          className="aspect-[16/10] sm:aspect-[16/9] md:h-[400px]"
        />

        {/* Card Body */}
        <div className="p-5 sm:p-7 md:p-8 space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {exercise.name}
              </h1>

              <Badge
                className="px-3 py-1 text-xs uppercase font-extrabold tracking-wider"
                style={{
                  color: cat.color,
                  borderColor: `${cat.color}60`,
                  backgroundColor: `${cat.color}15`,
                  boxShadow: `0 0 16px -2px ${cat.color}25`,
                }}
              >
                {exercise.targetMuscle}
              </Badge>
            </div>

            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-white/60">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 font-medium">
                {exercise.difficulty}
              </span>

              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 font-medium flex items-center gap-1.5">
                <Dumbbell size={12} className="text-primary" />
                {exercise.equipment}
              </span>

              {exercise.unilateral && (
                <span className="px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/25 text-secondary-light font-medium">
                  Single Side / Unilateral
                </span>
              )}

              {exercise.isBodyweight && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
                  Bodyweight
                </span>
              )}
            </div>
          </div>

          {/* Safety Notice Banner */}
          {exercise.safetyNote && (
            <div className="flex gap-3.5 items-start p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.08)]">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-0.5">
                  Safety Precaution
                </p>
                <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                  {exercise.safetyNote}
                </p>
              </div>
            </div>
          )}

          {/* Redesigned Stat & Progression Plan Component */}
          <ExerciseStatBar exercise={exercise} />

          {/* Execution & Mistakes Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Form Instructions */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
                <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Sparkles size={13} />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Step-by-Step Form Execution
                </h3>
              </div>

              <ol className="space-y-3">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 text-xs sm:text-sm text-white/75 leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center border border-primary/25 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertTriangle size={13} />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Common Pitfalls to Avoid
                </h3>
              </div>

              <ul className="space-y-3">
                {exercise.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-3 text-xs sm:text-sm text-white/75 leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold flex items-center justify-center border border-rose-500/25 mt-0.5">
                      ✕
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Elevated Action Controls */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 text-base font-extrabold shadow-[0_0_24px_rgba(198,241,53,0.3)] hover:shadow-[0_0_32px_rgba(198,241,53,0.5)] transition-all active:scale-[0.98]"
              onClick={handleStart}
            >
              <Play size={18} fill="currentColor" /> Start in Active Session
            </Button>

            <Button
              size="lg"
              variant="outline"
              className={`flex-1 text-sm font-bold transition-all ${
                completedJustNow ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : ""
              }`}
              onClick={handleMarkComplete}
            >
              {completedJustNow ? (
                <>
                  <Check size={18} className="text-emerald-400" /> Completed!
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Mark Exercise Complete
                </>
              )}
            </Button>
          </div>

          {/* Optional Skip / Replace Link */}
          {exercise.canSkipReplace && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setSkipped((v) => !v);
                  showToast(
                    skipped ? "Exercise restored" : "Exercise marked as skipped/replaced",
                    "info"
                  );
                }}
                className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
              >
                <RotateCcw size={12} />
                {skipped ? "Undo skip / Restore to routine" : "Can't do this? Skip or substitute"}
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Prev / Next Exercise Carousel Navigation */}
      {(prevExercise || nextExercise) && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {prevExercise ? (
            <Link
              href={`/exercises/${prevExercise.id}`}
              className="p-3.5 rounded-2xl bg-base-900/50 hover:bg-base-900 border border-white/5 hover:border-white/15 transition-all group flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center shrink-0">
                <ChevronLeft size={16} className="text-white/60 group-hover:text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                  Previous Exercise
                </p>
                <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                  {prevExercise.name}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextExercise ? (
            <Link
              href={`/exercises/${nextExercise.id}`}
              className="p-3.5 rounded-2xl bg-base-900/50 hover:bg-base-900 border border-white/5 hover:border-white/15 transition-all group flex items-center justify-end gap-3 text-right"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                  Next Exercise
                </p>
                <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                  {nextExercise.name}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center shrink-0">
                <ChevronRight size={16} className="text-white/60 group-hover:text-white" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
