'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';

export default function AuthSync() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen for auth changes (SignIn, SignOut, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      // Logic Update: Only refresh on sign out.
      // We ignore SIGNED_IN or TOKEN_REFRESHED to prevent infinite refresh loops
      // on pages that already loaded the session via SSR.
      if (event === 'SIGNED_OUT') {
        console.log(`[AuthSync] Auth event detected: ${event}. Refreshing server components...`);
        // This re-fetches server components using the new cookies/session
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return null;
}