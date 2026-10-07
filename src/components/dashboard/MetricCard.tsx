import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: string;
}

export function MetricCard({ label, value, sub, icon: Icon, accent = "#C6F135" }: MetricCardProps) {
  return (
    <GlassCard hover className="p-5 animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-white/45 uppercase tracking-wide">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}1a` }}
        >
          <Icon size={17} style={{ color: accent }} />
        </div>
      </div>
      <p className={cn("text-2xl md:text-[28px] font-bold text-white leading-none")}>{value}</p>
      {sub && <p className="text-xs text-white/40 mt-2">{sub}</p>}
    </GlassCard>
  );
}
