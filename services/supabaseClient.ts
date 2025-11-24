import { createClient } from '@supabase/supabase-js';

// Fix TS error: Property 'env' does not exist on type 'ImportMeta'
const env = (import.meta as any).env;

// Prioritize environment variables from .env
// We fallback to the hardcoded values only if the env vars are missing in this environment
const SUPABASE_URL = env?.VITE_SUPABASE_URL || 'https://kxquaojpyyoryphcisev.supabase.co';
const SUPABASE_ANON_KEY = env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cXVhb2pweXlvcnlwaGNpc2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTEwMjYsImV4cCI6MjA3OTQ2NzAyNn0.ZxFvzK8T4cgY9_PBV2fDYOkhyoE1IvJ6I8g2KKMuvmY';

if (!env?.VITE_SUPABASE_URL) {
  console.warn("VITE_SUPABASE_URL not found in env, using fallback.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);