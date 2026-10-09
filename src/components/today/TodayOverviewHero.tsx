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
      className="p-4 sm:p-7 md:p-8 relative overflow-hidden animate-fadeIn"
      style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}1a 0%, transparent 65%)` }}
    >
      <div className="flex items-center justify-between gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-white/40 truncate">
            {getGreeting()} &middot; {date}
          </p>
          <h1 className="text-xl sm:text-3xl md:text-[34px] font-bold text-white mt-1.5 leading-tight truncate">
            {title} Day
          </h1>

          <div className="mt-2.5 sm:mt-3">
            {allDone ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-lg">
                <CheckCircle2 size={13} /> Workout Complete
              </span>
            ) : inProgress ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-secondary bg-secondary/10 border border-secondary/30 px-2.5 py-1 rounded-lg">
                In Progress &middot; {completedCategories}/{total} Done
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white/55 bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-lg">
                Not Started
              </span>
            )}
          </div>

          <div className="flex items-center gap-3.5 sm:gap-5 mt-4 sm:mt-5 text-white/60 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 truncate">
              <Dumbbell size={14} className="shrink-0" /> {totalExercises} Exercises
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Clock size={14} className="shrink-0" /> ~{totalDuration} min
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <div className="sm:hidden">
            <ProgressRing
              progress={progress}
              size={72}
              strokeWidth={7}
              color={primaryColor}
              label={`${progress}%`}
              sublabel={`${completedCategories}/${total}`}
            />
          </div>
          <div className="hidden sm:block">
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
      </div>
    </GlassCard>
  );
}
