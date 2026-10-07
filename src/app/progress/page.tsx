"use client";

import { useEffect, useState } from "react";
import { Scale, Target, TrendingDown, Flame, CalendarCheck } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeightChart } from "@/components/progress/WeightChart";
import { WeightLogForm } from "@/components/progress/WeightLogForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { getCategory } from "@/lib/data/categories";
import { useFitnessStore } from "@/lib/store";

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const startingWeight = useFitnessStore((s) => s.startingWeight);
  const currentWeight = useFitnessStore((s) => s.currentWeight);
  const goalWeight = useFitnessStore((s) => s.goalWeight);
  const streak = useFitnessStore((s) => s.getStreak());
  const sessions = useFitnessStore((s) => s.workoutSessions);

  const weightLost = Math.max(0, startingWeight - currentWeight);
  const remaining = Math.max(0, currentWeight - goalWeight);
  const recentSessions = [...sessions].reverse().slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Progress</h1>
        <p className="text-white/45 text-sm mt-1">Track your transformation over time.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <MetricCard label="Starting" value={mounted ? `${startingWeight} kg` : "--"} icon={Scale} accent="#4D7CFE" />
        <MetricCard label="Current" value={mounted ? `${currentWeight.toFixed(2)} kg` : "--"} icon={Scale} accent="#A855F7" />
        <MetricCard label="Goal" value={mounted ? `${goalWeight} kg` : "--"} icon={Target} accent="#C6F135" />
        <MetricCard label="Lost" value={mounted ? `${weightLost.toFixed(2)} kg` : "--"} icon={TrendingDown} accent="#34D399" />
        <div className="col-span-2 sm:col-span-1">
          <MetricCard label="Streak" value={mounted ? `${streak}d` : "--"} icon={Flame} accent="#FF5C5C" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WeightChart />
          <GlassCard className="p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CalendarCheck size={15} className="text-primary" /> Workout History
            </h3>
            {recentSessions.length === 0 ? (
              <p className="text-sm text-white/40 py-6 text-center">
                No workouts logged yet. Complete a session to see it here.
              </p>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((s) => {
                  const cat = getCategory(s.category);
                  const sets = s.exerciseLogs.reduce((sum, e) => sum + e.sets.filter((x) => x.completed).length, 0);
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <div>
                          <p className="text-sm font-semibold text-white">{cat.name}</p>
                          <p className="text-[11px] text-white/40">{s.date}</p>
                        </div>
                      </div>
                      <span className="text-xs text-white/50">{sets} sets</span>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
        <div className="space-y-6">
          <WeightLogForm />
        </div>
      </div>
    </div>
  );
}
