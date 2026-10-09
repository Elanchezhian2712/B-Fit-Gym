"use client";

import { Moon, Footprints, BedDouble } from "lucide-react";
import { getTodaySchedule, isFullAbsDay } from "@/lib/data/schedule";
import { getCategory } from "@/lib/data/categories";
import { getExercisesByCategory } from "@/lib/data/exercises";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TodayOverviewHero } from "@/components/today/TodayOverviewHero";
import { CategoryWorkoutSection } from "@/components/today/CategoryWorkoutSection";
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
  const workoutSessions = useFitnessStore((s) => s.workoutSessions);

  const tookRestToday = restOverrides[date] ?? false;
  const carriedOver = postponedCategories[date] ?? [];
  const categories: CategorySlug[] = tookRestToday
    ? []
    : Array.from(new Set([...schedule.categories, ...carriedOver]));

  const showRestDay = tookRestToday || (schedule.isRestDay && categories.length === 0);
  const showRecoveryDay = !tookRestToday && schedule.isRecoveryDay && categories.length === 0;
  const canTakeRest = !tookRestToday && !showRestDay && categories.length > 0;
  const fullAbsDay = isFullAbsDay(categories);

  const completedToday = new Set(
    workoutSessions.filter((s) => s.date === date && s.completed).map((s) => s.category)
  );

  const categoryData = categories.map((slug) => ({
    slug,
    category: getCategory(slug),
    exercises: getExercisesByCategory(slug, slug === "abs-cardio" && !fullAbsDay),
    completed: completedToday.has(slug),
  }));

  const totalExercises = categoryData.reduce((sum, c) => sum + c.exercises.length, 0);
  const totalDuration = categoryData.reduce((sum, c) => sum + c.category.estimatedDuration, 0);
  const completedCount = categoryData.filter((c) => c.completed).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Today&apos;s Workout</h1>
        {canTakeRest && (
          <Button variant="outline" size="sm" onClick={takeRestToday}>
            <BedDouble size={16} /> Take Rest Today
          </Button>
        )}
      </div>

      {tookRestToday ? (
        <GlassCard className="p-10 flex flex-col items-center text-center gap-3 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <BedDouble size={30} className="text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-white">Resting Today</h2>
          <p className="text-sm text-white/50 max-w-sm">
            You chose to rest today. Today&apos;s workout has been moved to tomorrow.
          </p>
        </GlassCard>
      ) : showRestDay ? (
        <GlassCard className="p-10 flex flex-col items-center text-center gap-3 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Moon size={30} className="text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-white">It&apos;s a Rest Day</h2>
          <p className="text-sm text-white/50 max-w-sm">
            No scheduled training today. Focus on recovery, hydration, mobility, and sleep.
          </p>
        </GlassCard>
      ) : showRecoveryDay ? (
        <GlassCard className="p-10 flex flex-col items-center text-center gap-3 animate-fadeIn">
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
        <>
          <TodayOverviewHero
            date={formatDate()}
            categories={categories}
            totalExercises={totalExercises}
            totalDuration={totalDuration}
            completedCategories={completedCount}
          />

          <div className="space-y-6 sm:space-y-8">
            {categoryData.map((c) => (
              <CategoryWorkoutSection
                key={c.slug}
                category={c.category}
                exercises={c.exercises}
                completed={c.completed}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
