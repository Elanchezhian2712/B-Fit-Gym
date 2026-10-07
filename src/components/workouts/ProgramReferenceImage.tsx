"use client";

import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { CategorySlug } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";

export function ProgramReferenceImage({ category }: { category: CategorySlug }) {
  const [hasError, setHasError] = useState(false);
  const [usePngFallback, setUsePngFallback] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasRef = category === "abs-cardio" || category === "shoulders";

  if (!hasRef || hasError) return null;

  const src = usePngFallback
    ? `/images/${category}/_program-reference.png`
    : `/images/${category}/_program-reference.webp`;

  return (
    <>
      <GlassCard
        hover
        className="overflow-hidden cursor-zoom-in"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-white/50 flex items-center gap-2">
            <ImageIcon size={13} /> Full Program Reference
          </p>
          <span className="text-[11px] text-white/35">Tap to expand</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Full workout program reference"
          className="w-full h-auto mt-3"
          onError={() => {
            if (!usePngFallback) {
              setUsePngFallback(true);
            } else {
              setHasError(true);
            }
          }}
        />
      </GlassCard>


      {expanded && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Full workout program reference" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </>
  );
}
