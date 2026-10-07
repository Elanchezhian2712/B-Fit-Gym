import { categories } from "@/lib/data/categories";
import { WorkoutCard } from "@/components/workouts/WorkoutCard";

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Workouts</h1>
        <p className="text-white/45 text-sm mt-1">Choose a muscle group to begin training.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <WorkoutCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
}
