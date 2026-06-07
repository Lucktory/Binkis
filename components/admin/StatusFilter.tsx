"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

type Status = "all" | "winners" | "available";

interface StatusFilterProps {
  counts: Record<Status, number>;
}

const OPTIONS: { value: Status; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "winners", label: "Ganadores" },
  { value: "available", label: "Disponibles" },
];

export function StatusFilter({ counts }: StatusFilterProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const current = (params.get("status") ?? "all") as Status;

  function hrefFor(status: Status) {
    const next = new URLSearchParams(params.toString());
    if (status === "all") {
      next.delete("status");
    } else {
      next.set("status", status);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-ink-200 bg-white p-0.5 shadow-card">
      {OPTIONS.map((opt) => {
        const active = current === opt.value;
        return (
          <Link
            key={opt.value}
            href={hrefFor(opt.value)}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-surface-muted text-ink-900"
                : "text-ink-500 hover:bg-surface-muted hover:text-ink-900"
            )}
            scroll={false}
          >
            <span>{opt.label}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                active ? "bg-white text-ink-700" : "bg-surface-muted text-ink-400"
              )}
            >
              {formatNumber(counts[opt.value])}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
