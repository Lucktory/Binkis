import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TopbarProps {
  title: string;
  description?: string;
  action?: ReactNode;
  meta?: ReactNode;
  className?: string;
  breadcrumb?: string;
}

export function Topbar({ title, description, action, meta, className, breadcrumb }: TopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-14 z-10 flex shrink-0 flex-col gap-4 border-b border-ink-200 bg-white/95 px-4 py-5 backdrop-blur-sm sm:px-6 md:top-0 md:flex-row md:items-end md:justify-between md:py-5 lg:px-8",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {breadcrumb ? (
          <p className="text-[11px] font-medium uppercase tracking-widest text-ink-400">
            {breadcrumb}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink-900 md:text-display">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-sm leading-relaxed text-ink-500">{description}</p>
        ) : null}
        {meta ? <div className="mt-1 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
    </header>
  );
}
