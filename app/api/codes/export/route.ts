import { getAllCodes } from "@/lib/sheets/codes";
import { SHEET_HEADERS, recordToRow } from "@/lib/sheets/schema";

export const dynamic = "force-dynamic";

type Scope = "all" | "winners" | "available";

function escapeCsv(value: string): string {
  if (value === "") return "";
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseColumns(raw: string | null): readonly string[] {
  if (!raw) return SHEET_HEADERS;
  const requested = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (requested.length === 0) return SHEET_HEADERS;
  return requested.filter((c) => (SHEET_HEADERS as readonly string[]).includes(c));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = (url.searchParams.get("scope") ?? "all") as Scope;
  const columns = parseColumns(url.searchParams.get("columns"));

  try {
    const all = await getAllCodes();
    const filtered = all.filter((r) => {
      if (scope === "winners") return r.claimed;
      if (scope === "available") return !r.claimed;
      return true;
    });

    const allHeaders = SHEET_HEADERS as readonly string[];
    const columnIndexes = columns
      .map((c) => allHeaders.indexOf(c))
      .filter((i) => i >= 0);
    const selectedHeaders = columnIndexes.map((i) => allHeaders[i]);

    const rows = filtered.map((r) =>
      columnIndexes.map((i) => recordToRow(r)[i] ?? "")
    );

    const lines: string[] = [];
    lines.push(selectedHeaders.join(","));
    for (const row of rows) {
      lines.push(row.map(escapeCsv).join(","));
    }
    const csv = lines.join("\r\n");

    const today = new Date().toISOString().slice(0, 10);
    const scopePart = scope === "winners" ? "ganadores" : scope === "available" ? "disponibles" : "todos";
    const filename = `binkis-${scopePart}-${today}.csv`;

    return new Response("﻿" + csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
