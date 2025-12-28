
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { fetchManufacturers, fetchConsoleList } from '../../lib/api';
import AdminDashboardClient from '../../components/admin/AdminDashboardClient';

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

    // 3. Fetch Initial Data Server-Side (Parallel)
    const [manufacturers, consoleList] = await Promise.all([
        fetchManufacturers(),
        fetchConsoleList()
    ]);

    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center font-mono text-secondary">
                <div className="animate-pulse">ACCESSING SECURE MAINFRAME...</div>
            </div>
        }>
            <AdminDashboardClient
                initialManufacturers={manufacturers}
                initialConsoles={consoleList as any}
                isAdmin={isAdmin}
            />
        </Suspense>
    );
}
