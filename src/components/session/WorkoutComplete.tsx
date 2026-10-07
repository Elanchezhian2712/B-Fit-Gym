"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PartyPopper, Dumbbell, Repeat, Clock, ListChecks } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatDuration } from "@/lib/utils";
import { WorkoutSessionLog } from "@/lib/types";

const messages = [
  "Great work! Another workout completed.",
  "Strong effort today. Your consistency is paying off.",
  "That's how progress is made. See you next session.",
  "Workout logged. Recovery starts now.",
];

export function WorkoutComplete({ log }: { log: WorkoutSessionLog }) {
  const totalSets = log.exerciseLogs.reduce((s, e) => s + e.sets.filter((x) => x.completed).length, 0);
  const totalReps = log.exerciseLogs.reduce(
    (s, e) => s + e.sets.reduce((a, x) => a + (x.completed ? parseInt(x.reps) || 0 : 0), 0),
    0
  );
  const exercisesCompleted = log.exerciseLogs.filter((e) => e.sets.some((s) => s.completed)).length;
  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="max-w-lg mx-auto py-10 space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="flex flex-col items-center text-center gap-3"
      >
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center animate-pulseGlow">
          <PartyPopper size={36} className="text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Workout Complete 🔥</h1>
        <p className="text-white/50 text-sm max-w-xs">{message}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5 flex flex-col items-center gap-2">
          <Dumbbell size={18} className="text-primary" />
          <p className="text-2xl font-bold text-white">{exercisesCompleted}</p>
          <p className="text-xs text-white/45">Exercises Completed</p>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col items-center gap-2">
          <ListChecks size={18} className="text-secondary" />
          <p className="text-2xl font-bold text-white">{totalSets}</p>
          <p className="text-xs text-white/45">Total Sets</p>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col items-center gap-2">
          <Clock size={18} className="text-muscle-legs" />
          <p className="text-2xl font-bold text-white">{formatDuration(log.durationSeconds)}</p>
          <p className="text-xs text-white/45">Duration</p>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col items-center gap-2">
          <Repeat size={18} className="text-muscle-abs" />
          <p className="text-2xl font-bold text-white">{totalReps}</p>
          <p className="text-xs text-white/45">Total Reps</p>
        </GlassCard>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="flex-1">
          <Button size="lg" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/progress" className="flex-1">
          <Button size="lg" variant="outline" className="w-full">
            View Progress
          </Button>
        </Link>
      </div>
    </div>
  );
}
