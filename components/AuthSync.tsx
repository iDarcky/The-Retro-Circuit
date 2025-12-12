'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/singleton';

export default function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    // DIAGNOSTIC: Check connection status on mount
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isPlaceholder = url?.includes('placeholder') || !key;

    console.log(`[Diagnostics] Supabase Status:`);
    console.log(`- URL Configured: ${!!url} ${url ? `(${url.substring(0, 15)}...)` : ''}`);
    console.log(`- Key Configured: ${!!key} (Length: ${key?.length || 0})`);
    console.log(`- Connection Mode: ${isPlaceholder ? 'PLACEHOLDER (Auth Disabled)' : 'LIVE'}`);

    if (isPlaceholder) {
      console.warn('CRITICAL: App is running in PLACEHOLDER mode. Authentication will not work.');
    }

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