"use client";

import { Clock, Dumbbell, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { getCategory } from "@/lib/data/categories";
import { CategorySlug } from "@/lib/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

interface TodayOverviewHeroProps {
  date: string;
  categories: CategorySlug[];
  totalExercises: number;
  totalDuration: number;
  completedCategories: number;
}

export function TodayOverviewHero({
  date,
  categories,
  totalExercises,
  totalDuration,
  completedCategories,
}: TodayOverviewHeroProps) {
  const total = categories.length;
  const progress = total === 0 ? 0 : Math.round((completedCategories / total) * 100);
  const allDone = total > 0 && completedCategories === total;
  const inProgress = completedCategories > 0 && !allDone;
  const primaryColor = categories[0] ? getCategory(categories[0]).color : "#C6F135";
  const title = categories.map((c) => getCategory(c).name).join(" + ");

  return (
    <GlassCard
      className="p-5 sm:p-7 md:p-8 relative overflow-hidden animate-fadeIn"
      style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}1a 0%, transparent 65%)` }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-white/40">
            {getGreeting()} &middot; {date}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white mt-1.5 leading-tight truncate">
            {title} Day
          </h1>

          <div className="mt-3">
            {allDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-lg">
                <CheckCircle2 size={13} /> Workout Complete
              </span>
            ) : inProgress ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 border border-secondary/30 px-2.5 py-1 rounded-lg">
                In Progress &middot; {completedCategories}/{total} Done
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/55 bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-lg">
                Not Started
              </span>
            )}
          </div>

          <div className="flex items-center gap-5 mt-5 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <Dumbbell size={15} /> {totalExercises} Exercises
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> ~{totalDuration} min
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-end shrink-0">
          <ProgressRing
            progress={progress}
            size={104}
            strokeWidth={9}
            color={primaryColor}
            label={`${progress}%`}
            sublabel={`${completedCategories}/${total} done`}
          />
        </div>
      </div>
    </GlassCard>
  );
}
