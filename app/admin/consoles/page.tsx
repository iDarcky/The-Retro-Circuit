
import { createClient } from '../../../lib/supabase/server';
import ConsoleIndexClient from '../../../components/admin/ConsoleIndexClient';

export default async function AdminConsolesPage() {
    const supabase = await createClient();

    // Check Admin Status
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return <div className="p-8 text-center font-mono text-accent border-2 border-accent m-8">ACCESS DENIED. PLEASE LOGIN.</div>;
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        return <div className="p-8 text-center font-mono text-accent border-2 border-accent m-8">ACCESS DENIED. ADMIN CLEARANCE REQUIRED.</div>;
    }

    // Server-Side Data Fetch
    // Note: fetchConsoleList uses createClient() internally which is the Browser Client by default if imported from ../supabase/client.
    // However, since we are in a Server Component, we should ideally pass the supabase client or rely on cookies being present.
    // My previous fix to lib/api/consoles.ts instantiated createClient() locally.
    // In a Server Component, 'createClient' from 'lib/supabase/client' MIGHT work if env vars are present, but it won't have the cookie.
    // BUT, 'fetchConsoleList' takes 'includeHidden'. If RLS allows read access to drafts for admins, we need the admin's session.
    // The Browser Client instantiated in a Server Component WONT have the session.

    // SOLUTION: Use the local server client to fetch manually OR assume fetchConsoleList is public-safe.
    // But we need 'includeHidden=true' which implies protected data.
    // Ideally, I should update fetchConsoleList to accept a client, or just query here.
    // Querying here is safer for SSR Auth.

    let consoles: any[] = [];
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select('id, name, slug, status, updated_at')
            .order('name');

        if (error) {
            console.error("Admin Index Fetch Error:", error);
            return <div className="p-8 text-center font-mono text-accent">SYSTEM ERROR: {error.message}</div>;
        }
        consoles = data || [];
    } catch (e: any) {
        return <div className="p-8 text-center font-mono text-accent">SYSTEM ERROR: {e.message}</div>;
    }

    return <ConsoleIndexClient initialConsoles={consoles} />;
}
