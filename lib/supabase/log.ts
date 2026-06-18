import { getAdminClient } from "./client";

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
  const supabase = getAdminClient();
  const { error } = await supabase.from("visit_logs").insert({
    email: entry.email || null,
    name: entry.name || null,
    auth_method: entry.authMethod,
    ip: entry.ip || null,
    country: entry.country || null,
    region: entry.region || null,
    city: entry.city || null,
    user_agent: entry.userAgent || null,
    referrer: entry.referrer || null,
    path: entry.path || null,
  });
  if (error) {
    throw new Error(`Supabase appendLogEntry failed: ${error.message}`);
  }
}
