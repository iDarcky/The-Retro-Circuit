
import { createClient } from '@supabase/supabase-js';

// Helper function to safely get environment variables
const getEnvVar = (key: string): string => {
  // @ts-ignore
  const val = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env[key] : undefined;
  if (!val) {
    console.warn(`WARNING: Missing environment variable ${key}. App will run in SIMULATION MODE.`);
    return '';
  }
  return val;
};

// Use placeholders if env vars are missing to prevent crash during createClient initialization.
// The service layer (geminiService.ts) detects connection failures and falls back to mock data automatically.
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
