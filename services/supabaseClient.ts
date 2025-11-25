
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

// Export configuration status for UI components to display warnings
export const isSupabaseConfigured = !!(envUrl && envKey);

if (!isSupabaseConfigured) {
  console.error(`CRITICAL CONFIG ERROR: Missing Supabase environment variables. 
  The app is running in OFFLINE/DEMO mode. 
  Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.`);
}

// Initialize Supabase client
// We use placeholder values if config is missing to prevent the app from crashing at boot.
// Real requests will fail gracefully and be handled by the service layer fallbacks.
export const supabase = createClient(
  envUrl || 'https://placeholder.supabase.co',
  envKey || 'placeholder-key'
);
