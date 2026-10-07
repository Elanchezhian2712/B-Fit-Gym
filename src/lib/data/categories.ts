import { Category, CategorySlug } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "chest",
    name: "Chest",
    color: "#FF5C5C",
    colorSoft: "rgba(255,92,92,0.15)",
    description: "Build pressing power and chest definition.",
    estimatedDuration: 50,
  },
  {
    slug: "back",
    name: "Back",
    color: "#4D7CFE",
    colorSoft: "rgba(77,124,254,0.15)",
    description: "Strengthen your lats and improve posture.",
    estimatedDuration: 45,
  },
  {
    slug: "shoulders",
    name: "Shoulders",
    level: "Intermediate",
    color: "#A855F7",
    colorSoft: "rgba(168,85,247,0.15)",
    description: "Build rounded, stable shoulders.",
    estimatedDuration: 40,
  },
  {
    slug: "biceps",
    name: "Biceps",
    color: "#38BDF8",
    colorSoft: "rgba(56,189,248,0.15)",
    description: "Isolate and grow your biceps.",
    estimatedDuration: 30,
  },
  {
    slug: "triceps",
    name: "Triceps",
    color: "#FB7185",
    colorSoft: "rgba(251,113,133,0.15)",
    description: "Sculpt and strengthen your triceps.",
    estimatedDuration: 30,
  },
  {
    slug: "legs",
    name: "Legs",
    color: "#FBBF24",
    colorSoft: "rgba(251,191,36,0.15)",
    description: "Full lower-body strength and mobility.",
    estimatedDuration: 55,
  },
  {
    slug: "abs-cardio",
    name: "Abs + Cardio",
    level: "Intermediate",
    color: "#34D399",
    colorSoft: "rgba(52,211,153,0.15)",
    description: "Core strength and conditioning finisher.",
    estimatedDuration: 30,
  },
];

export function getCategory(slug: CategorySlug): Category {
  const c = categories.find((cat) => cat.slug === slug);
  if (!c) throw new Error(`Unknown category: ${slug}`);
  return c;
}
