import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv, publicEnv } from "@/lib/env";

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Server-side admin client. Uses service_role key, bypasses RLS.
 * Only call from API routes / server components. NEVER expose to the browser.
 */
export function getAdminClient(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;
  const env = getServerEnv();
  cachedAdminClient = createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
  return cachedAdminClient;
}

/**
 * Public (browser-safe) client. Uses anon key. RLS applies.
 * For the BinKis schema, RLS denies everything to anon, so this client
 * cannot read or write codes / logs. Kept around for future auth flows.
 */
export function getPublicClient(): SupabaseClient {
  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
