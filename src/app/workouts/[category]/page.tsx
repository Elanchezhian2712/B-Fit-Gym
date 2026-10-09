import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Dumbbell } from "lucide-react";
import { categories, getCategory } from "@/lib/data/categories";
import { getExercisesByCategory } from "@/lib/data/exercises";
import { getTodaySchedule, isFullAbsDay, isDedicatedLegDay } from "@/lib/data/schedule";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { ProgramReferenceImage } from "@/components/workouts/ProgramReferenceImage";
import { Button } from "@/components/ui/Button";
import { CategorySlug } from "@/lib/types";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default function WorkoutCategoryPage({ params }: { params: { category: string } }) {
  const slug = params.category as CategorySlug;
  if (!categories.some((c) => c.slug === slug)) notFound();

  const cat = getCategory(slug);
  const todayCategories = getTodaySchedule().categories;
  const light =
    slug === "abs-cardio"
      ? !isFullAbsDay(todayCategories)
      : slug === "legs"
      ? !isDedicatedLegDay(todayCategories)
      : undefined;
  const exs = getExercisesByCategory(slug, light);

  return (
    <div className="space-y-6">
      <Link href="/workouts" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ChevronLeft size={16} /> Back to Workouts
      </Link>

      <div
        className="rounded-2xl p-4 sm:p-6 md:p-8 border border-white/[0.06]"
        style={{ backgroundImage: `linear-gradient(135deg, ${cat.color}22 0%, #101010 70%)` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2.5 flex-wrap">
              {cat.name} Workout
              {cat.level && (
                <span
                  className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                >
                  {cat.level}
                </span>
              )}
            </h1>
            <p className="text-white/50 text-xs sm:text-sm max-w-md">{cat.description}</p>
            <div className="flex items-center gap-4 sm:gap-5 mt-3 sm:mt-4 text-white/60 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Dumbbell size={14} /> {exs.length} Exercises
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> ~{cat.estimatedDuration} min
              </span>
            </div>
          </div>
          <Link href={`/session/${cat.slug}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">Start Workout</Button>
          </Link>
        </div>
      </div>

      <ProgramReferenceImage category={slug} />

      <div className="grid grid-cols-1 min-[440px]:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {exs.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
