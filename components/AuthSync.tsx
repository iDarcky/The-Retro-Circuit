'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/singleton';

export default function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth changes (SignIn, SignOut, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // CRITICAL FIX: Strictly ignore SIGNED_IN and TOKEN_REFRESHED.
      // Only refresh the server components when the user explicitly signs out.
      if (event === 'SIGNED_OUT') {
        console.log('[AuthSync] User signed out. Refreshing view...');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}