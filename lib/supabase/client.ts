import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

/**
 * Browser client, for client components that need the signed-in user's session.
 *
 * Server components must not use this — they want `anon.ts` (SSG-safe) or
 * `server.ts` (cookie-aware, forces the route dynamic). Which client a page
 * imports is what decides its cacheability.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

/**
 * The shared browser instance. Prefer this over calling `createClient()` per
 * component so auth state is not split across several clients.
 *
 * This used to live in a separate `singleton.ts` that wrapped this module and
 * re-implemented the same placeholder fallback, so there were two modules
 * describing one client. Missing env vars already fall back to the placeholder
 * host above, which fails loudly at request time rather than at import time.
 */
export const supabase = createClient();
