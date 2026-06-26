import { createClient } from '../supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side admin guard for mutation server actions (defense-in-depth on top of RLS).
 *
 * Verifies the caller is authenticated AND has the 'admin' role before any write.
 * Returns the cookie-aware Supabase client so callers can reuse it for the mutation.
 * Throws if the user is missing or not an admin.
 *
 * Mirrors the check already used in `app/actions/revalidate.ts` (purgeCache).
 */
export async function requireAdmin(): Promise<SupabaseClient> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized: user not signed in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    throw new Error('Forbidden: admin role required');
  }

  return supabase;
}
