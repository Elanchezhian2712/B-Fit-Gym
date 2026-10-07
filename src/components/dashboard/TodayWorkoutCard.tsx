"use client";

import Link from "next/link";
import { getTodaySchedule } from "@/lib/data/schedule";
import { getCategory } from "@/lib/data/categories";
import { getExercisesByCategory } from "@/lib/data/exercises";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Clock, Dumbbell, Moon, Footprints } from "lucide-react";

export function TodayWorkoutCard() {
  const schedule = getTodaySchedule();

  if (schedule.isRestDay) {
    return (
      <GlassCard className="p-7 flex flex-col items-center text-center gap-3 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
          <Moon size={26} className="text-secondary" />
        </div>
        <h3 className="text-lg font-bold text-white">Rest Day</h3>
        <p className="text-sm text-white/50 max-w-xs">
          Recovery is part of the plan. Hydrate, stretch, and come back strong tomorrow.
        </p>
      </GlassCard>
    );
  }

  if (schedule.isRecoveryDay) {
    return (
      <GlassCard className="p-7 flex flex-col items-center text-center gap-3 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
          <Footprints size={26} className="text-secondary" />
        </div>
        <h3 className="text-lg font-bold text-white">Recovery Day</h3>
        <p className="text-sm text-white/50 max-w-xs">
          {schedule.recoveryActivities?.join(" · ") ?? "Light walking / stretching"}
        </p>
      </GlassCard>
    );
  }

  const totalExercises = schedule.categories.reduce(
    (sum, c) => sum + getExercisesByCategory(c).length,
    0
  );
  const totalDuration = schedule.categories.reduce((sum, c) => sum + getCategory(c).estimatedDuration, 0);
  const primaryCategory = schedule.categories[0];
  const cat = getCategory(primaryCategory);

  return (
    <GlassCard
      className="p-6 md:p-7 relative overflow-hidden animate-fadeIn"
      style={{
        backgroundImage: `linear-gradient(135deg, ${cat.color}14 0%, transparent 60%)`,
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold uppercase tracking-wide text-white/40">Today&apos;s Workout</span>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
        >
          {schedule.categories.map((c) => getCategory(c).name).join(" + ")}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
        {schedule.categories.map((c) => getCategory(c).name).join(" + ")} Day
      </h2>
      <p className="text-sm text-white/45 mb-6">Train with purpose. Every rep counts.</p>

      <div className="flex items-center gap-6 mb-7">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Dumbbell size={16} />
          <span>{totalExercises} Exercises</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Clock size={16} />
          <span>~{totalDuration} min</span>
        </div>
      </div>

      <Link href={`/session/${primaryCategory}`} className="block">
        <Button size="lg" className="w-full">
          Start Workout
        </Button>
      </Link>
    </GlassCard>
  );
}
