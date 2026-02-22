import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Provide a stateless, anonymous client for public Server Component data fetching.
// This prevents Next.js from throwing 'Dynamic Server Usage' errors during cache revalidation or SSG.
export const supabaseAnon = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
    }
});
