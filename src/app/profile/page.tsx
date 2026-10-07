"use client";

import { useEffect, useState } from "react";
import { Target, Scale, Trash2, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useFitnessStore } from "@/lib/store";
import { useToast } from "@/components/common/ToastProvider";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const goalWeight = useFitnessStore((s) => s.goalWeight);
  const setGoalWeight = useFitnessStore((s) => s.setGoalWeight);
  const currentWeight = useFitnessStore((s) => s.currentWeight);
  const streak = useFitnessStore((s) => s.getStreak());
  const sessions = useFitnessStore((s) => s.workoutSessions);
  const { showToast } = useToast();

  const [goalInput, setGoalInput] = useState(String(goalWeight));

  function handleSaveGoal(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(goalInput);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    setGoalWeight(parsed);
    showToast("Goal weight updated");
  }

  function handleReset() {
    if (confirm("This will permanently clear all your logged progress. Continue?")) {
      localStorage.removeItem("my-fitness-journey-storage");
      window.location.reload();
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Profile & Settings</h1>
        <p className="text-white/45 text-sm mt-1">Manage your fitness profile and preferences.</p>
      </div>

      <GlassCard className="p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-base-900 font-bold text-xl">
          FJ
        </div>
        <div>
          <p className="text-lg font-bold text-white">My Fitness Journey</p>
          <p className="text-sm text-white/40">
            {mounted ? `${sessions.length} workouts logged • ${streak} day streak` : "Loading..."}
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Target size={15} className="text-primary" /> Goal Weight
        </h3>
        <form onSubmit={handleSaveGoal} className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary"
          />
          <Button type="submit">Save</Button>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Scale size={15} className="text-secondary" /> Current Stats
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/40 text-xs">Current Weight</p>
            <p className="text-white font-bold mt-1">{mounted ? `${currentWeight.toFixed(2)} kg` : "--"}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Goal Weight</p>
            <p className="text-white font-bold mt-1">{goalWeight} kg</p>
          </div>
        </div>
        <p className="text-xs text-white/35 mt-4">
          Update your current weight from the Progress page every 20 days to keep your trend accurate.
        </p>
      </GlassCard>

      <GlassCard className="p-6 border-muscle-chest/20">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <User size={15} className="text-white/50" /> Data
        </h3>
        <p className="text-xs text-white/40 mb-4">
          All your data is stored locally on this device. Resetting will permanently erase your progress.
        </p>
        <Button variant="outline" onClick={handleReset} className="border-muscle-chest/30 text-muscle-chestSoft">
          <Trash2 size={15} /> Reset All Data
        </Button>
      </GlassCard>
    </div>
  );
}
