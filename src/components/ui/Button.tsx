import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
          variant === "primary" &&
            "bg-primary text-base-900 hover:bg-primary-light shadow-[0_8px_24px_-6px_rgba(198,241,53,0.5)]",
          variant === "secondary" && "bg-secondary text-white hover:bg-secondary-dark",
          variant === "outline" && "border border-white/15 text-white hover:bg-white/5",
          variant === "ghost" && "text-white/70 hover:text-white hover:bg-white/5",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-6 py-3.5 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
