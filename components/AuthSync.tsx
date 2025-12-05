'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';

export default function AuthSync() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen for auth changes (SignIn, SignOut, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
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