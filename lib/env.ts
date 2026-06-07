import { z } from "zod";

const serverEnvSchema = z.object({
  GOOGLE_SHEETS_ID: z.string().min(1, "GOOGLE_SHEETS_ID is required"),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1),
  GOOGLE_SHEETS_TAB: z.string().default("Codes"),
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_BRAND_NAME: z.string().default("BinKis"),
  NEXT_PUBLIC_COLLECTION_NUMBER: z.string().default("777"),
});

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse({
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    GOOGLE_SHEETS_TAB: process.env.GOOGLE_SHEETS_TAB,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid server environment configuration:\n${issues}`);
  }

  return parsed.data;
}

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
  NEXT_PUBLIC_COLLECTION_NUMBER: process.env.NEXT_PUBLIC_COLLECTION_NUMBER,
});
