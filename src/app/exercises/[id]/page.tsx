"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ChevronLeft, CheckCircle2, AlertTriangle, Repeat } from "lucide-react";
import { getExerciseById } from "@/lib/data/exercises";
import { getCategory } from "@/lib/data/categories";
import { ExercisePoseCompare } from "@/components/exercises/ExercisePoseCompare";
import { ExerciseStatBar } from "@/components/exercises/ExerciseStatBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useFitnessStore } from "@/lib/store";
import { useToast } from "@/components/common/ToastProvider";

export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const exercise = getExerciseById(params.id);
  if (!exercise) notFound();

  const cat = getCategory(exercise.category);
  const router = useRouter();
  const { showToast } = useToast();
  const [skipped, setSkipped] = useState(false);

  const activeSession = useFitnessStore((s) => s.activeSession);
  const startSession = useFitnessStore((s) => s.startSession);
  const goToExercise = useFitnessStore((s) => s.goToExercise);
  const markExerciseComplete = useFitnessStore((s) => s.markExerciseComplete);

  const handleStart = () => {
    if (!activeSession || activeSession.category !== exercise.category) {
      startSession(exercise.category);
    }
    const idx = Math.max(0, useFitnessStore.getState().activeSession!.exerciseIds.indexOf(exercise.id));
    goToExercise(idx);
    router.push(`/session/${exercise.category}`);
  };

  const handleMarkComplete = () => {
    if (activeSession && activeSession.category === exercise.category) {
      markExerciseComplete(exercise.id);
    }
    showToast(`${exercise.name} marked as complete`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/exercises" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ChevronLeft size={16} /> Back to Library
      </Link>

      <GlassCard className="overflow-hidden">
        <ExercisePoseCompare exercise={exercise} className="h-56 md:h-72" />
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{exercise.name}</h1>
            <Badge style={{ color: cat.color, borderColor: `${cat.color}50`, backgroundColor: `${cat.color}15` }}>
              {exercise.targetMuscle}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/45 mb-6">
            <span>{exercise.difficulty}</span>
            <span>•</span>
            <span>{exercise.equipment}</span>
            {exercise.unilateral && (
              <>
                <span>•</span>
                <span>One side at a time</span>
              </>
            )}
          </div>

          {exercise.safetyNote && (
            <div className="flex gap-3 items-start p-4 rounded-xl bg-muscle-legs/10 border border-muscle-legs/30 mb-6">
              <AlertTriangle size={18} className="text-muscle-legs shrink-0 mt-0.5" />
              <p className="text-sm text-muscle-legs/90">{exercise.safetyNote}</p>
            </div>
          )}

          <ExerciseStatBar exercise={exercise} />

          <div className="grid md:grid-cols-2 gap-6 mb-7">
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Repeat size={15} className="text-primary" /> Form Instructions
              </h3>
              <ol className="space-y-2.5">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/65">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle size={15} className="text-muscle-chestSoft" /> Common Mistakes
              </h3>
              <ul className="space-y-2.5">
                {exercise.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/65">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-muscle-chestSoft mt-2" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1" onClick={handleStart}>
              Start Exercise
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={handleMarkComplete}>
              <CheckCircle2 size={18} /> Mark Complete
            </Button>
          </div>

          {exercise.canSkipReplace && (
            <button
              onClick={() => {
                setSkipped((v) => !v);
                showToast(skipped ? "Exercise restored" : "Exercise marked as skipped/replaced", "info");
              }}
              className="mt-4 text-xs text-white/40 hover:text-white/70 underline underline-offset-2"
            >
              {skipped ? "Undo skip" : "Mark as skipped / replaced"}
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
