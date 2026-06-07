import type { CodeRecord } from "@/types";

export const SHEET_HEADERS = [
  "code",
  "generated_at",
  "claimed",
  "claimed_at",
  "winner_name",
  "winner_email",
  "winner_phone",
  "winner_address",
] as const;

export type SheetHeader = (typeof SHEET_HEADERS)[number];

export const HEADER_RANGE = `A1:${columnLetter(SHEET_HEADERS.length)}1`;
export const DATA_RANGE = `A2:${columnLetter(SHEET_HEADERS.length)}`;

export function columnLetter(index: number): string {
  let letters = "";
  let i = index;
  while (i > 0) {
    const mod = (i - 1) % 26;
    letters = String.fromCharCode(65 + mod) + letters;
    i = Math.floor((i - 1) / 26);
  }
  return letters;
}

export function rowToRecord(row: string[]): CodeRecord | null {
  if (!row || row.length === 0 || !row[0]) return null;
  return {
    code: row[0] ?? "",
    generatedAt: row[1] ?? "",
    claimed: (row[2] ?? "").toString().toUpperCase() === "TRUE",
    claimedAt: row[3] ? row[3] : null,
    winnerName: row[4] ? row[4] : null,
    winnerEmail: row[5] ? row[5] : null,
    winnerPhone: row[6] ? row[6] : null,
    winnerAddress: row[7] ? row[7] : null,
  };
}

export function recordToRow(record: CodeRecord): string[] {
  return [
    record.code,
    record.generatedAt,
    record.claimed ? "TRUE" : "FALSE",
    record.claimedAt ?? "",
    record.winnerName ?? "",
    record.winnerEmail ?? "",
    record.winnerPhone ?? "",
    record.winnerAddress ?? "",
  ];
}

export function newCodeRow(code: string, generatedAt: string): string[] {
  return [code, generatedAt, "FALSE", "", "", "", "", ""];
}
