
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { fetchRoadmapItems, fetchAdminReleases } from '../../../app/actions/roadmap';
import RoadmapClient from '../../../components/admin/RoadmapClient';

export default async function AdminRoadmapPage() {
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
    const [roadmapItems, releases] = await Promise.all([
        fetchRoadmapItems(),
        fetchAdminReleases()
    ]);

    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center font-mono text-secondary">
                <div className="animate-pulse">LOADING MISSION DATA...</div>
            </div>
        }>
            <RoadmapClient initialRoadmap={roadmapItems} initialReleases={releases} />
        </Suspense>
    );
}
