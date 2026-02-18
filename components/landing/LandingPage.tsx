import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Swords, ChevronRight, History, Calendar, Search } from 'lucide-react';
import { fetchLatestConsoles, fetchRealWorldLatest } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import QuickCompare from './QuickCompare';
import { ConsoleSearch } from '../arena/ConsoleSearch';
import { useRouter } from 'next/navigation';
import FinderSection from './FinderSection';

export default async function LandingPage() {
  const latestAdded = await fetchLatestConsoles(5);
  const latestReleases = await fetchRealWorldLatest(5);
  const allConsoles = await fetchConsoleList();

  // Prepare simple console list for the finder
  const searchableConsoles = allConsoles.map(c => ({ name: c.name, slug: c.slug }));

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary selection:bg-color-primary selection:text-white pb-32 font-sans">

      {/* 1. HERO - TYPOGRAPHIC STATEMENT */}
      <header className="px-6 md:px-12 pt-32 pb-24 border-b border-border-subtle relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-bg-secondary/50 text-xs font-mono uppercase tracking-widest text-text-muted mb-8 animate-fade-in backdrop-blur-sm">
               <div className="w-2 h-2 bg-color-success rounded-full animate-pulse"></div>
               System Online // V.2.0
            </div>

            <h1 className="text-[5vw] md:text-[7vw] leading-[1.1] font-pixel font-bold tracking-tighter uppercase mb-12 text-white max-w-6xl mx-auto drop-shadow-2xl">
              Welcome to<br/>
              the <span className="text-color-primary">Circuit_</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-6 items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Link
                  href="/consoles"
                  className="inline-flex items-center gap-3 bg-color-primary text-white font-mono text-sm md:text-base px-8 py-4 hover:bg-white hover:text-black transition-all uppercase tracking-widest border border-transparent hover:border-white shadow-lg shadow-color-primary/20"
                >
                  Browse The Library <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 bg-transparent text-text-secondary font-mono text-sm md:text-base px-8 py-4 hover:text-white transition-all uppercase tracking-widest border border-border-normal hover:border-white"
                >
                  Manifesto
                </Link>
            </div>
          </div>
        </div>

        {/* Background Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:100px_100px] opacity-[0.03] pointer-events-none"></div>
      </header>

      {/* 2. THE FINDER */}
      <FinderSection consoles={searchableConsoles} />

      {/* 3. ANALYSIS & COMPARE */}
      <section className="px-6 md:px-12 py-24 border-b border-border-subtle bg-bg-secondary/20 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-bg-secondary text-xs font-mono uppercase tracking-widest text-text-muted mb-6">
                    <Swords className="w-3 h-3" /> Analysis Tools
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">HEAD-TO-HEAD<br/>COMPARISON.</h2>
                  <p className="text-text-secondary text-lg font-light mb-8 max-w-md leading-relaxed">
                     Our arena mode allows for direct specification battles. Analyze CPU clock speeds, display density, and physical form factors in real-time.
                  </p>
                  <Link href="/arena" className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-text-primary border-b border-color-primary pb-1 hover:text-color-primary transition-colors">
                     Enter The Arena <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>

              <div className="relative group">
                 <div className="relative z-10 border border-border-subtle bg-bg-primary p-6 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-color-primary transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-color-primary/50"></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-color-primary transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-color-primary/50"></div>
                    <QuickCompare consoles={allConsoles} />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. DUAL TICKER: LATEST ADDED & LATEST RELEASES */}
      <section className="px-6 md:px-12 py-24">
         <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

                {/* LATEST ADDITIONS */}
                <div>
                    <div className="flex items-center gap-3 mb-12 pb-4 border-b border-border-subtle">
                        <History className="w-5 h-5 text-color-primary" />
                        <h3 className="text-2xl font-bold tracking-tight">LATEST ACQUISITIONS</h3>
                    </div>

                    <div className="flex flex-col gap-0">
                    {latestAdded.map((console, index) => (
                        <Link
                            key={console.id}
                            href={`/consoles/${console.slug}`}
                            className="group flex items-center justify-between py-6 border-b border-border-subtle hover:bg-bg-secondary/50 transition-colors px-2 -mx-2 rounded-sm"
                        >
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-xs text-text-muted">{(index + 1).toString().padStart(2, '0')}</span>
                                {console.image_url ? (
                                <Image
                                    src={console.image_url}
                                    alt={console.name}
                                    width={60}
                                    height={40}
                                    className="w-16 h-auto object-contain mix-blend-screen opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                                />
                                ) : (
                                <div className="w-16 h-10 bg-border-subtle/50"></div>
                                )}
                                <div>
                                    <span className="block font-mono text-[10px] uppercase text-text-muted mb-1 group-hover:text-color-primary transition-colors">
                                        {console.manufacturer?.name}
                                    </span>
                                    <h4 className="text-lg font-bold tracking-tight group-hover:text-white transition-colors">
                                        {console.name}
                                    </h4>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-border-normal group-hover:text-color-primary -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    ))}
                    </div>
                </div>

                {/* NEW RELEASES */}
                <div>
                    <div className="flex items-center gap-3 mb-12 pb-4 border-b border-border-subtle">
                        <Calendar className="w-5 h-5 text-text-secondary" />
                        <h3 className="text-2xl font-bold tracking-tight text-text-secondary">NEW RELEASES</h3>
                    </div>

                    <div className="flex flex-col gap-0">
                    {latestReleases.map((console, index) => (
                        <Link
                            key={`release-${console.id}`}
                            href={`/consoles/${console.slug}`}
                            className="group flex items-center justify-between py-6 border-b border-border-subtle hover:bg-bg-secondary/50 transition-colors px-2 -mx-2 rounded-sm"
                        >
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-xs text-text-muted">
                                    {console.specs?.release_date ? new Date(console.specs.release_date).getFullYear() : 'TBA'}
                                </span>

                                <div>
                                    <span className="block font-mono text-[10px] uppercase text-text-muted mb-1 group-hover:text-text-primary transition-colors">
                                        {console.manufacturer?.name}
                                    </span>
                                    <h4 className="text-lg font-bold tracking-tight text-text-secondary group-hover:text-white transition-colors">
                                        {console.name}
                                    </h4>
                                </div>
                            </div>

                            <div className="font-mono text-xs text-text-muted group-hover:text-text-primary">
                                VIEW SPECS
                            </div>
                        </Link>
                    ))}
                    </div>
                </div>

            </div>
         </div>
      </section>

    </div>
  );
}
