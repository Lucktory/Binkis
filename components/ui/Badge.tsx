import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "danger" | "info" | "warning";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const tones: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-700 border-ink-200",
  success: "bg-status-claimedBg text-status-claimed border-status-claimed/20",
  danger: "bg-status-invalidBg text-status-invalid border-status-invalid/20",
  info: "bg-ink-100 text-ink-700 border-ink-200",
  warning: "bg-amber-soft text-amber border-amber-ring/30",
};

const dotColors: Record<Tone, string> = {
  neutral: "bg-ink-400",
  success: "bg-status-claimed",
  danger: "bg-status-invalid",
  info: "bg-ink-500",
  warning: "bg-amber-ring",
};

export function Badge({ tone = "neutral", children, className, dot = true }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {dot ? <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[tone])} /> : null}
      {children}
    </span>
  );
}
