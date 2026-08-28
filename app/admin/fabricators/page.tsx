
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { fetchManufacturers } from '../../../app/actions';
import FabricatorClient from '../../../components/admin/FabricatorClient';

export default async function AdminFabricatorsPage() {
    const supabase = await createClient();

    // 1. Server-Side Auth Check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/');
    }

    // 2. Fetch Data
    const manufacturers = await fetchManufacturers();

    // Per-brand console counts. A brand whose consoles are all drafts is hidden from
    // the public site by fetchPublicManufacturers() — the admin should say so rather
    // than leaving you to find the empty page yourself.
    const { data: rows } = await supabase
        .from('consoles')
        .select('manufacturer_id, status');

    const counts: Record<string, { total: number; published: number }> = {};
    for (const r of rows || []) {
        const key = (r as any).manufacturer_id;
        if (!key) continue;
        counts[key] = counts[key] || { total: 0, published: 0 };
        counts[key].total += 1;
        if ((r as any).status === 'published') counts[key].published += 1;
    }

    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center font-mono text-secondary">
                <div className="animate-pulse">LOADING FABRICATOR DATABASE...</div>
            </div>
        }>
            <FabricatorClient initialManufacturers={manufacturers} counts={counts} />
        </Suspense>
    );
}
