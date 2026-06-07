import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  trend?: ReactNode;
  className?: string;
}

export function MetricCard({ label, value, hint, icon, trend, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border border-ink-200 bg-white p-5 shadow-card transition-colors hover:border-ink-300",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          {label}
        </p>
        {icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-500">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="text-3xl font-semibold leading-none tabular-nums text-ink-900">{value}</p>
        {trend ? <div className="text-xs text-ink-500">{trend}</div> : null}
      </div>
      {hint ? <p className="mt-2 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}
