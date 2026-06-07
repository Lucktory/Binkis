import { getSheetsClient, getSheetConfig } from "./client";

export const LOG_TAB = "LOG";
export const LOG_HEADERS = [
  "timestamp",
  "email",
  "name",
  "auth_method",
  "ip",
  "country",
  "region",
  "city",
  "user_agent",
  "referrer",
  "path",
] as const;
export type LogHeader = (typeof LOG_HEADERS)[number];

const LAST_COLUMN_LETTER = "K";

async function ensureLogHeaders(): Promise<void> {
  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  const range = `${LOG_TAB}!A1:${LAST_COLUMN_LETTER}1`;
  const current = await sheets.spreadsheets.values.get({ spreadsheetId, range });

  const headers = current.data.values?.[0] ?? [];
  const needsWrite =
    headers.length !== LOG_HEADERS.length ||
    LOG_HEADERS.some((h, i) => headers[i] !== h);

  if (needsWrite) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [Array.from(LOG_HEADERS)] },
    });
  }
}

export interface LogEntry {
  email: string;
  name: string;
  authMethod: "google" | "manual" | "visit";
  ip: string;
  country: string;
  region: string;
  city: string;
  userAgent: string;
  referrer: string;
  path: string;
}

export async function appendLogEntry(entry: LogEntry): Promise<void> {
  await ensureLogHeaders();
  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  const timestamp = new Date().toISOString();
  const row = [
    timestamp,
    entry.email,
    entry.name,
    entry.authMethod,
    entry.ip,
    entry.country,
    entry.region,
    entry.city,
    entry.userAgent,
    entry.referrer,
    entry.path,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${LOG_TAB}!A:A`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
