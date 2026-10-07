"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Flame } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useFitnessStore } from "@/lib/store";
import { formatDate, todayISO } from "@/lib/utils";
import { navItems } from "./nav-items";

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const streak = useFitnessStore((s) => s.getStreak());
  const tracker = useFitnessStore((s) => s.getTracker(todayISO()));

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 flex items-center justify-between px-3.5 sm:px-6 md:px-8 border-b border-white/[0.06] bg-base-800/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 -ml-2 rounded-lg text-white/70 hover:bg-white/5"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <p className="text-xs text-white/40 font-medium">{formatDate()}</p>
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            {mounted && tracker.gymCompleted ? (
              <span className="text-primary">Workout Complete</span>
            ) : (
              <span>Workout Pending</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muscle-legs/10 border border-muscle-legs/25">
          <Flame size={15} className="text-muscle-legs" />
          <span className="text-xs font-bold text-muscle-legs">{mounted ? streak : 0} Day Streak</span>
        </div>
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-base-900 font-bold text-sm"
        >
          FJ
        </Link>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 h-screen w-72 bg-base-800 border-r border-white/10 z-50 md:hidden p-5"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <Flame size={18} className="text-base-900" />
                  </div>
                  <p className="font-bold text-white">My Fitness</p>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg text-white/60 hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium ${
                        active ? "bg-primary/10 text-primary" : "text-white/60 hover:bg-white/5"
                      }`}
                    >
                      <Icon size={19} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
