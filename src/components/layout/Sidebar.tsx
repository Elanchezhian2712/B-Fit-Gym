"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-64 border-r border-white/[0.06] bg-base-800/80 backdrop-blur-xl z-40">
      <div className="flex items-center gap-2.5 px-6 h-20 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow">
          <Flame size={20} className="text-base-900" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-bold text-white leading-none text-[15px]">My Fitness</p>
          <p className="text-[11px] text-white/40 leading-none mt-1">Journey</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-white/55 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary" />
              )}
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-primary/15 to-transparent border border-primary/20">
        <p className="text-xs text-white/60 leading-relaxed">
          Consistency beats intensity. Show up today.
        </p>
      </div>
    </aside>
  );
}
