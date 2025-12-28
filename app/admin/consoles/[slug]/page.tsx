
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchConsoleBySlug, fetchManufacturers } from '@/lib/api';
import AdminConsoleEditorClient from '@/components/admin/AdminConsoleEditorClient';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function AdminConsoleEditPage(props: Props) {
    const params = await props.params;
    const supabase = await createClient();

    // 1. Server-Side Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        redirect('/');
    }

    // 2. Fetch Data Server-Side (Parallel)
    const [consoleRes, manufacturers] = await Promise.all([
        fetchConsoleBySlug(params.slug, true), // includeHidden=true
        fetchManufacturers()
    ]);

    if (!consoleRes.data) {
        return notFound();
    }

    // 3. Render Client Editor
    return (
        <Suspense fallback={<div className="p-8 text-center text-secondary font-mono animate-pulse">LOADING EDITOR...</div>}>
            <AdminConsoleEditorClient
                initialConsole={consoleRes.data}
                initialManufacturers={manufacturers}
            />
        </Suspense>
    );
}
