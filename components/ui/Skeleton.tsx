import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-skeletonPulse rounded bg-ink-100",
        className
      )}
    />
  );
}

export function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-ink-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton
            className={cn(
              "h-3.5",
              i === 0 ? "w-32" : i === columns - 1 ? "ml-auto w-16" : "w-24"
            )}
          />
        </td>
      ))}
    </tr>
  );
}
