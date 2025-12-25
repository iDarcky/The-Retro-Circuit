
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Skull, Crosshair, Star } from 'lucide-react';

export default async function CowboyConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#dccfb4] text-[#4a3b2a] font-serif selection:bg-[#8b4513] selection:text-[#dccfb4]">

      {/* TEXTURE OVERLAY (Grain) */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}></div>

      {/* HEADER */}
      <nav className="relative z-10 border-b-4 border-[#4a3b2a] py-6 px-8 flex flex-col md:flex-row justify-between items-center bg-[#c2b280]">
         <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Star className="text-[#8b4513] fill-[#8b4513]" size={32} />
            <h1 className="text-4xl font-bold tracking-widest uppercase" style={{ fontFamily: 'serif' }}>
               THE RETRO SALOON
            </h1>
            <Star className="text-[#8b4513] fill-[#8b4513]" size={32} />
         </div>
         <div className="font-bold tracking-widest text-sm border-2 border-[#4a3b2a] px-4 py-1 rounded-sm">
            EST. 1885
         </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto p-8">

         {/* HERO / FINDER (Wanted Poster) */}
         <section className="mb-20 flex justify-center">
            <div className="bg-[#f0e6d2] p-8 md:p-12 shadow-[10px_10px_0_rgba(0,0,0,0.2)] border-4 border-[#4a3b2a] max-w-2xl text-center transform rotate-1 relative">
               {/* Nail */}
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#2a2a2a] shadow-sm"></div>

               <h2 className="text-6xl md:text-8xl font-black mb-4 uppercase leading-none border-b-4 border-[#4a3b2a] pb-4">
                  WANTED
               </h2>
               <p className="text-xl md:text-2xl font-bold mb-8 uppercase tracking-widest">
                  FOR A GOOD TIME
               </p>

               <div className="border-4 border-[#4a3b2a] p-2 mb-8 bg-[#dccfb4] h-64 flex items-center justify-center">
                  <span className="text-6xl font-bold opacity-20">?</span>
               </div>

               <p className="text-lg font-medium mb-8 leading-relaxed">
                  Are you lookin' for the perfect handheld partner? <br/>
                  Don't wander the desert alone.
               </p>

               <Link href="/finder" className="inline-flex items-center gap-3 bg-[#8b4513] text-[#dccfb4] text-xl font-bold px-8 py-4 border-2 border-[#4a3b2a] hover:bg-[#4a3b2a] transition-colors shadow-lg uppercase tracking-widest">
                  <Search size={24} /> Start The Hunt
               </Link>
            </div>
         </section>

         {/* VS MODE (High Noon) */}
         <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-8">
               <div className="h-1 bg-[#4a3b2a] flex-grow"></div>
               <h3 className="text-3xl font-bold uppercase tracking-widest">High Noon Duel</h3>
               <div className="h-1 bg-[#4a3b2a] flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#c2b280] p-8 border-4 border-double border-[#4a3b2a]">
               <div className="flex flex-col items-center">
                  <div className="w-48 h-64 border-4 border-[#4a3b2a] bg-[#dccfb4] flex items-center justify-center mb-4 relative">
                     <span className="absolute -top-4 bg-[#4a3b2a] text-[#dccfb4] px-4 py-1 font-bold text-xs uppercase">Challenger 1</span>
                     <Skull size={48} className="opacity-20" />
                  </div>
                  <button className="font-bold uppercase border-b-2 border-[#4a3b2a] hover:text-[#8b4513]">Pick Gunslinger</button>
               </div>

               <div className="hidden md:flex items-center justify-center">
                  <div className="text-6xl font-black text-[#8b4513]">VS</div>
               </div>

               <div className="flex flex-col items-center md:hidden">
                  <div className="text-4xl font-black text-[#8b4513] my-4">VS</div>
               </div>

               <div className="flex flex-col items-center">
                  <div className="w-48 h-64 border-4 border-[#4a3b2a] bg-[#dccfb4] flex items-center justify-center mb-4 relative">
                     <span className="absolute -top-4 bg-[#4a3b2a] text-[#dccfb4] px-4 py-1 font-bold text-xs uppercase">Challenger 2</span>
                     <Crosshair size={48} className="opacity-20" />
                  </div>
                  <button className="font-bold uppercase border-b-2 border-[#4a3b2a] hover:text-[#8b4513]">Pick Gunslinger</button>
               </div>
            </div>
         </section>

         {/* LATEST RELEASED (Fresh from the East) */}
         <section className="mb-20">
            <h3 className="text-3xl font-bold uppercase mb-8 border-b-4 border-[#4a3b2a] inline-block pb-2">
               Fresh from the East
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="bg-[#f0e6d2] border-2 border-[#4a3b2a] p-4 shadow-[5px_5px_0_#4a3b2a]">
                     <div className="bg-[#dccfb4] border border-[#4a3b2a] h-40 mb-4 flex items-center justify-center p-4">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={150} height={120} className="object-contain sepia-[.5]" />
                        ) : <span className="font-bold opacity-30">NO IMAGE</span>}
                     </div>
                     <h4 className="text-xl font-black uppercase mb-1">{c.name}</h4>
                     <p className="text-sm font-bold opacity-70 mb-4">{c.manufacturer?.name}</p>
                     <div className="flex justify-between items-center border-t border-[#4a3b2a] pt-2">
                        <span className="font-bold text-xs">YEAR: {c.release_year}</span>
                        <span className="bg-[#8b4513] text-[#dccfb4] text-xs px-2 py-1 font-bold rounded-sm">NEW</span>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* LATEST ADDED (Ledger) */}
         <section className="bg-[#fdfbf7] p-8 border-4 border-[#4a3b2a] shadow-inner">
            <h3 className="text-2xl font-bold uppercase mb-6 text-center underline decoration-wavy decoration-[#8b4513]">
               Town Ledger (Recent Arrivals)
            </h3>
            <ul className="space-y-4 font-mono text-sm">
               {dbLatest.map((c, i) => (
                  <li key={c.id} className="flex justify-between border-b border-dashed border-[#4a3b2a] pb-1 items-end">
                     <span>{i+1}. {c.name.toUpperCase()}</span>
                     <span className="opacity-50">....... CHECKED IN</span>
                  </li>
               ))}
            </ul>
            <div className="text-center mt-8">
               <Link href="/consoles" className="font-bold uppercase text-lg hover:text-[#8b4513] border-b-2 border-transparent hover:border-[#8b4513] transition-all">
                  See Full Records &rarr;
               </Link>
            </div>
         </section>

      </main>

      <footer className="bg-[#4a3b2a] text-[#dccfb4] p-12 text-center">
         <p className="font-serif italic text-lg opacity-80">
            "The finest hardware this side of the Mississippi."
         </p>
         <p className="text-xs mt-4 opacity-50 uppercase tracking-widest">
            Retro Circuit Trading Co.
         </p>
      </footer>
    </div>
  );
}
