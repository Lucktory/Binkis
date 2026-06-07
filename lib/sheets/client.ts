import { google, type sheets_v4 } from "googleapis";
import { getServerEnv } from "@/lib/env";

let cachedClient: sheets_v4.Sheets | null = null;

export function getSheetsClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const env = getServerEnv();
  const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

export function getSheetConfig() {
  const env = getServerEnv();
  return {
    spreadsheetId: env.GOOGLE_SHEETS_ID,
    tab: env.GOOGLE_SHEETS_TAB,
  };
}
