import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "warning" | "success" | "danger";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide",
        variant === "default" && "bg-white/[0.06] text-white/70 border border-white/10",
        variant === "warning" && "bg-muscle-legs/10 text-muscle-legs border border-muscle-legs/30",
        variant === "success" && "bg-primary/10 text-primary border border-primary/30",
        variant === "danger" && "bg-muscle-chest/10 text-muscle-chestSoft border border-muscle-chest/30",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
