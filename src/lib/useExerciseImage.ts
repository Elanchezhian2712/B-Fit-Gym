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
  const [src, setSrc] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let resolved = false;
    let remaining = EXTENSIONS.length;
    setSrc(null);
    setChecked(false);

    const candidates = EXTENSIONS.map((ext) => `/images/${category}/${id}.${ext}`);

    candidates.forEach((candidate) => {
      const img = new window.Image();
      img.onload = () => {
        if (cancelled || resolved) return;
        resolved = true;
        setSrc(candidate);
        setChecked(true);
      };
      img.onerror = () => {
        remaining -= 1;
        if (!cancelled && !resolved && remaining === 0) setChecked(true);
      };
      img.src = candidate;
    });

    return () => {
      cancelled = true;
    };
  }, [category, id]);

  return { src, checked };
}
