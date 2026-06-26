import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getServiceRoleKey } from './env';

// Provide a stateless, admin client for backend operations requiring elevated privileges.
export const createAdminClient = () => createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
        persistSession: false,
    }
});
