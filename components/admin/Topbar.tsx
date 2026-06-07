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
        "sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-ink-200 bg-white/95 px-8 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-baseline gap-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold leading-none text-ink-900">{title}</h1>
          {description ? (
            <p className="mt-1 text-xs text-ink-500">{description}</p>
          ) : null}
        </div>
        {meta ? <div className="hidden lg:flex">{meta}</div> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </header>
  );
}
