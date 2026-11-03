"use client";

import { useState } from "react";
import Link from "next/link";
import { Reorder, useDragControls } from "framer-motion";
import { ArrowDown, ArrowUp, Check, GripVertical, ListOrdered, RotateCcw } from "lucide-react";
import { CategorySlug, Exercise } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { useWorkoutExercises } from "@/lib/useWorkoutExercises";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { MuscleTags } from "@/components/exercises/MuscleTags";
import { ExerciseFlags } from "@/components/exercises/ExerciseFlags";
import { Button } from "@/components/ui/Button";

interface WorkoutExerciseListProps {
  category: CategorySlug;
  light?: boolean;
  limit?: number;
  gridClassName?: string;
}

/**
 * A workout's exercise sequence. Rearranging only changes this workout's saved order;
 * the exercise library keeps its own fixed order.
 */
export function WorkoutExerciseList({
  category,
  light,
  limit,
  gridClassName = "grid grid-cols-1 min-[440px]:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4",
}: WorkoutExerciseListProps) {
  const { exercises, isCustomOrder, setOrder, resetOrder } = useWorkoutExercises(category, light, limit);
  const [editing, setEditing] = useState(false);
  const accent = getCategory(category).color;
  const ids = exercises.map((e) => e.id);

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs text-white/45">
          {editing
            ? "Drag the handle or use the arrows. This only changes this workout, not the library."
            : isCustomOrder
            ? "Using your custom order."
            : "Default order."}
        </p>
        <div className="flex items-center gap-2">
          {isCustomOrder && (
            <Button variant="ghost" size="sm" onClick={resetOrder}>
              <RotateCcw size={14} /> Reset
            </Button>
          )}
          <Button variant={editing ? "primary" : "outline"} size="sm" onClick={() => setEditing((v) => !v)}>
            {editing ? (
              <>
                <Check size={14} /> Done
              </>
            ) : (
              <>
                <ListOrdered size={14} /> Reorder
              </>
            )}
          </Button>
        </div>
      </div>

      {editing ? (
        <Reorder.Group axis="y" values={ids} onReorder={setOrder} className="space-y-2">
          {exercises.map((ex, i) => (
            <SequenceRow
              key={ex.id}
              exercise={ex}
              index={i}
              total={exercises.length}
              accent={accent}
              onMove={(delta) => move(i, delta)}
            />
          ))}
        </Reorder.Group>
      ) : (
        <div className={gridClassName}>
          {exercises.map((ex, i) => (
            <ExerciseCard key={ex.id} exercise={ex} position={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SequenceRowProps {
  exercise: Exercise;
  index: number;
  total: number;
  accent: string;
  onMove: (delta: number) => void;
}

function SequenceRow({ exercise, index, total, accent, onMove }: SequenceRowProps) {
  // Drag starts only from the handle so the row can still be scrolled past on touch screens.
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={exercise.id}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-base-900/80 border border-white/[0.08] select-none"
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", zIndex: 10 }}
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="w-8 h-10 shrink-0 flex items-center justify-center text-white/35 hover:text-white cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
        aria-label={`Drag to reorder ${exercise.name}`}
        tabIndex={-1}
      >
        <GripVertical size={18} />
      </button>
      <span
        className="w-7 h-7 shrink-0 rounded-full text-xs font-bold flex items-center justify-center text-base-900"
        style={{ backgroundColor: accent }}
      >
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <Link
          href={`/exercises/${exercise.id}`}
          className="block text-sm font-bold text-white truncate hover:text-primary"
          draggable={false}
        >
          {exercise.name}
        </Link>
        <MuscleTags exercise={exercise} accent={accent} className="truncate" />
        <ExerciseFlags exercise={exercise} className="mt-1" />
      </div>
      <div className="flex flex-col shrink-0">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          className="w-8 h-7 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20"
          aria-label={`Move ${exercise.name} up`}
        >
          <ArrowUp size={15} />
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          className="w-8 h-7 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20"
          aria-label={`Move ${exercise.name} down`}
        >
          <ArrowDown size={15} />
        </button>
      </div>
    </Reorder.Item>
  );
}
