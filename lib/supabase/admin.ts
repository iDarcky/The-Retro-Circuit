import { createClient } from '@supabase/supabase-js';

// Fallback to dummy values to prevent build crashes when env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Provide a stateless, admin client for backend operations requiring elevated privileges.
export const createAdminClient = () => createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false,
    }
});
