"use client";

import { useEffect, useState } from "react";
import { Scale, Target, TrendingDown, Flame, CheckCircle2, Activity } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WorkoutCalendar } from "@/components/dashboard/WorkoutCalendar";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { WeeklyProgressChart } from "@/components/dashboard/WeeklyProgressChart";
import { useFitnessStore } from "@/lib/store";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentWeight = useFitnessStore((s) => s.currentWeight);
  const goalWeight = useFitnessStore((s) => s.goalWeight);
  const startingWeight = useFitnessStore((s) => s.startingWeight);
  const streak = useFitnessStore((s) => s.getStreak());
  const sessions = useFitnessStore((s) => s.workoutSessions);

  const weightLost = Math.max(0, startingWeight - currentWeight);
  const remaining = Math.max(0, currentWeight - goalWeight);
  const completedThisWeek = mounted
    ? sessions.filter((s) => {
        const d = new Date(s.date);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / 86400000;
        return diff < 7;
      }).length
    : 0;

  return (
    <div className="space-y-6">
      <div className="animate-fadeIn">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{getGreeting()} 👋</h1>
        <p className="text-white/45 text-sm mt-1">Ready for today&apos;s workout?</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Current Weight"
          value={mounted ? `${currentWeight.toFixed(2)} kg` : "--"}
          icon={Scale}
          accent="#4D7CFE"
        />
        <MetricCard
          label="Goal Weight"
          value={mounted ? `${goalWeight} kg` : "--"}
          icon={Target}
          accent="#C6F135"
        />
        <MetricCard
          label="Remaining"
          value={mounted ? `${remaining.toFixed(2)} kg` : "--"}
          sub={mounted ? `Lost ${weightLost.toFixed(2)} kg so far` : undefined}
          icon={TrendingDown}
          accent="#FBBF24"
        />
        <MetricCard
          label="Workout Streak"
          value={mounted ? `${streak} Days` : "--"}
          icon={Flame}
          accent="#FF5C5C"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WorkoutCalendar />
          <WeeklyProgressChart />
        </div>
        <div className="space-y-6">
          <TodayWorkoutCard />
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Completed"
              value={mounted ? `${completedThisWeek}` : "--"}
              sub="This week"
              icon={CheckCircle2}
              accent="#34D399"
            />
            <MetricCard
              label="Total Sessions"
              value={mounted ? `${sessions.length}` : "--"}
              sub="All time"
              icon={Activity}
              accent="#A855F7"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
