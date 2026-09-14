import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase administrative client.
 *
 * Exclusively for server runtime (Server Components, Route Handlers, Cron jobs).
 * Never bundle or expose this to the browser: uses the high-privilege service-role key.
 */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xgubsmboqkfcjcrytucv.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let serverAdminClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured in server environment."
    );
  }

  if (!serverAdminClient) {
    serverAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverAdminClient;
}
