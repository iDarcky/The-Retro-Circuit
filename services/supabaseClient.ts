import { createClient } from '@supabase/supabase-js';

// Helper function to safely get environment variables
const getEnvVar = (key: string): string | undefined => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    console.warn('Error reading environment variable:', key);
  }
  return undefined;
};

// Prioritize environment variables from .env
// We fallback to the hardcoded values only if the env vars are missing in this environment
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || 'https://kxquaojpyyoryphcisev.supabase.co';
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cXVhb2pweXlvcnlwaGNpc2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTEwMjYsImV4cCI6MjA3OTQ2NzAyNn0.ZxFvzK8T4cgY9_PBV2fDYOkhyoE1IvJ6I8g2KKMuvmY';

if (!getEnvVar('VITE_SUPABASE_URL')) {
  console.warn("VITE_SUPABASE_URL not found in env, using fallback.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
