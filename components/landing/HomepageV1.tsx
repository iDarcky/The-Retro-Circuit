import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { fetchLatestConsoles, fetchRealWorldLatest } from '@/lib/api/latest';
import { fetchConsoleList } from '@/lib/api/consoles';
import QuickCompare from './QuickCompare';

// --- Sub-components ---

const SectionHeader = ({ title, iconColor = "accent" }: { title: string, iconColor?: "primary" | "secondary" | "accent" }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-${iconColor} border-b-[6px] border-b-transparent`}></div>
    <h2 className="text-xl md:text-2xl font-pixel text-white tracking-tight">{title}</h2>
  </div>
);

const RailCard = ({ console, label }: { console: any, label: string }) => (
  <Link href={`/consoles/${console.slug}`} className="group flex items-center gap-4 p-3 bg-black/40 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all h-full">
    <div className="w-20 h-20 shrink-0 bg-black/60 flex items-center justify-center p-2 border border-white/10">
      {console.image_url ? (
        <img src={console.image_url} alt={console.name} className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
      ) : (
        <span className="text-xs text-gray-700 font-pixel">?</span>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">{console.manufacturer?.name}</div>
      <div className="text-base font-bold text-gray-300 group-hover:text-white truncate font-tech">{console.name}</div>
      <div className="text-[10px] font-mono text-secondary mt-1">{label}</div>
    </div>
  </Link>
);

export default async function HomepageV1() {
  // 1. Data Fetching with Resilience
  let latestAdded: any[] = [];
  let latestReleased: any[] = [];
  let allConsoles: any[] = [];

  try {
    const results = await Promise.allSettled([
      fetchLatestConsoles(3),
      fetchRealWorldLatest(3),
      fetchConsoleList()
    ]);

    if (results[0].status === 'fulfilled') latestAdded = results[0].value;
    if (results[1].status === 'fulfilled') latestReleased = results[1].value;
    if (results[2].status === 'fulfilled') allConsoles = results[2].value;

  } catch (e) {
    console.error('[HomepageV1] Critical Data Fetch Error:', e);
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8 flex flex-col gap-12 md:gap-16 pb-24">

      {/* 1. WELCOME MICRO HEADER (XS) - Spans Full Width */}
      <section className="flex flex-col gap-2 border-l-2 border-white/10 pl-4 py-1">
        <h1 className="text-sm font-bold font-mono text-gray-400 tracking-widest">WELCOME TO THE CIRCUIT</h1>
        <p className="text-base text-gray-300 max-w-prose font-tech">
          A living archive of retro handhelds — plus tools to help you pick the right one.
        </p>
        <div className="text-[10px] font-mono text-secondary/70 mt-1 uppercase tracking-wider">
          RC://ONLINE · ARCHIVE SYNCED · GUIDANCE AVAILABLE
        </div>
      </section>

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

        {/* 2. FINDER HERO (XL) - col-span-12, Inner Grid 8/4 */}
        <div className="col-span-1 md:col-span-12 relative group w-full">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 blur opacity-50 group-hover:opacity-75 transition-opacity"></div>

          <div className="relative bg-black/80 border-2 border-accent p-8 md:p-12 lg:p-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center backdrop-blur-sm min-h-[300px]">
            <div className="md:col-span-8">
              <h2 className="text-5xl md:text-7xl font-pixel text-white mb-6 drop-shadow-[4px_4px_0_rgba(255,107,157,0.4)]">
                FINDER<span className="animate-pulse">_</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 font-tech leading-relaxed">
                Identify the perfect handheld for your library and budget.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col items-start md:items-end gap-4">
              <Link
                href="/finder"
                className="bg-accent hover:bg-white text-black text-xl md:text-2xl font-bold font-pixel px-10 py-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)] hover:shadow-[10px_10px_0_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all flex items-center gap-4"
              >
                START FINDER
                <ArrowRight className="w-8 h-8" />
              </Link>
              <span className="text-xs font-mono text-accent/80 uppercase tracking-widest bg-black/50 px-3 py-1.5 border border-accent/20">
                EST. TIME: ~2 MIN
              </span>
            </div>
          </div>
        </div>

        {/* 3. DATABASE MODULE (L) - col-span-12, w-full */}
        <div className="col-span-1 md:col-span-12 w-full bg-bg-secondary/5 border-y border-white/5 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-4xl"> {/* Relaxed max-w slightly but kept for readability */}
              <SectionHeader title="CONSOLE VAULT" iconColor="primary" />
              <p className="text-sm md:text-base text-gray-500 font-mono -mt-4 mb-2">
                Comprehensive specifications for {allConsoles.length}+ devices. Search, filter, and analyze the entire history of handhelds.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0">
              <Link
                href="/consoles"
                className="px-8 py-4 bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all font-tech font-bold uppercase tracking-widest flex items-center gap-2 text-lg"
              >
                Browse Consoles
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                href="/fabricators"
                className="px-8 py-4 text-gray-400 hover:text-white border border-transparent hover:border-gray-700 transition-all font-tech font-bold uppercase tracking-widest flex items-center gap-2 text-lg"
              >
                Browse Fabricators
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. VS MODULE (M) - Split 4/8, col-span-12, w-full */}
        <div className="col-span-1 md:col-span-12 w-full border border-white/5 bg-black/20 p-8 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Text: col-span-4 */}
          <div className="md:col-span-4 flex flex-col justify-center">
              <SectionHeader title="QUICK COMPARE" iconColor="secondary" />
              <p className="text-base text-gray-400 font-tech leading-relaxed mb-8">
                Select two devices to view a head-to-head performance analysis, including emulation limits and physical dimensions.
              </p>
              <div>
                <Link
                  href="/arena"
                  className="inline-flex items-center gap-2 text-secondary hover:text-white font-mono text-sm uppercase tracking-widest border-b border-secondary/50 hover:border-white pb-0.5 transition-colors"
                >
                  Enter Full Arena <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
          </div>

          {/* Right Widget: col-span-8 */}
          <div className="md:col-span-8 w-full">
             <QuickCompare consoles={allConsoles} />
          </div>
        </div>

        {/* 5. RAILS (S) - Side-by-side 6/6, w-full */}
        <div className="col-span-1 md:col-span-6 w-full flex flex-col h-full">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
              LATEST ADDED
            </h3>
            <div className="grid grid-cols-1 gap-4 flex-1">
              {latestAdded.map(c => (
                <RailCard
                  key={c.id}
                  console={c}
                  label={`ADDED ${new Date(c.created_at).toLocaleDateString()}`}
                />
              ))}
              {latestAdded.length === 0 && <div className="text-gray-600 text-xs italic">System Offline.</div>}
            </div>
        </div>

        <div className="col-span-1 md:col-span-6 w-full flex flex-col h-full">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
              LATEST RELEASED
            </h3>
            <div className="grid grid-cols-1 gap-4 flex-1">
              {latestReleased.map(c => (
                <RailCard
                  key={c.id}
                  console={c}
                  label={`RELEASED ${c.release_year || 'N/A'}`}
                />
              ))}
               {latestReleased.length === 0 && <div className="text-gray-600 text-xs italic">System Offline.</div>}
            </div>
        </div>

        {/* 6. SIGNALS TEASER (XS) - col-span-12, w-full */}
        <div className="col-span-1 md:col-span-12 w-full mt-4 pt-8 border-t border-white/5 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-8">
             <h3 className="text-xs font-pixel text-gray-600 shrink-0">SIGNALS_</h3>
             <div className="flex-1">
               <div className="font-bold text-gray-300 font-tech mb-1 text-lg">STATE OF THE ARCHIVE: 2025 ROADMAP</div>
               <p className="text-base text-gray-500 max-w-prose truncate font-mono">
                  System upgrades initialized. New sorting algorithms and visualization modules coming online.
               </p>
             </div>
             <Link href="/news" className="text-xs font-mono text-primary hover:text-white uppercase tracking-widest shrink-0">
                READ SIGNAL →
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
