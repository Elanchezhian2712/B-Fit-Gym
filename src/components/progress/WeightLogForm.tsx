"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useFitnessStore } from "@/lib/store";
import { useToast } from "@/components/common/ToastProvider";
import { todayISO } from "@/lib/utils";

export function WeightLogForm() {
  const addWeightEntry = useFitnessStore((s) => s.addWeightEntry);
  const weightEntries = useFitnessStore((s) => s.weightEntries);
  const { showToast } = useToast();
  const [value, setValue] = useState("");

  const lastEntry = weightEntries[weightEntries.length - 1];
  const daysSinceLast = lastEntry
    ? Math.floor((Date.now() - new Date(lastEntry.date).getTime()) / 86400000)
    : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    addWeightEntry(parsed, todayISO());
    setValue("");
    showToast("Weight logged for today");
  }

  return (
    <GlassCard className="p-5 animate-fadeIn">
      <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
        <Scale size={15} className="text-secondary" /> Log Weight
      </h3>
      <p className="text-xs text-white/40 mb-4">
        {daysSinceLast !== null
          ? `Recommended every 20 days • last logged ${daysSinceLast === 0 ? "today" : `${daysSinceLast}d ago`}`
          : "Log your weight to start tracking."}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 89.5"
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-secondary"
        />
        <Button type="submit" variant="secondary">
          Save
        </Button>
      </form>
    </GlassCard>
  );
}
