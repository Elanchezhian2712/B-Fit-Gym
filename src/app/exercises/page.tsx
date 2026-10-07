"use client";

import { useMemo, useState } from "react";
import { categories } from "@/lib/data/categories";
import { exercises } from "@/lib/data/exercises";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { cn } from "@/lib/utils";
import { CategorySlug } from "@/lib/types";

export default function ExerciseLibraryPage() {
  const [filter, setFilter] = useState<CategorySlug | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? exercises : exercises.filter((e) => e.category === filter)),
    [filter]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Exercise Library</h1>
        <p className="text-white/45 text-sm mt-1">{exercises.length} exercises across 7 muscle groups.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer",
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
            onClick={() => setFilter(cat.slug)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer",
              filter === cat.slug ? "text-base-900 border-transparent" : "border-white/10 text-white/60 hover:text-white"
            )}
            style={filter === cat.slug ? { backgroundColor: cat.color } : undefined}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
