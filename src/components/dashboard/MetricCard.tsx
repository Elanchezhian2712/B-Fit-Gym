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
    <GlassCard hover className="p-3.5 sm:p-5 animate-fadeIn flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-1.5 mb-2 sm:mb-3">
          <p className="text-[11px] sm:text-xs font-semibold text-white/45 uppercase tracking-wide truncate">{label}</p>
          <div
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}1a` }}
          >
            <Icon size={15} className="sm:w-[17px] sm:h-[17px]" style={{ color: accent }} />
          </div>
        </div>
        <p className="text-xl sm:text-2xl md:text-[28px] font-bold text-white leading-tight break-words">{value}</p>
      </div>
      {sub && <p className="text-[11px] sm:text-xs text-white/40 mt-1.5 sm:mt-2 truncate" title={sub}>{sub}</p>}
    </GlassCard>
  );
}
