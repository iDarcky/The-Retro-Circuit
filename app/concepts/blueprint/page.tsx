
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Ruler, Grid, Crosshair, ChevronRight } from 'lucide-react';

export default async function BlueprintConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#0044bb] text-white font-mono overflow-x-hidden selection:bg-white selection:text-[#0044bb]">
      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
      <div className="fixed inset-0 pointer-events-none border-[20px] border-[#003399]/50 z-50"></div>

      <nav className="relative z-10 border-b border-white/20 p-4 flex justify-between items-center bg-[#0044bb]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
           <Grid size={18} />
           <span className="font-bold tracking-tighter">RC_SCHEMATIC_VIEWER</span>
        </div>
        <div className="text-xs opacity-60">
           SCALE: 1:1
        </div>
      </nav>

      <main className="relative z-10 p-8 max-w-7xl mx-auto">

        {/* HERO / FINDER */}
        <section className="mb-24 border border-white/30 p-8 md:p-16 relative">
           <div className="absolute -top-3 -left-3 bg-[#0044bb] px-2 text-xs font-bold border border-white/30">FIG 1.0</div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                 <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter uppercase">
                    Technical<br/>Specification<br/>Finder
                 </h1>
                 <p className="text-blue-200 mb-8 max-w-md text-sm leading-relaxed">
                    INPUT PARAMETERS TO ISOLATE HARDWARE CONFIGURATIONS MATCHING DESIRED PERFORMANCE METRICS.
                 </p>
                 <Link href="/finder" className="inline-block border-2 border-white px-8 py-3 text-sm font-bold hover:bg-white hover:text-[#0044bb] transition-colors uppercase">
                    [ Initialize Search ]
                 </Link>
              </div>
              <div className="border border-dashed border-white/20 h-64 flex items-center justify-center relative">
                  <Ruler className="absolute top-4 right-4 opacity-50" />
                  <Crosshair className="absolute bottom-4 left-4 opacity-50" />

                  {/* Decorative lines */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-white/10"></div>
                  <div className="absolute left-1/2 top-0 h-full w-px bg-white/10"></div>

                  <div className="text-center opacity-70">
                     <div className="text-6xl font-thin mb-2">?</div>
                     <span className="text-xs">AWAITING DIMENSIONS</span>
                  </div>
              </div>
           </div>

           {/* Measurements */}
           <div className="absolute -right-4 top-1/2 h-32 border-r border-white/50 w-4 flex items-center justify-center">
              <span className="rotate-90 text-[10px] whitespace-nowrap">Y-AXIS</span>
           </div>
        </section>

        {/* VS MODE */}
        <section className="mb-24">
           <div className="flex items-center gap-4 mb-6 opacity-70">
              <span className="w-8 h-px bg-white"></span>
              <h2 className="text-xl font-bold uppercase">Comparator Module</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-11 gap-4">
              <div className="col-span-5 border border-white/20 h-48 bg-[#003399]/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-[#003399]/50 transition-colors">
                 <span className="text-xs mb-2 opacity-50">COMPONENT A</span>
                 <span className="text-2xl font-bold border-b border-white/20 pb-1">SELECT</span>
              </div>

              <div className="col-span-1 flex items-center justify-center">
                 <div className="w-px h-full bg-white/20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0044bb] border border-white p-2 text-xs font-bold">VS</div>
                 </div>
              </div>

              <div className="col-span-5 border border-white/20 h-48 bg-[#003399]/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-[#003399]/50 transition-colors">
                 <span className="text-xs mb-2 opacity-50">COMPONENT B</span>
                 <span className="text-2xl font-bold border-b border-white/20 pb-1">SELECT</span>
              </div>
           </div>
        </section>

        {/* RECENT OUTPUT (Released) */}
        <section className="mb-24">
           <h2 className="text-xl font-bold uppercase mb-8 flex items-center gap-2">
             <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
             Recent Fabrication Output
           </h2>

           <div className="space-y-4">
              {realWorldLatest.map((c) => (
                 <div key={c.id} className="border border-white/20 p-4 flex flex-col md:flex-row items-center gap-8 hover:bg-white/5 transition-colors">
                    <div className="w-24 h-24 bg-black/20 border border-white/10 flex items-center justify-center shrink-0">
                       {c.image_url ? (
                          <Image src={c.image_url} alt={c.name} width={80} height={80} className="object-contain invert brightness-0 opacity-70" />
                       ) : <span className="text-xs">IMG_MISSING</span>}
                    </div>

                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                       <div>
                          <span className="block opacity-50 mb-1">UNIT_NAME</span>
                          <span className="font-bold text-sm">{c.name}</span>
                       </div>
                       <div>
                          <span className="block opacity-50 mb-1">ORIGIN</span>
                          <span>{c.manufacturer?.name}</span>
                       </div>
                       <div>
                          <span className="block opacity-50 mb-1">DATE</span>
                          <span>{c.release_year || 'PENDING'}</span>
                       </div>
                       <div>
                          <span className="block opacity-50 mb-1">SPEC_CPU</span>
                          <span>{c.specs?.cpu_model || 'N/A'}</span>
                       </div>
                    </div>

                    <Link href={`/consoles/${c.slug}`} className="shrink-0 border border-white/50 p-2 hover:bg-white hover:text-[#0044bb]">
                       <ChevronRight />
                    </Link>
                 </div>
              ))}
           </div>
        </section>

         {/* LATEST LOGS (DB) */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/20 pt-12">
            <div>
               <h3 className="font-bold mb-4 uppercase text-sm">Database Append Logs</h3>
               <ul className="space-y-2 text-xs font-mono">
                  {dbLatest.map((c) => (
                     <li key={c.id} className="flex gap-4 opacity-70 hover:opacity-100">
                        <span>[LOG_{c.id.substring(0,4)}]</span>
                        <span>{c.name}</span>
                        <span className="ml-auto">OK</span>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="flex items-center justify-center border border-white/10 bg-[#003399]/20 p-8 text-center">
               <div>
                  <h3 className="font-bold text-xl mb-2">FULL SCHEMATICS</h3>
                  <p className="text-xs opacity-70 mb-6 max-w-xs mx-auto">Access the complete library of hardware specifications and detailed blueprints.</p>
                  <Link href="/consoles" className="bg-white text-[#0044bb] px-6 py-2 text-xs font-bold uppercase hover:bg-blue-100">
                     Access Library
                  </Link>
               </div>
            </div>
         </section>

      </main>
    </div>
  );
}
