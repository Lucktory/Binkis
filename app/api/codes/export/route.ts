import { getAllCodes } from "@/lib/sheets/codes";
import { SHEET_HEADERS, recordToRow } from "@/lib/sheets/schema";

export const dynamic = "force-dynamic";

function escapeCsv(value: string): string {
  if (value === "") return "";
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function recordsToCsv(rows: string[][]): string {
  const lines: string[] = [];
  lines.push(SHEET_HEADERS.join(","));
  for (const row of rows) {
    lines.push(row.map(escapeCsv).join(","));
  }
  return lines.join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") ?? "all";

  try {
    const all = await getAllCodes();
    const filtered = scope === "winners" ? all.filter((r) => r.claimed) : all;
    const rows = filtered.map((r) => recordToRow(r));
    const csv = recordsToCsv(rows);

    const today = new Date().toISOString().slice(0, 10);
    const filename = scope === "winners"
      ? `binkis-ganadores-${today}.csv`
      : `binkis-codigos-${today}.csv`;

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
