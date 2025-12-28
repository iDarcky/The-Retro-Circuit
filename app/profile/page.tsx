
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import ProfileClient from '../../components/auth/ProfileClient';

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1. Server-Side Auth Check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 2. Fetch Admin Status Server-Side
    let isAdmin = false;
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role === 'admin') {
        isAdmin = true;
    }

    // 3. Render Client Component with Hydrated Data
    return <ProfileClient initialUser={user} initialAdminStatus={isAdmin} />;
}
