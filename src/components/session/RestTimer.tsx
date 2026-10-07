"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, SkipForward, Timer } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/Button";

interface RestTimerProps {
  seconds: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ seconds, onComplete, onSkip }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const total = useRef(seconds);

  useEffect(() => {
    setRemaining(seconds);
    total.current = seconds;
  }, [seconds]);

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, paused]);

  const progress = ((total.current - remaining) / total.current) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 p-6 rounded-2xl bg-secondary/[0.07] border border-secondary/20"
    >
      <p className="text-xs font-bold uppercase tracking-wide text-secondary flex items-center gap-1.5">
        <Timer size={14} /> Rest Timer
      </p>
      <ProgressRing
        progress={progress}
        color="#4D7CFE"
        size={140}
        strokeWidth={10}
        label={`${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, "0")}`}
        sublabel="remaining"
      />
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => setPaused((p) => !p)}>
          {paused ? <Play size={15} /> : <Pause size={15} />}
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button variant="secondary" size="sm" onClick={onSkip}>
          <SkipForward size={15} /> Skip Rest
        </Button>
      </div>
    </motion.div>
  );
}
