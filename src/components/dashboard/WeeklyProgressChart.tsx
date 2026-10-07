"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFitnessStore } from "@/lib/store";

function last7Days() {
  const days: { iso: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString("en-US", { weekday: "short" }) });
  }
  return days;
}

export function WeeklyProgressChart() {
  const sessions = useFitnessStore((s) => s.workoutSessions);

  const data = useMemo(() => {
    const days = last7Days();
    return days.map((d) => {
      const dayStat = sessions.filter((s) => s.date === d.iso);
      const sets = dayStat.reduce(
        (sum, s) => sum + s.exerciseLogs.reduce((a, e) => a + e.sets.filter((x) => x.completed).length, 0),
        0
      );
      return { name: d.label, sets };
    });
  }, [sessions]);

  const completedDays = data.filter((d) => d.sets > 0).length;

  return (
    <GlassCard className="p-5 animate-fadeIn">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-white">Weekly Progress</h3>
        <span className="text-xs text-white/40">{completedDays}/7 days active</span>
      </div>
      <div className="h-[180px] -ml-4 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="setsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6F135" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#C6F135" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "#151515",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "white" }}
              itemStyle={{ color: "#C6F135" }}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="sets"
              name="Sets Completed"
              stroke="#C6F135"
              strokeWidth={2.5}
              fill="url(#setsGradient)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
