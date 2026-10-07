"use client";

import { useEffect, useState } from "react";

const EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

/**
 * Looks for a user-provided image at /public/images/{category}/{id}.{ext}.
 * Resolves to the first extension that actually loads, or null if none exist —
 * lets exercise visuals fall back to the generated illustration with no code changes
 * required when someone drops a licensed image into the folder.
 */
export function useExerciseImage(category: string, id: string) {
  const [hasError, setHasError] = useState(false);
  const src = hasError ? null : `/images/${category}/${id}.png`;

  return {
    src,
    checked: true,
    onError: () => setHasError(true),
  };
}

