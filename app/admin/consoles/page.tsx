import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { fetchManufacturers } from '../../../app/actions';
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
    let manufacturers: any[] = [];

    try {
        const [consolesData, manufacturersData] = await Promise.all([
            supabase
                .from('consoles')
                // image_url + variant specs drive the readiness indicators in the index
                // (a console can't be published without an image, and is thin without a variant).
                .select('id, name, slug, status, updated_at, image_url, device_category, manufacturer:manufacturer(name), variants:console_variants(id, price_launch_usd, image_url)')
                .order('name'),
            fetchManufacturers()
        ]);

        if (consolesData.error) {
            console.error("Admin Index Fetch Error:", consolesData.error);
            return <div className="p-8 text-center font-mono text-accent">SYSTEM ERROR: {consolesData.error.message}</div>;
        }
        consoles = consolesData.data || [];
        manufacturers = manufacturersData || [];
    } catch (e: any) {
        return <div className="p-8 text-center font-mono text-accent">SYSTEM ERROR: {e.message}</div>;
    }

    return <ConsoleIndexClient initialConsoles={consoles} initialManufacturers={manufacturers} />;
}
