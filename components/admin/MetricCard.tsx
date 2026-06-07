import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({ label, value, hint, icon, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-ink-200 bg-white p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
          {label}
        </p>
        {icon ? <span className="text-ink-400">{icon}</span> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}
