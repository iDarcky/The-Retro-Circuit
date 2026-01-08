import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { fetchLatestConsoles, fetchRealWorldLatest } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import QuickCompare from './QuickCompare';

export default async function LandingPage() {
  // Fetch data
  const latestConsoles = await fetchLatestConsoles(3);
  const upcomingConsoles = await fetchRealWorldLatest(3);
  const allConsoles = await fetchConsoleList();

  // Helper for badges
  const SpecBadge = ({ label, value }: { label: string, value?: string | number | null }) => {
     if (!value) return null;
     return (
        <div className="bg-black/90 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-lg text-gray-400">
             <span className="text-secondary mr-1 font-tech">{label}:</span>{value}
        </div>
     );
  };

  return (
    <div className="bg-bg-primary font-mono selection:bg-accent selection:text-white flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12">

      {/* SECTION I: WELCOME (H1) */}
      <section className="mb-16 border-b-2 border-dashed border-gray-700 pb-12 relative text-center">
          <h1 className="text-4xl md:text-6xl font-pixel text-white mb-6 drop-shadow-[4px_4px_0_rgba(255,0,255,0.5)]">
            Welcome to the <br />
            <span className="text-secondary">Circuit_</span>
          </h1>

          <div className="mx-auto max-w-3xl">
              <p className="font-mono text-lg md:text-xl text-white font-bold mb-4">
                  A structured environment for understanding handheld gaming systems.
              </p>
              <p className="font-mono text-gray-400 leading-relaxed mb-6">
                  The handheld market is fragmented across variants, revisions, and silent updates.
                  The Retro Circuit organizes that information into a consistent, comparable system.
              </p>
              <div>
                <Link href="/about" className="text-secondary hover:text-white transition-colors font-bold text-sm tracking-widest">
                    [about system]
                </Link>
              </div>
          </div>
      </section>

      {/* SECTION II: CONSOLE VAULT [01] */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-8 flex items-center gap-3">
            <span className="text-accent whitespace-nowrap">[ 01 ]</span>
            CONSOLE VAULT_
        </h2>

        <div className="vault-section p-6 md:p-12 relative border border-gray-800 bg-black/20">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex-1">
                      <p className="text-lg md:text-xl font-bold text-gray-300 mb-2">
                          Find and compare your favorite handhelds...
                      </p>
                      <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">
                           Start by browsing all consoles or manufacturers
                      </p>
                 </div>

                 <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                       {/* Browse Fabricators */}
                       <Link href="/fabricators" className="bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-white text-lg font-bold px-8 py-4 flex items-center justify-center gap-3 transition-all min-w-[240px]">
                          <span className="font-tech tracking-widest">BROWSE FABRICATORS</span>
                          <ArrowUpRight size={20} />
                      </Link>

                      {/* Browse Consoles */}
                      <Link href="/consoles" className="bg-white text-black text-lg font-bold px-8 py-4 flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black shadow-[8px_8px_0_var(--color-accent)] min-w-[240px]">
                          <span className="font-tech tracking-widest">BROWSE CONSOLES</span>
                          <ArrowUpRight size={20} />
                      </Link>
                  </div>
             </div>
        </div>
      </section>

      {/* SECTION III: ANALYSIS TOOLS [02] */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-8 flex items-center gap-3">
            <span className="text-primary whitespace-nowrap">[ 02 ]</span>
            ANALYSIS TOOLS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: FINDER */}
            <div className="vault-section p-8 border border-gray-800 bg-black/20 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-primary border-b-[8px] border-b-transparent animate-pulse"></div>
                        <h3 className="text-2xl font-pixel text-white tracking-tight">FINDER_</h3>
                    </div>
                    <p className="text-white font-mono text-sm md:text-base font-bold mb-1">
                        Not sure which handheld to buy?
                    </p>
                    <p className="text-gray-500 font-mono text-xs md:text-sm mb-8">
                        Answer a few questions and we'll narrow it down!
                    </p>
                </div>
                <Link
                    href="/finder"
                    className="w-full bg-primary text-black font-tech font-bold text-lg px-8 py-3 flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0_rgba(255,255,255,0.5)]"
                >
                    START QUIZ
                    <ArrowUpRight size={20} />
                </Link>
            </div>

            {/* Right: QUICK COMPARE */}
            <div className="vault-section p-8 border border-gray-800 bg-black/20 flex flex-col">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-secondary border-b-[8px] border-b-transparent animate-pulse"></div>
                        <h3 className="text-xl font-pixel text-white">QUICK COMPARE_</h3>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                        Select two devices to view a head-to-head performance analysis.
                    </p>
                </div>
                {/*
                  QuickCompare is set to flex-grow internally, but we need to ensure
                  the container allows it to expand without overflowing.
                  By adding flex-col to parent, it should fill available space.
                */}
                <div className="flex-grow">
                     <QuickCompare consoles={allConsoles} />
                </div>
            </div>
        </div>
      </section>

      {/* SECTION IV: LATEST TRANSMISSIONS [03] */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-8 flex items-center gap-3">
            <span className="text-gray-500 whitespace-nowrap">[ 03 ]</span>
            LATEST TRANSMISSIONS
        </h2>

        {/* New in the Vault */}
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-6 pl-2 border-l-2 border-secondary">
                 <h3 className="text-lg md:text-xl font-pixel text-white tracking-tight">
                    NEW IN THE VAULT_
                 </h3>
                 <span className="text-sm text-gray-500 font-mono hidden md:inline-block">
                    // RECENTLY ARCHIVED
                 </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestConsoles.map((console) => (
                    <Link
                        href={`/consoles/${console.slug}`}
                        key={console.id}
                        className="group flex flex-col device-card p-6 relative rounded-lg hover:border-secondary transition-colors"
                    >
                        {/* "NEW" Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <div className="bg-accent text-black text-[10px] font-tech font-bold tracking-widest px-2 py-1 border border-black shadow-[2px_2px_0_black]">
                                NEW ENTRY
                            </div>
                        </div>

                        {/* Image Area */}
                        <div className="h-[200px] w-full flex items-center justify-center mb-6 bg-slate-900/50 rounded-sm relative overflow-hidden">
                            {console.image_url ? (
                                <Image
                                    src={console.image_url}
                                    alt={console.name}
                                    width={300}
                                    height={200}
                                    className="max-h-[160px] w-auto h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-slate-700 font-pixel text-4xl">?</span>
                            )}
                            {/* Form Factor Badge */}
                            {console.form_factor && (
                                <div className="absolute top-2 left-2">
                                    <div className="bg-black/90 border border-slate-500 text-slate-300 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase">
                                        {console.form_factor}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Stack */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-mono text-primary uppercase tracking-widest">
                                {console.manufacturer?.name || 'UNKNOWN'}
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors font-pixel leading-tight">
                                {console.name}
                            </h3>
                            <div className="text-lg font-tech tracking-widest text-accent font-bold border-b border-slate-800 pb-4 mb-4">
                                {console.specs?.price_launch_usd ? `$${console.specs.price_launch_usd}` : 'PRICE UNKNOWN'}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <SpecBadge label="CPU" value={console.specs?.cpu_model || console.specs?.cpu_architecture} />
                                <SpecBadge label="SCR" value={console.specs?.screen_size_inch ? `${console.specs.screen_size_inch}"` : null} />
                                <SpecBadge label="OS" value={console.specs?.os} />
                                {(!console.specs?.cpu_model && !console.specs?.screen_size_inch && !console.specs?.os) && (
                                    <span className="text-xs text-slate-600 font-mono italic">AWAITING SPECS...</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* New Releases */}
        <div>
            <div className="flex items-center gap-4 mb-6 pl-2 border-l-2 border-accent">
                 <h3 className="text-lg md:text-xl font-pixel text-white tracking-tight">
                    NEW & UPCOMING RELEASES_
                 </h3>
                 <span className="text-sm text-gray-500 font-mono hidden md:inline-block">
                    // MARKET WATCH
                 </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {upcomingConsoles.map((console) => (
                    <Link
                        href={`/consoles/${console.slug}`}
                        key={console.id}
                        className="group flex flex-col device-card p-6 relative rounded-lg hover:border-accent transition-colors"
                    >
                        {/* "LATEST" Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <div className="bg-primary text-black text-[10px] font-tech font-bold tracking-widest px-2 py-1 border border-black shadow-[2px_2px_0_black]">
                                LATEST RELEASE
                            </div>
                        </div>

                        {/* Image Area */}
                        <div className="h-[200px] w-full flex items-center justify-center mb-6 bg-slate-900/50 rounded-sm relative overflow-hidden">
                            {console.image_url ? (
                                <Image
                                    src={console.image_url}
                                    alt={console.name}
                                    width={300}
                                    height={200}
                                    className="max-h-[160px] w-auto h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-slate-700 font-pixel text-4xl">?</span>
                            )}
                            {/* Form Factor Badge */}
                            {console.form_factor && (
                                <div className="absolute top-2 left-2">
                                    <div className="bg-black/90 border border-slate-500 text-slate-300 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase">
                                        {console.form_factor}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Stack */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-mono text-primary uppercase tracking-widest">
                                {console.manufacturer?.name || 'UNKNOWN'}
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors font-pixel leading-tight">
                                {console.name}
                            </h3>
                            <div className="text-lg font-tech tracking-widest text-accent font-bold border-b border-slate-800 pb-4 mb-4">
                                {console.specs?.price_launch_usd ? `$${console.specs.price_launch_usd}` : 'PRICE UNKNOWN'}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <SpecBadge label="CPU" value={console.specs?.cpu_model || console.specs?.cpu_architecture} />
                                <SpecBadge label="SCR" value={console.specs?.screen_size_inch ? `${console.specs.screen_size_inch}"` : null} />
                                <SpecBadge label="OS" value={console.specs?.os} />
                                {(!console.specs?.cpu_model && !console.specs?.screen_size_inch && !console.specs?.os) && (
                                    <span className="text-xs text-slate-600 font-mono italic">AWAITING SPECS...</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

      </section>

    </div>
  );
}
