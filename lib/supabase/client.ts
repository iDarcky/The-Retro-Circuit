import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a dummy client or throw a more handled error?
    // createBrowserClient throws if args are missing.
    // We'll throw but maybe the caller can handle it?
    // Or we can return a mock if possible.
    // For now, let's just log and try to proceed with dummy values to prevent immediate crash during import/init,
    // but calls will fail.
    console.warn("Supabase env vars missing in client!");
    return createBrowserClient('https://example.com', 'dummy');
  }

  return createBrowserClient(url, key);
}
