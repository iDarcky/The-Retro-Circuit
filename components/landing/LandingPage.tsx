import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { createClient } from '../../lib/supabase/server';
import { fetchLatestConsoles } from '../../lib/api/latest';

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
          BLOCK 3: Main Content Grid
          Hero expanded to full width
      */}
      <div className="grid grid-cols-1 md:grid-cols-12">

        {/* Full Width Hero - 12/12 columns */}
        <div className="col-span-1 md:col-span-12 flex flex-col h-[600px] bg-bg-primary relative p-8 md:p-12">

            {/* Top Row: Label and Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-16">
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

            {/* Main Content Group */}
            <div>
                <div className="mt-8">
                    <h2 className="text-7xl md:text-[7rem] font-black text-white leading-[0.85] tracking-tighter mix-blend-difference mb-8">
                        DATA BASE_
                    </h2>
                    <p className="text-xl font-bold text-gray-400 py-2">
                        Compare retro handhelds across generations.
                    </p>
                </div>
            </div>

            {/* Bottom/Interactive Content Group */}
            {/* Right aligned as requested */}
            <div className="flex flex-col items-end gap-4 mt-auto ml-auto">

                <div className="flex gap-4">
                     <Link href="/arena" className="bg-white text-black text-xl font-bold px-6 py-3 flex items-center gap-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black shadow-[8px_8px_0_var(--color-accent)]">
                        <span className="font-tech tracking-widest text-lg">COMPARE</span>
                        <ArrowUpRight size={24} />
                    </Link>

                    <Link href="/console" className="bg-white text-black text-xl font-bold px-6 py-3 flex items-center gap-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black shadow-[8px_8px_0_var(--color-accent)]">
                        <span className="font-tech tracking-widest text-lg">BROWSE DATABASE</span>
                        <ArrowUpRight size={24} />
                    </Link>
                </div>

            </div>
        </div>

      </div>

       {/*
          BLOCK 4: New In The Vault (Latest Arrivals)
          Apply .vault-section
      */}
      <div className="vault-section m-4 md:m-8">
        <div className="flex items-center gap-4 mb-8">
             <div className="w-4 h-4 bg-secondary animate-pulse"></div>
             <h2 className="text-3xl md:text-5xl font-pixel text-white tracking-tight">
                NEW IN THE VAULT_
             </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestConsoles.map((console) => (
                <Link href={`/console/${console.slug}`} key={console.id} className="group flex flex-col device-card p-6 relative rounded-lg">

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
