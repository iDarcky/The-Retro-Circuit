import { Metadata } from 'next';
import RoadmapView from '../../../components/roadmap/RoadmapView';
import { fetchRoadmapItems, fetchAdminReleases } from '../../../app/actions/roadmap';
import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin: Roadmap | The Retro Circuit',
};

export default async function AdminRoadmapPage() {
  const supabase = await createClient();
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

  // Fetch all data including drafts
  const [roadmapItems, releases] = await Promise.all([
      fetchRoadmapItems(),
      fetchAdminReleases(),

  ]);

  const upcomingItems = roadmapItems.filter(item => item.status !== 'completed');

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-red-900/30 bg-red-950/10 text-[10px] md:px-3 md:py-1 md:text-xs font-mono uppercase tracking-widest text-red-400 mb-6 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(239,68,68,0.1)]">
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            Admin // Control Center
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-pixel tracking-tighter mb-6">
            EDIT<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-400">
              ROADMAP<span className="text-red-500 animate-pulse">_</span>
            </span>
          </h1>
        </div>

        {/* Tabbed View Component with Admin Controls Enabled */}
        <RoadmapView releases={releases} upcomingItems={upcomingItems} isAdmin={true} />
      </div>
    </div>
  );
}
