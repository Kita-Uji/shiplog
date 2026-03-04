import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _browser: SupabaseClient | null = null;

// Browser client (uses anon key) — lazy singleton
export function getSupabase() {
  if (!_browser) {
    _browser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _browser;
}

// Convenience default export (browser client)
export const supabase = {
  get client() {
    return getSupabase();
  },
};

// Server client (uses service role key — only call from API routes)
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase env vars not set");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
