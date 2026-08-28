
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import AdminHubClient from '../../components/admin/AdminHubClient';
import { fetchAdminDashboard } from '../actions/dashboard';

export default async function AdminPage() {
    const supabase = await createClient();

    // 1. Server-Side Auth Check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 2. Server-Side Admin Role Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    if (!isAdmin) {
        redirect('/'); // Or render an Access Denied component
    }

    // 3. Gap counts for the dashboard
    const dashboard = await fetchAdminDashboard();

    // 4. Render Hub
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center font-mono text-secondary">
                <div className="animate-pulse">ACCESSING SECURE MAINFRAME...</div>
            </div>
        }>
            <AdminHubClient data={dashboard} />
        </Suspense>
    );
}
