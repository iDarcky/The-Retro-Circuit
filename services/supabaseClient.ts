
import { createClient } from '@supabase/supabase-js';

// Helper function to safely get environment variables
const getEnvVar = (key: string): string | undefined => {
  // @ts-ignore
  const val = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env[key] : undefined;
  return val;
};

// Retrieve environment variables
const envUrl = getEnvVar('VITE_SUPABASE_URL');
const envKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Check configuration status
export const isSupabaseConfigured = !!(envUrl && envKey);

// Initialize Supabase client
// If variables are missing (local dev without .env), use placeholders to prevent crash.
// Vercel will inject the correct values during build/runtime.
export const supabase = createClient(
  envUrl || 'https://placeholder.supabase.co',
  envKey || 'placeholder-key'
);
