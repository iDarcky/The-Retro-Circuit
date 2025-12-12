import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | undefined;

export function createClient() {
  if (clientInstance) return clientInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Fallback for build time or misconfiguration
    // We created a dummy client that will fail gracefully or log errors
    // rather than crashing or sending malformed requests that confuse the server
    console.warn('[Supabase] Missing environment variables. Using placeholder client.');
    clientInstance = createBrowserClient(
        'https://placeholder.supabase.co',
        'placeholder-key'
    );
    return clientInstance;
  }

  clientInstance = createBrowserClient(url, key);
  return clientInstance;
}
