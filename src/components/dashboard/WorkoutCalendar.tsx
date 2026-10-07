"use client";

import { weeklySchedule } from "@/lib/data/schedule";
import { getCategory } from "@/lib/data/categories";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { Moon, Footprints } from "lucide-react";

export function WorkoutCalendar() {
  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

  return (
    <GlassCard className="p-5 animate-fadeIn">
      <h3 className="text-sm font-bold text-white mb-4">This Week</h3>
      <div className="grid grid-cols-7 gap-2">
        {weeklySchedule.map((day, i) => {
          const isToday = i === todayIndex;
          const primaryCat = day.categories[0];
          const color = primaryCat ? getCategory(primaryCat).color : "#555";
          return (
            <div
              key={day.day}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl py-3 px-1 border transition-colors",
                isToday ? "border-primary/40 bg-primary/[0.06]" : "border-white/[0.05] bg-white/[0.02]"
              )}
            >
              <span className={cn("text-[10px] font-bold uppercase", isToday ? "text-primary" : "text-white/40")}>
                {day.shortDay}
              </span>
              {day.isRestDay ? (
                <Moon size={16} className="text-white/30" />
              ) : day.isRecoveryDay ? (
                <Footprints size={16} className="text-secondary" />
              ) : (
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color, boxShadow: isToday ? `0 0 10px ${color}` : "none" }}
                />
              )}
              <span className="text-[9px] text-white/35 text-center leading-tight hidden sm:block">
                {day.isRestDay
                  ? "Rest"
                  : day.isRecoveryDay
                  ? "Recovery"
                  : day.categories.map((c) => getCategory(c).name).join(" + ")}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
