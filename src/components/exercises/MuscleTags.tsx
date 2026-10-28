import { Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MuscleTagsProps {
  exercise: Exercise;
  accent: string;
  // "inline" fits cards and headers; "chips" lists every muscle as a labelled tag.
  variant?: "inline" | "chips";
  className?: string;
}

export function MuscleTags({ exercise, accent, variant = "inline", className }: MuscleTagsProps) {
  const { primaryMuscles, secondaryMuscles } = exercise;

  if (variant === "inline") {
    return (
      <p className={cn("text-xs font-medium leading-snug", className)}>
        <span style={{ color: accent }}>{primaryMuscles.join(", ")}</span>
        {secondaryMuscles.length > 0 && (
          <span className="text-white/40"> + {secondaryMuscles.join(", ")}</span>
        )}
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 w-[68px] shrink-0">Primary</span>
        {primaryMuscles.map((m) => (
          <span
            key={m}
            className="px-2.5 py-1 rounded-md text-xs font-bold border"
            style={{ color: accent, borderColor: `${accent}60`, backgroundColor: `${accent}15` }}
          >
            {m}
          </span>
        ))}
      </div>
      {secondaryMuscles.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 w-[68px] shrink-0">Secondary</span>
          {secondaryMuscles.map((m) => (
            <span
              key={m}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-white/10 bg-white/[0.04] text-white/60"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
