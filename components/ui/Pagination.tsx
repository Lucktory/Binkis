"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizes?: number[];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50, 100],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-white px-4 py-3 text-xs text-ink-500">
      <div className="flex items-center gap-2">
        <span className="tabular-nums">
          {formatNumber(start)}-{formatNumber(end)} de {formatNumber(total)}
        </span>
        {onPageSizeChange ? (
          <div className="ml-2 flex items-center gap-1.5">
            <label htmlFor="pagination-size" className="text-ink-400">
              Filas
            </label>
            <select
              id="pagination-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded border border-ink-200 bg-white px-2 py-1 text-xs text-ink-700 hover:border-ink-300 focus:border-accent focus:outline-none"
            >
              {pageSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded border border-ink-200 bg-white text-ink-500 transition-colors",
            canPrev ? "hover:border-ink-300 hover:text-ink-900" : "opacity-40 cursor-not-allowed"
          )}
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>
        <span className="px-2 tabular-nums text-ink-700">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded border border-ink-200 bg-white text-ink-500 transition-colors",
            canNext ? "hover:border-ink-300 hover:text-ink-900" : "opacity-40 cursor-not-allowed"
          )}
          aria-label="Pagina siguiente"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
