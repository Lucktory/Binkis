import type { ReactNode } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Sparkline } from "@/components/ui/Sparkline";
import { Donut } from "@/components/ui/Donut";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  sparkline?: number[];
  progress?: number;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  donut?: number;
  className?: string;
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  sparkline,
  progress,
  delta,
  donut,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-ink-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-px hover:border-ink-300 hover:shadow-soft",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          {label}
        </p>
        {icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-100 bg-surface-muted text-ink-500">
            {icon}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-3xl font-semibold leading-none tabular-nums text-ink-900">{value}</p>
          {delta ? (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-medium tabular-nums",
                delta.direction === "up"
                  ? "text-amber"
                  : delta.direction === "down"
                  ? "text-status-invalid"
                  : "text-ink-400"
              )}
            >
              {delta.direction === "up" ? (
                <ArrowUp size={12} strokeWidth={2.5} />
              ) : delta.direction === "down" ? (
                <ArrowDown size={12} strokeWidth={2.5} />
              ) : (
                <Minus size={12} strokeWidth={2.5} />
              )}
              {delta.value}
            </div>
          ) : null}
        </div>
        {donut !== undefined ? (
          <Donut value={donut} size={48} thickness={5} color="#B45309" />
        ) : null}
      </div>

      {sparkline && sparkline.length > 0 ? (
        <div className="mt-4 -mx-1">
          <Sparkline values={sparkline} width={220} height={36} stroke="#0B1220" fill="rgba(11, 18, 32, 0.05)" />
        </div>
      ) : null}

      {progress !== undefined ? (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-amber transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      ) : null}

      {hint ? <p className="mt-3 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}
