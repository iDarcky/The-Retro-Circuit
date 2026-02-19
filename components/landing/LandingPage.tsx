import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Swords, History, Calendar } from 'lucide-react';
import { fetchLatestConsoles, fetchRealWorldLatest } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import QuickCompare from './QuickCompare';
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
      <header className="px-6 md:px-12 pt-32 pb-32 border-b border-border-subtle relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0">
            <Image
                src="/game_boy_backgroud.webp"
                alt="Background"
                fill
                className="object-cover opacity-40 blur-sm"
                priority
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent" />
        </div>

        <div className="max-w-[1800px] mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Title & Subtitle */}
            <div className="flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-900/30 bg-emerald-950/10 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   System Online // V.2.0
                </div>

                <h1 className="text-[5vw] md:text-[6vw] leading-[1.1] font-pixel font-bold tracking-tighter uppercase mb-8 text-white drop-shadow-2xl">
                  Welcome to<br/>
                  the <span className="text-color-primary">Circuit_</span>
                </h1>

                <p className="text-xl md:text-2xl text-text-secondary font-light max-w-xl leading-relaxed mb-8">
                    The definitive archive of handheld gaming history. Explore detailed specifications, compare hardware, and track the evolution of portable play.
                </p>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex flex-col items-end justify-center h-full gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Link
                  href="/consoles"
                  className="inline-flex items-center gap-3 bg-color-primary text-white font-mono text-sm md:text-base px-8 py-4 hover:bg-white hover:text-black transition-all uppercase tracking-widest border border-transparent hover:border-white shadow-lg shadow-color-primary/20 w-full md:w-auto justify-center"
                >
                  Browse The Library <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 bg-bg-primary/80 backdrop-blur-sm text-text-secondary font-mono text-sm md:text-base px-8 py-4 hover:text-white transition-all uppercase tracking-widest border border-border-normal hover:border-white w-full md:w-auto justify-center"
                >
                  Manifesto
                </Link>
            </div>
          </div>
        </div>

        {/* Background Subtle Grid - Lower Opacity */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:100px_100px] opacity-[0.02] pointer-events-none z-10"></div>
      </header>

      {/* 2. THE FINDER */}
      <FinderSection consoles={searchableConsoles} />

      {/* 3. ANALYSIS & COMPARE */}
      <section className="px-6 md:px-12 py-24 border-b border-border-subtle bg-bg-secondary/20 relative overflow-hidden">
        {/* Subtle Purple Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-violet-900/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1800px] mx-auto relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-900/30 bg-violet-950/10 text-xs font-mono uppercase tracking-widest text-violet-400 mb-6">
                    <Swords className="w-3 h-3" /> Analysis Tools
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">HEAD-TO-HEAD<br/>COMPARISON.</h2>
                  <p className="text-text-secondary text-lg font-light mb-8 max-w-md leading-relaxed">
                     Our arena mode allows for direct specification battles. Analyze CPU clock speeds, display density, and physical form factors in real-time.
                  </p>
                  <Link href="/arena" className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-text-primary border-b border-violet-500 pb-1 hover:text-violet-400 transition-colors">
                     Enter The Arena <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>

              <div className="relative group">
                 <div className="relative z-10 border border-border-subtle bg-bg-primary p-6 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 hover:border-violet-500/30">
                    <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-violet-500 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-violet-500/20"></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-violet-500 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-violet-500/20"></div>
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
                        <Calendar className="w-5 h-5 text-cyan-500" />
                        <h3 className="text-2xl font-bold tracking-tight text-cyan-100/80">NEW RELEASES</h3>
                    </div>

                    <div className="flex flex-col gap-0">
                    {latestReleases.map((console) => (
                        <Link
                            key={`release-${console.id}`}
                            href={`/consoles/${console.slug}`}
                            className="group flex items-center justify-between py-6 border-b border-border-subtle hover:bg-cyan-950/10 transition-colors px-2 -mx-2 rounded-sm"
                        >
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-xs text-cyan-700 group-hover:text-cyan-400 transition-colors">
                                    {console.specs?.release_date ? new Date(console.specs.release_date).getFullYear() : 'TBA'}
                                </span>

                                <div>
                                    <span className="block font-mono text-[10px] uppercase text-text-muted mb-1 group-hover:text-cyan-300 transition-colors">
                                        {console.manufacturer?.name}
                                    </span>
                                    <h4 className="text-lg font-bold tracking-tight text-text-secondary group-hover:text-cyan-50 transition-colors">
                                        {console.name}
                                    </h4>
                                </div>
                            </div>

                            <div className="font-mono text-xs text-text-muted group-hover:text-cyan-400">
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
