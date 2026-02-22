import { Metadata } from 'next';
import RoadmapView from '../../components/roadmap/RoadmapView';
import { siteConfig } from '../../config/site';
import { fetchRoadmapItems } from '../../app/actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Project Roadmap | The Retro Circuit',
  description: 'Track our progress as we build the ultimate handheld gaming database. See what features are coming next.',
};

export default async function RoadmapPage() {
  const roadmapItems = await fetchRoadmapItems();

  const completedItems = roadmapItems.filter(item => item.status === 'completed');
  const upcomingItems = roadmapItems.filter(item => item.status !== 'completed');

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          {/* System Online Pill - Dynamic Version */}
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-emerald-900/30 bg-emerald-950/10 text-[10px] md:px-3 md:py-1 md:text-xs font-mono uppercase tracking-widest text-emerald-400 mb-6 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            System Online // {siteConfig.version}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-pixel tracking-tighter mb-6">
            SYSTEM<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">
              ROADMAP<span className="text-blue-500 animate-pulse">_</span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-2xl leading-relaxed">
            We are building the definitive database for handheld gaming. Transparency is key.
            Here is our mission plan to launch Version 1.0.0.
          </p>
        </div>

        {/* Tabbed View Component */}
        <RoadmapView completedItems={completedItems} upcomingItems={upcomingItems} />

        {/* Community CTA */}
        <div className="mt-24 p-8 border border-border-normal bg-bg-secondary/10 rounded-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold font-mono uppercase tracking-widest mb-2 text-text-primary">Have a Suggestion?</h3>
              <p className="text-sm text-text-secondary">Send us an email with your ideas to help shape the future.</p>
            </div>
            <div className="flex gap-4">
              <a href="mailto:contact@theretrocircuit.com" className="px-6 py-3 bg-bg-primary border border-border-normal text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                contact@theretrocircuit.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
