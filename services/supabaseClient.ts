
import { createClient } from '@supabase/supabase-js';

// Helper function to safely get environment variables
const getEnvVar = (key: string): string => {
  // @ts-ignore
  const val = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env[key] : undefined;
  if (!val) {
    // We return an empty string initially to prevent crash on import, 
    // but the createClient call will likely fail or we can log a critical error.
    console.error(`CRITICAL: Missing environment variable ${key}`);
    return '';
  }
  return val;
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Application Configuration Error: Missing Supabase Environment Variables. Please check your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
