"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { X, ChevronRight, AlertTriangle } from "lucide-react";
import { categories, getCategory } from "@/lib/data/categories";
import { getExerciseById } from "@/lib/data/exercises";
import { useFitnessStore } from "@/lib/store";
import { CategorySlug, WorkoutSessionLog } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExercisePoseCompare } from "@/components/exercises/ExercisePoseCompare";
import { SetTracker } from "@/components/session/SetTracker";
import { RestTimer } from "@/components/session/RestTimer";
import { WorkoutComplete } from "@/components/session/WorkoutComplete";
import { parseRestSeconds, parseWarmup } from "@/lib/utils";
import { useToast } from "@/components/common/ToastProvider";

export default function SessionPage({ params }: { params: { category: string } }) {
  const slug = params.category as CategorySlug;
  if (!categories.some((c) => c.slug === slug)) notFound();

  const router = useRouter();
  const { showToast } = useToast();
  const cat = getCategory(slug);

  const activeSession = useFitnessStore((s) => s.activeSession);
  const startSession = useFitnessStore((s) => s.startSession);
  const updateSet = useFitnessStore((s) => s.updateSet);
  const markExerciseComplete = useFitnessStore((s) => s.markExerciseComplete);
  const goToNextExercise = useFitnessStore((s) => s.goToNextExercise);
  const completeSession = useFitnessStore((s) => s.completeSession);
  const getLastWeightForExercise = useFitnessStore((s) => s.getLastWeightForExercise);

  const [resting, setResting] = useState(false);
  const [finishedLog, setFinishedLog] = useState<WorkoutSessionLog | null>(null);

  useEffect(() => {
    if (!activeSession || activeSession.category !== slug) {
      startSession(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (finishedLog) {
    return <WorkoutComplete log={finishedLog} />;
  }

  if (!activeSession || activeSession.category !== slug) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-white/40 text-sm">Loading workout...</div>
    );
  }

  const exerciseId = activeSession.exerciseIds[activeSession.currentExerciseIndex];
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return null;

  const log = activeSession.logs[exerciseId];
  const previousSets = getLastWeightForExercise(exerciseId);
  const isLastExercise = activeSession.currentExerciseIndex === activeSession.exerciseIds.length - 1;
  const allSetsDone = log.sets.every((s) => s.completed);

  function handleToggleSet(setIndex: number) {
    const set = log.sets[setIndex];
    const isWarmupRow = set.setNumber === 0;
    const fallbackWeight = isWarmupRow
      ? exercise!.warmup
        ? parseWarmup(exercise!.warmup).weight
        : "Light"
      : exercise!.workingWeight || "";
    const fallbackReps = isWarmupRow
      ? exercise!.warmup
        ? parseWarmup(exercise!.warmup).reps
        : "12"
      : exercise!.reps;
    const willComplete = !set.completed;
    updateSet(exerciseId, setIndex, {
      completed: willComplete,
      weight: set.weight || fallbackWeight,
      reps: set.reps || fallbackReps,
    });
    if (willComplete) {
      const stillMore = log.sets.some((s, i) => i !== setIndex && !s.completed);
      if (stillMore) setResting(true);
    }
  }

  function handleNext() {
    markExerciseComplete(exerciseId);
    setResting(false);
    if (isLastExercise) {
      const result = completeSession();
      if (result) setFinishedLog(result);
    } else {
      goToNextExercise();
      showToast(`${exercise?.name} complete. Next up!`, "success");
    }
  }

  function handleExit() {
    router.push(`/workouts/${slug}`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <button
          onClick={handleExit}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
          aria-label="Exit workout"
        >
          <X size={18} />
        </button>
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
            <span>
              Exercise {activeSession.currentExerciseIndex + 1} / {activeSession.exerciseIds.length}
            </span>
            <span style={{ color: cat.color }}>{cat.name}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((activeSession.currentExerciseIndex + (allSetsDone ? 1 : 0)) / activeSession.exerciseIds.length) * 100}%`,
                backgroundColor: cat.color,
              }}
            />
          </div>
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <ExercisePoseCompare exercise={exercise} className="h-44" />
        <div className="p-5 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">{exercise.name}</h1>
          <p className="text-sm mb-4" style={{ color: cat.color }}>
            {exercise.targetMuscle}
          </p>

          {exercise.safetyNote && (
            <div className="flex gap-2.5 items-start p-3.5 rounded-xl bg-muscle-legs/10 border border-muscle-legs/30 mb-4">
              <AlertTriangle size={16} className="text-muscle-legs shrink-0 mt-0.5" />
              <p className="text-xs text-muscle-legs/90">{exercise.safetyNote}</p>
            </div>
          )}

          {exercise.warmup && (
            <Badge variant="warning" className="mb-4">
              {log.sets.length} Sets: Warm-up + {exercise.sets} Working × {exercise.reps}
            </Badge>
          )}

          {exercise.unilateral && (
            <p className="text-xs text-white/40 mb-4 -mt-2">
              Complete one side fully before switching to the other.
            </p>
          )}

          <div className="space-y-2.5">
            {log.sets.map((set, i) => {
              const isWarmupRow = set.setNumber === 0;
              const warmupParsed = exercise.warmup ? parseWarmup(exercise.warmup) : null;
              return (
                <SetTracker
                  key={i}
                  set={set}
                  previous={previousSets ? previousSets[i] ?? null : null}
                  defaultWeight={isWarmupRow ? warmupParsed?.weight ?? "Light" : exercise.workingWeight ?? "BW"}
                  defaultReps={isWarmupRow ? warmupParsed?.reps ?? "12" : exercise.reps}
                  accent={cat.color}
                  onChange={(patch) => updateSet(exerciseId, i, patch)}
                  onToggleComplete={() => handleToggleSet(i)}
                />
              );
            })}
          </div>

          {resting && (
            <div className="mt-5">
              <RestTimer
                seconds={parseRestSeconds(exercise.rest)}
                onComplete={() => setResting(false)}
                onSkip={() => setResting(false)}
              />
            </div>
          )}

          <Button size="lg" className="w-full mt-6" onClick={handleNext} disabled={!allSetsDone}>
            {isLastExercise ? "Finish Workout" : "Next Exercise"}
            <ChevronRight size={18} />
          </Button>
        </div>
      </GlassCard>

      <Link href={`/exercises/${exercise.id}`} className="block text-center text-xs text-white/35 hover:text-white/60">
        View full exercise details
      </Link>
    </div>
  );
}
