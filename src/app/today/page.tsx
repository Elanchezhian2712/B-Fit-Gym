"use client";

import Link from "next/link";
import { Clock, Dumbbell, Moon, Footprints, BedDouble } from "lucide-react";
import { getTodaySchedule, isFullAbsDay } from "@/lib/data/schedule";
import { getCategory } from "@/lib/data/categories";
import { getExercisesByCategory } from "@/lib/data/exercises";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { useFitnessStore } from "@/lib/store";
import { CategorySlug } from "@/lib/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TodaysWorkoutPage() {
  const schedule = getTodaySchedule();
  const date = todayISO();
  const restOverrides = useFitnessStore((s) => s.restOverrides);
  const postponedCategories = useFitnessStore((s) => s.postponedCategories);
  const takeRestToday = useFitnessStore((s) => s.takeRestToday);

  const tookRestToday = restOverrides[date] ?? false;
  const carriedOver = postponedCategories[date] ?? [];
  const categories: CategorySlug[] = tookRestToday
    ? []
    : Array.from(new Set([...schedule.categories, ...carriedOver]));

  const showRestDay = tookRestToday || (schedule.isRestDay && categories.length === 0);
  const showRecoveryDay = !tookRestToday && schedule.isRecoveryDay && categories.length === 0;
  const canTakeRest = !tookRestToday && !showRestDay && categories.length > 0;
  const fullAbsDay = isFullAbsDay(categories);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Today&apos;s Workout</h1>
          <p className="text-white/45 text-sm mt-1">{formatDate()}</p>
        </div>
        {canTakeRest && (
          <Button variant="outline" size="sm" onClick={takeRestToday}>
            <BedDouble size={16} /> Take Rest Today
          </Button>
        )}
      </div>

      {tookRestToday ? (
        <GlassCard className="p-10 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <BedDouble size={30} className="text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-white">Resting Today</h2>
          <p className="text-sm text-white/50 max-w-sm">
            You chose to rest today. Today&apos;s workout has been moved to tomorrow.
          </p>
        </GlassCard>
      ) : showRestDay ? (
        <GlassCard className="p-10 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Moon size={30} className="text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-white">It&apos;s a Rest Day</h2>
          <p className="text-sm text-white/50 max-w-sm">
            No scheduled training today. Focus on recovery, hydration, mobility, and sleep.
          </p>
        </GlassCard>
      ) : showRecoveryDay ? (
        <GlassCard className="p-10 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Footprints size={30} className="text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-white">Recovery Day</h2>
          <p className="text-sm text-white/50 max-w-sm">
            Active recovery today: {schedule.recoveryActivities?.join(" and ") ?? "light walking and stretching"}.
            No structured workout is scheduled.
          </p>
        </GlassCard>
      ) : (
        categories.map((catSlug) => {
          const cat = getCategory(catSlug);
          const exs = getExercisesByCategory(catSlug, catSlug === "abs-cardio" && !fullAbsDay);
          return (
            <div key={catSlug} className="space-y-4">
              <GlassCard
                className="p-6 flex items-center justify-between flex-wrap gap-4"
                style={{ backgroundImage: `linear-gradient(135deg, ${cat.color}1f 0%, transparent 70%)` }}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: cat.color }}>
                    {cat.name}
                  </p>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {cat.name} Workout{cat.level ? ` – ${cat.level}` : ""}
                  </h2>
                  <div className="flex items-center gap-4 mt-3 text-white/55 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Dumbbell size={15} /> {exs.length} Exercises
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} /> ~{cat.estimatedDuration} min
                    </span>
                  </div>
                </div>
                <Link href={`/session/${catSlug}`}>
                  <Button size="lg">Start Workout</Button>
                </Link>
              </GlassCard>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {exs.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
