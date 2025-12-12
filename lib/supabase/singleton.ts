import { createClient } from './client';

// Retrieve environment variables for Next.js
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check configuration status
export const isSupabaseConfigured = !!(envUrl && envKey);

// Initialize Supabase client using the SSR-compatible browser client
// We use a singleton pattern here so the app shares one client instance
export const supabase = createClient();
