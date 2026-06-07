import { getSheetsClient, getSheetConfig } from "./client";
import {
  DATA_RANGE,
  HEADER_RANGE,
  SHEET_HEADERS,
  newCodeRow,
  rowToRecord,
} from "./schema";
import type { CodeMetrics, CodeRecord } from "@/types";

async function ensureHeaders(): Promise<void> {
  const sheets = getSheetsClient();
  const { spreadsheetId, tab } = getSheetConfig();

  const range = `${tab}!${HEADER_RANGE}`;
  const current = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const headers = current.data.values?.[0] ?? [];
  const needsWrite =
    headers.length !== SHEET_HEADERS.length ||
    SHEET_HEADERS.some((h, i) => headers[i] !== h);

  if (needsWrite) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [Array.from(SHEET_HEADERS)] },
    });
  }
}

export async function getAllCodes(): Promise<CodeRecord[]> {
  await ensureHeaders();
  const sheets = getSheetsClient();
  const { spreadsheetId, tab } = getSheetConfig();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!${DATA_RANGE}`,
  });

  const rows = res.data.values ?? [];
  return rows
    .map((row) => rowToRecord(row as string[]))
    .filter((r): r is CodeRecord => r !== null);
}

export async function appendCodes(codes: string[]): Promise<void> {
  await ensureHeaders();
  if (codes.length === 0) return;

  const sheets = getSheetsClient();
  const { spreadsheetId, tab } = getSheetConfig();

  const now = new Date().toISOString();
  const rows = codes.map((code) => newCodeRow(code, now));

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:A`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: rows },
  });
}

export async function findCodeRowIndex(code: string): Promise<number | null> {
  const sheets = getSheetsClient();
  const { spreadsheetId, tab } = getSheetConfig();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!A2:A`,
  });

  const rows = res.data.values ?? [];
  for (let i = 0; i < rows.length; i += 1) {
    if ((rows[i] as string[])[0] === code) {
      return i + 2;
    }
  }
  return null;
}

export async function findCode(code: string): Promise<CodeRecord | null> {
  const rowIndex = await findCodeRowIndex(code);
  if (rowIndex === null) return null;

  const sheets = getSheetsClient();
  const { spreadsheetId, tab } = getSheetConfig();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!A${rowIndex}:H${rowIndex}`,
  });

  const row = res.data.values?.[0];
  if (!row) return null;
  return rowToRecord(row as string[]);
}

export async function markCodeClaimed(
  code: string,
  winner: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }
): Promise<CodeRecord | null> {
  const sheets = getSheetsClient();
  const { spreadsheetId, tab } = getSheetConfig();

  const rowIndex = await findCodeRowIndex(code);
  if (rowIndex === null) return null;

  const existing = await findCode(code);
  if (!existing || existing.claimed) return existing;

  const now = new Date().toISOString();
  const updated: CodeRecord = {
    ...existing,
    claimed: true,
    claimedAt: now,
    winnerName: winner.name,
    winnerEmail: winner.email,
    winnerPhone: winner.phone,
    winnerAddress: winner.address,
  };

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tab}!C${rowIndex}:H${rowIndex}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          "TRUE",
          now,
          winner.name,
          winner.email,
          winner.phone,
          winner.address,
        ],
      ],
    },
  });

  return updated;
}

export function computeMetrics(records: CodeRecord[]): CodeMetrics {
  const total = records.length;
  const claimed = records.filter((r) => r.claimed).length;
  const latest = records.reduce<string | null>((acc, r) => {
    if (!acc) return r.generatedAt || null;
    return r.generatedAt > acc ? r.generatedAt : acc;
  }, null);

  return {
    totalGenerated: total,
    totalClaimed: claimed,
    totalAvailable: total - claimed,
    claimRate: total === 0 ? 0 : claimed / total,
    latestGeneratedAt: latest,
  };
}

interface DailyBuckets {
  generated: number[];
  claimed: number[];
  available: number[];
  cumulative: number[];
  dayLabels: string[];
}

export function buildDailySeries(records: CodeRecord[], days = 7): DailyBuckets {
  const now = new Date();
  const buckets: { date: Date; key: string; label: string }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.push({ date: d, key, label: key.slice(5) });
  }

  const generated = new Array(days).fill(0) as number[];
  const claimed = new Array(days).fill(0) as number[];

  for (const r of records) {
    if (r.generatedAt) {
      const k = r.generatedAt.slice(0, 10);
      const idx = buckets.findIndex((b) => b.key === k);
      if (idx >= 0) generated[idx] += 1;
    }
    if (r.claimedAt) {
      const k = r.claimedAt.slice(0, 10);
      const idx = buckets.findIndex((b) => b.key === k);
      if (idx >= 0) claimed[idx] += 1;
    }
  }

  const cumulative: number[] = [];
  let running = records.length - generated.reduce((a, b) => a + b, 0);
  for (const g of generated) {
    running += g;
    cumulative.push(running);
  }

  const available = generated.map((g, i) => Math.max(0, g - claimed[i]));

  return {
    generated,
    claimed,
    available,
    cumulative,
    dayLabels: buckets.map((b) => b.label),
  };
}
