import { Metadata } from 'next';
import { roadmapData, completedItems } from '../../data/roadmap';
import RoadmapTimeline from '../../components/roadmap/RoadmapTimeline';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Project Roadmap | The Retro Circuit',
  description: 'Track our progress as we build the ultimate handheld gaming database. See what features are coming next.',
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary px-6 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          {/* System Online Pill - Matching /about */}
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-emerald-900/30 bg-emerald-950/10 text-[10px] md:px-3 md:py-1 md:text-xs font-mono uppercase tracking-widest text-emerald-400 mb-6 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             System Online // v1.0
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-pixel tracking-tighter mb-6">
            SYSTEM<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">
                ROADMAP<span className="text-blue-500 animate-pulse">_</span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-2xl leading-relaxed">
             We are building the definitive database for handheld gaming. Transparency is key.
             Here is our mission plan to launch Version 1.0.
          </p>
        </div>

        {/* COMPLETED MISSIONS LOG */}
        <div className="mb-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold font-mono uppercase tracking-widest text-emerald-500">
                    Mission Log: Completed
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-900/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors flex items-start gap-4">
                        <div className="mt-1 text-emerald-400">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-emerald-100 uppercase tracking-wide mb-1">{item.title}</h3>
                            <p className="text-xs text-emerald-200/60 leading-relaxed">{item.description}</p>
                            {item.date && <div className="mt-2 text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest">{item.date}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* FUTURE TIMELINE */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
             <div className="flex items-center gap-4 mb-12">
                <h2 className="text-xl font-bold font-mono uppercase tracking-widest text-blue-400">
                    Incoming Transmissions
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
            </div>
            <RoadmapTimeline phases={roadmapData} />
        </div>

        {/* Community CTA */}
        <div className="mt-24 p-8 border border-border-normal bg-bg-secondary/10 rounded-none relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold font-mono uppercase tracking-widest mb-2 text-text-primary">Have a Suggestion?</h3>
                    <p className="text-sm text-text-secondary">Join the conversation on our Discord or contribute on GitHub.</p>
                </div>
                <div className="flex gap-4">
                     <a href="https://github.com/danielmaghis/retro-circuit" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-bg-primary border border-border-normal text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                        GitHub Repo
                     </a>
                     {/* Placeholder for Discord Link */}
                     <button disabled className="px-6 py-3 bg-violet-900/20 border border-violet-500/30 text-violet-400 text-xs font-mono uppercase tracking-widest cursor-not-allowed opacity-50">
                        Discord (Soon)
                     </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
