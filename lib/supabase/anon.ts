import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseAnonKey } from './env';

const supabaseUrl = getSupabaseUrl();
const supabaseKey = getSupabaseAnonKey();

// Provide a stateless, anonymous client for public Server Component data fetching.
// This prevents Next.js from throwing 'Dynamic Server Usage' errors during cache revalidation or SSG.
export const supabaseAnon = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
    }
});
