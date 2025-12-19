import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { createClient } from '../../lib/supabase/server';
import { fetchLatestConsoles } from '../../lib/api/latest';

export default async function LandingPage() {
  const supabase = await createClient();
  // Fetch count of consoles
  const { count } = await supabase.from('consoles').select('*', { count: 'exact', head: true });

  // Fetch latest consoles
  const latestConsoles = await fetchLatestConsoles(3);

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
    // Outer Container: No borders, no padding
    <div className="min-h-screen bg-bg-primary font-mono selection:bg-accent selection:text-white flex flex-col">
      {/*
          NOTE: The parent MainLayout removes padding-top, and DesktopHeader is fixed/sticky above.
      */}

      {/*
          BLOCK 1: Boot Strip
          Replaces old white hero block with technical status bar
      */}
      <div className="w-full bg-bg-primary flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-[14px] md:px-8 md:py-[20px] md:h-[80px] font-mono">

        {/* Left Content */}
        <div className="flex flex-col">
            <h1 className="text-white font-pixel tracking-wider text-[clamp(14px,1.4vw,16px)]">
                RC://RETRO HANDHELD DATABASE
            </h1>
            <p className="text-gray-500 font-mono text-[clamp(12px,1.2vw,14px)] mt-2 md:mt-1">
                Specifications, comparisons, and history of retro gaming handhelds.
            </p>
        </div>

        {/* Right Content: Metadata (Desktop - 4 Columns) */}
        <div className="hidden md:flex flex-row gap-6 text-gray-400 font-tech tracking-wider uppercase text-[clamp(11px,1.1vw,13px)]">

            <div className="flex items-center">
                STATUS: ONLINE
                <span className="w-2 h-2 rounded-full bg-secondary inline-block ml-2 shadow-[0_0_5px_var(--color-secondary)] animate-pulse"></span>
            </div>

            <div>
                INDEXED: {count || 0} SYSTEMS
            </div>

            <div>
                ARCHIVE: v0.1
            </div>

            <div>
                UPDATED: {new Date().toISOString().split('T')[0]}
            </div>

        </div>

        {/* Right Content: Metadata (Mobile - Condensed Single Line) */}
        <div className="flex md:hidden items-center flex-wrap gap-2 mt-2 opacity-80 text-gray-400 font-tech tracking-wider uppercase text-[clamp(11px,1.1vw,13px)]">
             <div className="flex items-center">
                ONLINE
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block ml-1 animate-pulse"></span>
             </div>
             <span>•</span>
             <div>{count || 0} SYSTEMS</div>
             <span>•</span>
             <div>v0.1</div>
             <span>•</span>
             <div>{new Date().toISOString().split('T')[0]}</div>
        </div>

      </div>

      {/*
          BLOCK 2: Marquee Box (Static Ticker)
          Height: 32px (Desktop) / 22px (Mobile), Opacity 80%
      */}
      <div className="h-[22px] md:h-[32px] w-full flex items-center overflow-hidden relative px-4 animate-gradientShift bg-[length:800%_800%]" style={{
          background: 'linear-gradient(270deg, #FF6B9D, #00D9FF, #00FF88, #FF6B9D)',
      }}>
        <div className="whitespace-nowrap overflow-hidden text-ellipsis w-full font-bold text-black text-[10px] md:text-sm tracking-widest">
          /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING
        </div>
      </div>

      {/*
          BLOCK 3: Main Content Grid (Existing Content)
          Wrapped in border (Top merged)
      */}
      <div className="grid grid-cols-1 md:grid-cols-12">

        {/* Left Column (Hero / Database) - 7/12 columns */}
        <div className="col-span-1 md:col-span-7 flex flex-col h-[600px] bg-bg-primary relative p-8 md:p-12">

            {/* Top Content Group */}
            <div>
                <div className="absolute top-4 right-4 text-xs text-gray-500">
                    EST. 2024<br/>ARCHIVE_V1.0
                </div>

                <div className="mt-8">
                    <h2 className="text-7xl md:text-[7rem] font-black text-white leading-[0.85] tracking-tighter mix-blend-difference mb-8">
                        DATA<br/>
                        BASE
                    </h2>
                    <p className="text-xl font-bold text-gray-400 border-l-4 border-accent pl-6 py-2">
                        COMPREHENSIVE SPECIFICATIONS FOR<br/>VIDEO GAME CONSOLES.
                    </p>
                </div>
            </div>

            {/* Bottom/Interactive Content Group */}
            {/* Changed: Flex column to stack Button and Text, items-end to align right */}
            <div className="flex flex-col items-end gap-2 mt-auto">

                <Link href="/console" className="bg-white text-black text-xl font-bold px-6 py-3 flex items-center gap-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black shadow-[8px_8px_0_var(--color-accent)]">
                    <span className="font-tech tracking-widest text-lg">BROWSE DATABASE</span>
                    <ArrowDownLeft size={24} />
                </Link>

                {/* Real Data Count - Text only, right aligned, no icon */}
                <div className="text-sm text-gray-500 font-tech tracking-wider">
                    {count || 0} SYSTEMS INDEXED
                </div>
            </div>
        </div>

        {/* Right Column (Menu Stack) - 5/12 columns */}
        <div className="col-span-1 md:col-span-5 flex flex-col">

            {/* VS MODE */}
            <Link href="/arena" className="h-[200px] bg-bg-primary text-white p-8 flex flex-col justify-between hover:bg-white hover:text-black transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <h3 className="text-4xl font-black tracking-tighter">VS MODE</h3>
                    <span className="font-bold text-xs border border-white px-2 py-1">[COMPARE]</span>
                </div>
                <ArrowUpRight size={48} className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2 group-hover:-translate-y-2" />
            </Link>

            {/* NEWS */}
            <Link href="/news" className="h-[200px] bg-bg-primary text-white p-8 flex flex-col justify-between hover:bg-white hover:text-black transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <h3 className="text-4xl font-black tracking-tighter">NEWS</h3>
                    <span className="font-bold text-xs border border-white px-2 py-1">[READ]</span>
                </div>
            </Link>

            {/* JOIN */}
            <Link href="/login" className="h-[200px] bg-black text-white p-8 flex flex-col justify-center items-center hover:bg-accent hover:text-black transition-colors group text-center">
                <h3 className="text-3xl font-bold tracking-widest group-hover:scale-110 transition-transform">
                    JOIN THE CIRCUIT
                </h3>
            </Link>

        </div>

      </div>

       {/*
          BLOCK 4: New In The Vault (Latest Arrivals)
          Full width row below the main grid.
      */}
      <div className="bg-bg-primary p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
             <div className="w-4 h-4 bg-secondary animate-pulse"></div>
             <h2 className="text-3xl md:text-5xl font-pixel text-white tracking-tight">
                NEW IN THE VAULT_
             </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestConsoles.map((console) => (
                <Link href={`/console/${console.slug}`} key={console.id} className="group flex flex-col bg-black/40 border border-slate-700 hover:border-secondary transition-all p-6 relative">

                    {/* "NEW" Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <div className="bg-accent text-black text-[10px] font-tech font-bold tracking-widest px-2 py-1 border border-black shadow-[2px_2px_0_black]">
                            NEW ENTRY
                        </div>
                    </div>

                    {/* Image Area */}
                    <div className="h-[200px] w-full flex items-center justify-center mb-6 bg-slate-900/50 rounded-sm relative overflow-hidden">
                        {console.image_url ? (
                            <img src={console.image_url} alt={console.name} className="max-h-[160px] object-contain group-hover:scale-110 transition-transform duration-500" />
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

    </div>
  );
}
