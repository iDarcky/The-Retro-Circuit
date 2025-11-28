import { createClient } from '@supabase/supabase-js';

// Helper function to safely get environment variables
const getEnvVar = (key: string): string | undefined => {
  // Check for Next.js public env vars first
  if (typeof process !== 'undefined' && process.env) {
      if (key === 'VITE_SUPABASE_URL') return process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (key === 'VITE_SUPABASE_ANON_KEY') return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
  return undefined;
};

// Retrieve environment variables
const envUrl = getEnvVar('VITE_SUPABASE_URL');
const envKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Check configuration status
export const isSupabaseConfigured = !!(envUrl && envKey);

// Initialize Supabase client
// If variables are missing, use placeholders to prevent crash during build
export const supabase = createClient(
  envUrl || 'https://placeholder.supabase.co',
  envKey || 'placeholder-key'
);