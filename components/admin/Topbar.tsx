import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TopbarProps {
  title: string;
  description?: string;
  action?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function Topbar({ title, description, action, meta, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-14 z-10 flex shrink-0 flex-col gap-3 border-b border-ink-200 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6 md:top-0 md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0 lg:px-8",
        className
      )}
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
        <div className="flex flex-col">
          <h1 className="text-base font-semibold leading-none text-ink-900 md:text-lg">{title}</h1>
          {description ? (
            <p className="mt-1 text-xs text-ink-500">{description}</p>
          ) : null}
        </div>
        {meta ? <div className="hidden lg:flex">{meta}</div> : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
    </header>
  );
}
