import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ className, hover = false, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-base-700/60 backdrop-blur-xl shadow-card",
        hover &&
          "transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5 hover:shadow-glow cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
