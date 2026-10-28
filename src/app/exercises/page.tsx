"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShieldAlert } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { exercises } from "@/lib/data/exercises";
import { regionFilters } from "@/lib/data/muscleRegions";
import { needsReview } from "@/lib/data/exerciseReview";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { cn } from "@/lib/utils";
import { CategorySlug, MuscleRegion } from "@/lib/types";

const chipClass =
  "shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors cursor-pointer";

export default function ExerciseLibraryPage() {
  return (
    <Suspense>
      <ExerciseLibrary />
    </Suspense>
  );
}

function ExerciseLibrary() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [filter, setFilter] = useState<CategorySlug | "all">(
    categories.some((c) => c.slug === initialCategory) ? (initialCategory as CategorySlug) : "all"
  );
  const [region, setRegion] = useState<MuscleRegion | null>(null);
  const [query, setQuery] = useState("");
  const [reviewOnly, setReviewOnly] = useState(false);

  const regions = filter === "all" ? undefined : regionFilters[filter];
  const activeCategory = categories.find((c) => c.slug === filter);

  // Library order is always the catalogue order; filters only narrow it.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((e) => {
      if (filter !== "all" && e.category !== filter) return false;
      if (region && !e.emphasis?.includes(region)) return false;
      if (reviewOnly && !needsReview(e)) return false;
      if (!q) return true;
      return [e.name, e.equipment, ...e.primaryMuscles, ...e.secondaryMuscles].some((t) =>
        t.toLowerCase().includes(q)
      );
    });
  }, [filter, region, query, reviewOnly]);

  function selectCategory(slug: CategorySlug | "all") {
    setFilter(slug);
    setRegion(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Exercise Library</h1>
        <p className="text-white/45 text-sm mt-1">{exercises.length} exercises across 7 muscle groups.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, muscle or equipment"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-primary/60"
          />
        </label>
        <button
          onClick={() => setReviewOnly((v) => !v)}
          aria-pressed={reviewOnly}
          className={cn(
            chipClass,
            "inline-flex items-center justify-center gap-1.5",
            reviewOnly
              ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
              : "border-white/10 text-white/60 hover:text-white"
          )}
        >
          <ShieldAlert size={14} /> Needs review
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <button
            onClick={() => selectCategory("all")}
            className={cn(
              chipClass,
              filter === "all"
                ? "bg-primary text-base-900 border-primary"
                : "border-white/10 text-white/60 hover:text-white"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => selectCategory(cat.slug)}
              className={cn(
                chipClass,
                filter === cat.slug ? "text-base-900 border-transparent" : "border-white/10 text-white/60 hover:text-white"
              )}
              style={filter === cat.slug ? { backgroundColor: cat.color } : undefined}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {regions && activeCategory && (
          <div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
              <button
                onClick={() => setRegion(null)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer",
                  region === null ? "text-white border-white/40 bg-white/10" : "border-white/10 text-white/50 hover:text-white"
                )}
              >
                All {activeCategory.name.toLowerCase()}
              </button>
              {regions.map((r) => (
                <button
                  key={r.region}
                  onClick={() => setRegion(r.region)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer",
                    region === r.region ? "border-transparent" : "border-white/10 text-white/50 hover:text-white"
                  )}
                  style={
                    region === r.region
                      ? { color: activeCategory.color, backgroundColor: `${activeCategory.color}22`, borderColor: `${activeCategory.color}66` }
                      : undefined
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-white/35 mt-1.5">
              Emphasis filters: each exercise biases a region but still works the rest of the muscle.
            </p>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-white/40 py-10 text-center">No exercises match these filters.</p>
      ) : (
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
