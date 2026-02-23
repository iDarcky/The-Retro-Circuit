
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

    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center font-mono text-secondary">
                <div className="animate-pulse">LOADING FABRICATOR DATABASE...</div>
            </div>
        }>
            <FabricatorClient initialManufacturers={manufacturers} />
        </Suspense>
    );
}
