import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { createClient } from '../../lib/supabase/server';
import { fetchLatestConsoles } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import QuickCompare from './QuickCompare';

export default async function LandingPage() {
  const supabase = await createClient();

  // Fetch count of consoles (with error handling for missing DB connection)
  let count = 0;
  try {
      const { count: dbCount, error } = await supabase.from('consoles').select('*', { count: 'exact', head: true });
      if (!error && dbCount !== null) {
          count = dbCount;
      }
  } catch (e) {
      console.error('Failed to fetch console count:', e);
  }

  // Fetch latest consoles
  const latestConsoles = await fetchLatestConsoles(3);

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
    // Outer Container: No borders, no padding
    <div className="min-h-screen bg-bg-primary font-mono selection:bg-accent selection:text-white flex flex-col">
      {/*
          NOTE: The parent MainLayout removes padding-top, and DesktopHeader is fixed/sticky above.
      */}

      {/*
          BLOCK: Hero Header Metadata
          Moved outside the box as per requirement.
      */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-8 mt-4 md:mt-8 mb-4">
           {/* Left: Label */}
           <div className="text-sm font-bold text-gray-500 font-mono tracking-widest uppercase">
              RC://RETRO_CIRCUIT
           </div>

           {/* Right: Metadata Stats */}
           <div className="flex flex-row gap-6 text-gray-500 font-tech tracking-wider uppercase text-[12px] font-bold mt-2 md:mt-0">
              <div className="flex items-center">
                  STATUS: ONLINE
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
      </div>

      {/*
          BLOCK: Hero Grid Split
          Left: Text + Buttons
          Right: Quick Compare
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-8 min-h-[600px]">

          {/* Left Column (8 cols) - Console Vault Hero */}
          <div className="col-span-1 md:col-span-8 vault-section relative p-6 md:p-12 flex flex-col">

              <div className="flex items-start gap-6">
                  {/* Pink Triangle Marker (Breathing) */}
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-accent border-b-[12px] border-b-transparent mt-4 md:mt-6 shrink-0 animate-pulse"></div>

                  <div>
                      <h2 className="text-6xl md:text-[6rem] font-black text-white leading-[0.85] tracking-tighter mix-blend-difference mb-6">
                          CONSOLE<br/>VAULT_
                      </h2>
                      <p className="text-lg md:text-xl font-bold text-gray-400 max-w-2xl leading-relaxed border-l-4 border-gray-700 pl-6">
                          Find and compare your favorite handhelds...
                      </p>
                  </div>
              </div>

              <div className="mt-16 md:mt-24 ml-0 md:ml-10">
                   <p className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">
                       Start by browsing all consoles or manufacturers
                   </p>
                   <div className="flex flex-col md:flex-row gap-6">
                       {/* Browse Fabricators (Faded) */}
                       <Link href="/fabricators" className="bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-white text-lg font-bold px-8 py-4 flex items-center justify-center gap-3 transition-all">
                          <span className="font-tech tracking-widest">BROWSE FABRICATORS</span>
                          <ArrowUpRight size={20} />
                      </Link>

                      {/* Browse Consoles (Primary) */}
                      <Link href="/console" className="bg-white text-black text-lg font-bold px-8 py-4 flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black shadow-[8px_8px_0_var(--color-accent)]">
                          <span className="font-tech tracking-widest">BROWSE CONSOLES</span>
                          <ArrowUpRight size={20} />
                      </Link>
                  </div>
              </div>
          </div>

          {/* Right Column (4 cols) - Quick Compare */}
          <div className="col-span-1 md:col-span-4 vault-section p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                       {/* Blue Triangle (Breathing) */}
                       <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-primary border-b-[8px] border-b-transparent animate-pulse"></div>
                       <h3 className="text-xl font-bold text-white font-mono tracking-tight">QUICK COMPARE_</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-mono ml-7 border-l-4 border-gray-700 pl-4 py-1">
                      Select two devices to view a head-to-head performance analysis.
                  </p>
              </div>

              <div className="flex-grow">
                 <QuickCompare consoles={allConsoles} />
              </div>
          </div>

      </div>

       {/*
          BLOCK: New In The Vault
          10px gap from hero as requested (mt-2.5 is 10px)
      */}
      <div className="vault-section mx-4 md:mx-8 mt-2.5 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
             {/* Green Triangle (Breathing) */}
             <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-secondary border-b-[8px] border-b-transparent animate-pulse"></div>

             {/* JetBrains Mono Header */}
             <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
                NEW IN THE VAULT_
             </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestConsoles.map((console) => (
                <Link
                    href={`/console/${console.slug}`}
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
