"use client";

import { Moon } from "lucide-react";
import { weeklySchedule, getTodaySchedule, getWorkoutVariant } from "@/lib/data/schedule";
import { getCategory } from "@/lib/data/categories";
import { getExercisesByCategory } from "@/lib/data/exercises";
import { GlassCard } from "@/components/ui/GlassCard";

export default function WeeklyPlanPage() {
  const today = getTodaySchedule().day;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Weekly Plan</h1>
        <p className="text-sm text-white/50 mt-1">What you&apos;re training every day of the week.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {weeklySchedule.map((d) => {
          const isToday = d.day === today;
          return (
            <GlassCard key={d.day} className={`p-5 space-y-4 ${isToday ? "ring-1 ring-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{d.day}</h2>
                {isToday && (
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Today</span>
                )}
              </div>

              {d.categories.length === 0 ? (
                <div className="flex items-center gap-3 text-white/50">
                  <Moon size={20} className="text-secondary" />
                  <span className="text-sm">Rest day</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {d.categories.map((slug) => {
                    const category = getCategory(slug);
                    const list = getExercisesByCategory(slug, getWorkoutVariant(slug, d.categories));
                    return (
                      <div key={slug} className="space-y-2">
                        <h3 className="text-sm font-semibold" style={{ color: category.color }}>
                          {category.name}
                        </h3>
                        <ul className="space-y-1">
                          {list.map((e) => (
                            <li key={e.id} className="flex justify-between gap-3 text-sm text-white/70">
                              <span>{e.name}</span>
                              <span className="text-white/40 whitespace-nowrap">
                                {e.sets} × {e.reps}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
