import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables for Next.js
// Next.js exposes vars starting with NEXT_PUBLIC_ to the browser
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check configuration status
export const isSupabaseConfigured = !!(envUrl && envKey);

// Initialize Supabase client
// If variables are missing (local dev without .env), use placeholders to prevent crash.
// Vercel will inject the correct values during build/runtime.
export const supabase = createClient(
  envUrl || 'https://placeholder.supabase.co',
  envKey || 'placeholder-key'
);