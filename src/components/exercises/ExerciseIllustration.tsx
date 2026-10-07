import { Dumbbell } from "lucide-react";
import { CategorySlug } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

interface ExerciseIllustrationProps {
  category: CategorySlug;
  className?: string;
  iconSize?: number;
}

export function ExerciseIllustration({ category, className, iconSize = 40 }: ExerciseIllustrationProps) {
  const cat = getCategory(category);
  return (
    <div
      className={cn("relative overflow-hidden flex items-center justify-center group", className)}
      style={{
        background: `linear-gradient(135deg, ${cat.color}33 0%, #101010 70%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${cat.color}55, transparent 60%)`,
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden="true">
        <defs>
          <pattern id={`grid-${category}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
      </svg>
      <div
        className="relative z-10 rounded-full p-4 border transition-transform duration-300 group-hover:scale-110"
        style={{ borderColor: `${cat.color}55`, background: `${cat.color}22` }}
      >
        <Dumbbell size={iconSize} color={cat.color} strokeWidth={1.75} />
      </div>
    </div>
  );
}
