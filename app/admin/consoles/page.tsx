
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import ConsoleIndexClient from '../../../components/admin/ConsoleIndexClient';

export default async function AdminConsolesPage() {
    const supabase = await createClient();

    // 1. Server-Side Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        redirect('/'); // Or render a 403 page
    }

    // 2. Server-Side Data Fetch
    let consoles: any[] = [];
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select('id, name, slug, status, updated_at')
            .order('name');

        if (error) {
            console.error("Admin Index Fetch Error:", error);
            // In admin, seeing the error is better than silently failing
            return <div className="p-8 text-center font-mono text-accent">SYSTEM ERROR: {error.message}</div>;
        }
        consoles = data || [];
    } catch (e: any) {
        return <div className="p-8 text-center font-mono text-accent">SYSTEM ERROR: {e.message}</div>;
    }

    return <ConsoleIndexClient initialConsoles={consoles} />;
}
