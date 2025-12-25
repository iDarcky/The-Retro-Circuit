
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default async function IndustrialConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e5e5e5] font-sans selection:bg-white selection:text-black">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")' }}></div>

      <nav className="p-8 md:p-12 flex justify-between items-start border-b border-[#333]">
         <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.8] tracking-tighter">
               Retro<br/>Circuit
            </h1>
            <span className="text-[10px] font-mono mt-2 text-[#666]">EST. 2024 // HEAVY INDUSTRY DIV.</span>
         </div>
         <div className="w-4 h-4 bg-[#ff3300]"></div>
      </nav>

      <main>

         {/* HERO / FINDER */}
         <section className="grid grid-cols-1 md:grid-cols-2 min-h-[60vh] border-b border-[#333]">
            <div className="border-r border-[#333] p-8 md:p-12 flex flex-col justify-between">
               <div>
                  <h2 className="text-xl font-bold uppercase mb-4 text-[#666]">01 // Identification</h2>
                  <p className="text-2xl md:text-3xl font-medium leading-tight max-w-sm">
                     Locate hardware specifications matching operational parameters.
                  </p>
               </div>
               <Link href="/finder" className="group flex items-center gap-4 text-xl font-bold uppercase mt-12 hover:text-[#ff3300] transition-colors">
                  Initialize Sequence <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Link>
            </div>
            <div className="bg-[#222] relative overflow-hidden flex items-center justify-center p-8">
               <h2 className="text-[15vw] font-black text-[#1f1f1f] absolute select-none">FIND</h2>
               <div className="relative z-10 w-64 h-64 border-4 border-[#333] rotate-45 flex items-center justify-center">
                  <div className="w-32 h-32 bg-[#ff3300]"></div>
               </div>
            </div>
         </section>

         {/* LATEST RELEASED (Horizontal Scroll) */}
         <section className="border-b border-[#333]">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#222]">
               <span className="font-mono text-xs uppercase text-[#666]">02 // Fabrication Output</span>
               <span className="font-mono text-xs text-[#666]">SCROLL &rarr;</span>
            </div>
            <div className="flex overflow-x-auto divide-x divide-[#333]">
               {realWorldLatest.map((c, i) => (
                  <div key={c.id} className="min-w-[300px] md:min-w-[400px] p-8 md:p-12 hover:bg-[#222] transition-colors group">
                     <span className="font-mono text-xs text-[#666] mb-8 block">UNIT {i+1}</span>
                     <div className="h-40 mb-8 grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100 flex items-center">
                         {c.image_url ? (
                            <Image src={c.image_url} alt={c.name} width={200} height={150} className="object-contain" />
                         ) : <div className="w-20 h-20 bg-[#333]"></div>}
                     </div>
                     <h3 className="text-3xl font-black uppercase leading-none mb-2">{c.name}</h3>
                     <p className="font-mono text-xs text-[#666]">{c.manufacturer?.name}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE + DATABASE SPLIT */}
         <section className="grid grid-cols-1 md:grid-cols-2">

            {/* VS MODE */}
            <div className="border-r border-[#333] p-8 md:p-12 flex flex-col justify-center bg-[#e5e5e5] text-black">
               <h2 className="text-6xl font-black mb-8">VS</h2>
               <p className="font-mono text-sm mb-8 max-w-xs">
                  COMPARE TECHNICAL SPECIFICATIONS OF TWO UNITS.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 border-2 border-black flex items-center justify-center font-bold text-xl hover:bg-black hover:text-white transition-colors cursor-pointer">
                     INPUT A
                  </div>
                  <div className="h-32 border-2 border-black flex items-center justify-center font-bold text-xl hover:bg-black hover:text-white transition-colors cursor-pointer">
                     INPUT B
                  </div>
               </div>
            </div>

            {/* DATABASE LIST */}
            <div className="p-8 md:p-12">
               <h2 className="text-xl font-bold uppercase mb-8 text-[#666]">03 // Archive Log</h2>
               <ul className="space-y-4 font-mono text-sm">
                  {dbLatest.map((c) => (
                     <li key={c.id} className="flex justify-between border-b border-[#333] pb-2 hover:pl-2 transition-all cursor-default">
                        <span>{c.name}</span>
                        <span className="text-[#666]">{c.release_year}</span>
                     </li>
                  ))}
               </ul>
               <Link href="/consoles" className="inline-block mt-12 bg-[#333] text-white px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">
                  Access Full Database
               </Link>
            </div>

         </section>
      </main>

      <footer className="bg-black text-[#333] p-8 md:p-12 font-mono text-[10px] flex justify-between">
         <span>RC_IND_V1</span>
         <span>SYSTEM STATUS: NORMAL</span>
      </footer>
    </div>
  );
}
