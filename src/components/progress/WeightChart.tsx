"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFitnessStore } from "@/lib/store";

export function WeightChart() {
  const weightEntries = useFitnessStore((s) => s.weightEntries);
  const goalWeight = useFitnessStore((s) => s.goalWeight);

  const data = weightEntries.map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: e.weight,
  }));

  return (
    <GlassCard className="p-5 animate-fadeIn">
      <h3 className="text-sm font-bold text-white mb-4">Weight Trend</h3>
      <div className="h-[220px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: "#151515",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "white" }}
            />
            <ReferenceLine y={goalWeight} stroke="#C6F135" strokeDasharray="4 4" label={{ value: "Goal", fill: "#C6F135", fontSize: 11, position: "insideTopLeft" }} />
            <Line
              type="monotone"
              dataKey="weight"
              name="Weight (kg)"
              stroke="#4D7CFE"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#4D7CFE" }}
              activeDot={{ r: 6 }}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
