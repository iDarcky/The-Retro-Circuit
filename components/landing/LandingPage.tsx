import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { fetchLatestConsoles, fetchRealWorldLatest } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import QuickCompare from './QuickCompare';

export default async function LandingPage() {
  // Fetch latest consoles (Recently Added to DB)
  const latestConsoles = await fetchLatestConsoles(3);

  // Fetch real-world latest (Recently Released Market)
  const upcomingConsoles = await fetchRealWorldLatest(3);

  // Fetch full list for QuickCompare
  const allConsoles = await fetchConsoleList();

  // Helper for badges (reused style)
  const SpecBadge = ({ label, value }: { label: string, value?: string | number | null }) => {
     if (!value) return null;
     return (
        <div className="bg-black/90 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-lg text-gray-400">
             <span className="text-secondary mr-1 font-tech">{label}:</span>{value}
        </div>
     );
  };

  return (
    <div className="bg-bg-primary font-mono selection:bg-accent selection:text-white flex flex-col gap-2.5 px-4 md:px-8 py-4">

      {/* SECTION I: WELCOME */}
      <div className="vault-section p-6 md:p-12 w-full">
        <div className="flex flex-col gap-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-pixel text-white leading-tight drop-shadow-[4px_4px_0_rgba(120,120,120,0.4)]">
            Welcome to the Circuit_
          </h1>

          <div className="flex flex-col gap-4">
            <p className="text-xl md:text-2xl font-bold text-white max-w-2xl leading-relaxed">
              A structured environment for understanding handheld gaming systems.
            </p>
            <p className="text-sm md:text-base font-mono text-gray-400 max-w-3xl leading-relaxed">
              The handheld market is fragmented across variants, revisions, and silent updates. The Retro Circuit organizes that information into a consistent, comparable system.
            </p>
          </div>

          <Link
            href="/about"
            className="text-primary font-mono text-sm hover:text-white transition-colors w-fit"
          >
            [about system]
          </Link>
        </div>
      </div>

      {/* SECTION II: CONSOLE VAULT */}
      <div className="vault-section p-6 md:p-8 w-full flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center gap-4">
           <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-secondary border-b-[8px] border-b-transparent animate-pulse"></div>
           <h2 className="text-2xl md:text-4xl font-pixel text-white tracking-tight">
               CONSOLE VAULT_
           </h2>
        </div>

        {/* Split Layout: Finder vs Quick Compare */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

            {/* Left: Finder */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-primary border-b-[6px] border-b-transparent animate-pulse"></div>
                        <h3 className="text-xl font-pixel text-white tracking-tight">FINDER_</h3>
                    </div>
                    <div className="flex flex-col gap-1 ml-6">
                        <p className="text-white font-mono text-sm font-bold">
                            Not sure which handheld to buy?
                        </p>
                        <p className="text-gray-500 font-mono text-xs">
                            Answer a few questions and we'll narrow it down!
                        </p>
                    </div>
                </div>

                <Link
                  href="/finder"
                  className="w-full bg-primary text-black font-tech font-bold text-lg px-8 py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0_rgba(255,255,255,0.5)] mt-auto"
                >
                    START QUIZ
                    <ArrowUpRight size={20} />
                </Link>
            </div>

            {/* Right: Quick Compare */}
            <div className="flex flex-col gap-6">
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-accent border-b-[6px] border-b-transparent animate-pulse"></div>
                        <h3 className="text-xl font-pixel text-white tracking-tight">QUICK COMPARE_</h3>
                    </div>
                    <p className="text-xs text-gray-500 font-mono ml-6">
                        Select two devices to view a head-to-head performance analysis.
                    </p>
                </div>

                <div className="flex-grow">
                   <QuickCompare consoles={allConsoles} />
                </div>
            </div>

        </div>

        {/* Footer: Navigation Buttons */}
        <div className="mt-4 pt-8 border-t border-gray-800">
             <div className="flex flex-col md:flex-row gap-6 justify-center">
                 {/* Browse Fabricators */}
                 <Link href="/fabricators" className="w-full md:w-auto bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-white text-lg font-bold px-8 py-4 flex items-center justify-center gap-3 transition-all">
                    <span className="font-tech tracking-widest">BROWSE FABRICATORS</span>
                    <ArrowUpRight size={20} />
                </Link>

                {/* Browse Consoles */}
                <Link href="/consoles" className="w-full md:w-auto bg-white text-black text-lg font-bold px-8 py-4 flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black shadow-[8px_8px_0_var(--color-accent)]">
                    <span className="font-tech tracking-widest">BROWSE CONSOLES</span>
                    <ArrowUpRight size={20} />
                </Link>
            </div>
        </div>

      </div>

      {/* SECTION III: NEW IN VAULT */}
      <div className="vault-section p-6 md:p-8 w-full">
        <div className="flex items-center gap-4 mb-8">
             <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-secondary border-b-[8px] border-b-transparent animate-pulse"></div>

             {/* Pixel Header */}
             <div className="flex flex-col">
                 <h2 className="text-xl md:text-2xl font-pixel text-white tracking-tight">
                    NEW IN THE VAULT_
                 </h2>
                 <p className="text-sm text-gray-500 font-mono tracking-wide">
                    Recently added or updated systems
                 </p>
             </div>
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

                        {/* Form Factor Badge (Top Left of Image) */}
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
                        {/* Manufacturer */}
                        <span className="text-xs font-mono text-primary uppercase tracking-widest">
                            {console.manufacturer?.name || 'UNKNOWN'}
                        </span>

                        {/* Name */}
                        <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors font-pixel leading-tight">
                            {console.name}
                        </h3>

                        {/* Price */}
                        <div className="text-lg font-tech tracking-widest text-accent font-bold border-b border-slate-800 pb-4 mb-4">
                            {console.specs?.price_launch_usd ? `$${console.specs.price_launch_usd}` : 'PRICE UNKNOWN'}
                        </div>

                        {/* Specs Stack */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {/* CPU */}
                            <SpecBadge label="CPU" value={console.specs?.cpu_model || console.specs?.cpu_architecture} />

                            {/* Screen */}
                            <SpecBadge label="SCR" value={console.specs?.screen_size_inch ? `${console.specs.screen_size_inch}"` : null} />

                            {/* OS */}
                            <SpecBadge label="OS" value={console.specs?.os} />

                             {/* Fallback if no specs */}
                             {(!console.specs?.cpu_model && !console.specs?.screen_size_inch && !console.specs?.os) && (
                                <span className="text-xs text-slate-600 font-mono italic">AWAITING SPECS...</span>
                             )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>

      {/* SECTION III: NEW RELEASES */}
      <div className="vault-section p-6 md:p-8 w-full">
        <div className="flex items-center gap-4 mb-8">
             <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-accent border-b-[8px] border-b-transparent animate-pulse"></div>

             {/* Pixel Header */}
             <div className="flex flex-col">
                 <h2 className="text-xl md:text-2xl font-pixel text-white tracking-tight">
                    NEW & UPCOMING RELEASES_
                 </h2>
                 <p className="text-sm text-gray-500 font-mono tracking-wide">
                    The latest hardware hitting the market
                 </p>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingConsoles.map((console) => (
                <Link
                    href={`/consoles/${console.slug}`}
                    key={console.id}
                    className="group flex flex-col device-card p-6 relative rounded-lg hover:border-accent transition-colors"
                >

                    {/* "NEW" Badge */}
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

                         {/* Form Factor Badge (Top Left of Image) */}
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
                        {/* Manufacturer */}
                        <span className="text-xs font-mono text-primary uppercase tracking-widest">
                            {console.manufacturer?.name || 'UNKNOWN'}
                        </span>

                        {/* Name */}
                        <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors font-pixel leading-tight">
                            {console.name}
                        </h3>

                         {/* Price */}
                         <div className="text-lg font-tech tracking-widest text-accent font-bold border-b border-slate-800 pb-4 mb-4">
                            {console.specs?.price_launch_usd ? `$${console.specs.price_launch_usd}` : 'PRICE UNKNOWN'}
                        </div>

                        {/* Specs Stack */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {/* CPU */}
                            <SpecBadge label="CPU" value={console.specs?.cpu_model || console.specs?.cpu_architecture} />

                            {/* Screen */}
                            <SpecBadge label="SCR" value={console.specs?.screen_size_inch ? `${console.specs.screen_size_inch}"` : null} />

                            {/* OS */}
                            <SpecBadge label="OS" value={console.specs?.os} />

                             {/* Fallback if no specs */}
                             {(!console.specs?.cpu_model && !console.specs?.screen_size_inch && !console.specs?.os) && (
                                <span className="text-xs text-slate-600 font-mono italic">AWAITING SPECS...</span>
                             )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>

    </div>
  );
}
