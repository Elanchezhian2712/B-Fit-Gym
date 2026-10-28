import { CategorySlug, MuscleRegion } from "@/lib/types";

export interface RegionFilter {
  region: MuscleRegion;
  label: string;
}

// Emphasis filters shown in the library for groups where region bias matters.
export const regionFilters: Partial<Record<CategorySlug, RegionFilter[]>> = {
  shoulders: [
    { region: "front-delts", label: "Front delts" },
    { region: "side-delts", label: "Side delts" },
    { region: "rear-delts", label: "Rear delts" },
    { region: "traps", label: "Traps" },
  ],
  chest: [
    { region: "upper-chest", label: "Upper chest" },
    { region: "middle-chest", label: "Middle chest" },
    { region: "lower-chest", label: "Lower chest" },
  ],
};
