
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Headphones, Play, Pause, SkipForward } from 'lucide-react';

export default async function AudioConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#333] text-white font-sans selection:bg-[#ff6600] selection:text-white max-w-md mx-auto border-x border-[#444] shadow-2xl">

      {/* HEADER */}
      <nav className="bg-[#222] p-4 flex justify-between items-center border-b border-[#444] sticky top-0 z-50">
         <div className="flex items-center gap-2">
            <Headphones className="text-[#ff6600]" />
            <span className="font-bold text-sm tracking-wide">RetroGuide Audio</span>
         </div>
         <div className="text-xs bg-[#444] px-2 py-1 rounded">
            STOP 42
         </div>
      </nav>

      <main className="pb-24">

         {/* HERO / FINDER */}
         <section className="p-6 text-center border-b border-[#444]">
            <div className="w-24 h-24 bg-[#444] rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#555]">
               <span className="text-3xl font-bold text-[#888]">?</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Self-Guided Tour</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
               Welcome to the Handheld History exhibit. Press play to begin the interactive finder experience.
            </p>
            <Link href="/finder" className="block w-full bg-[#ff6600] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#ff8533] transition-colors shadow-lg">
               <Play className="inline mr-2 fill-white" size={18} /> Start Tour
            </Link>
         </section>

         {/* LATEST RELEASED (New Exhibits) */}
         <section className="p-6">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">New Installations</h3>

            <div className="space-y-6">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="bg-[#444] rounded-lg p-4 flex gap-4 items-center">
                     <div className="w-16 h-16 bg-[#222] rounded flex items-center justify-center shrink-0">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={50} height={50} className="object-contain" />
                        ) : <span className="text-xs text-gray-600">Img</span>}
                     </div>
                     <div className="flex-grow">
                        <h4 className="font-bold text-sm mb-1">{c.name}</h4>
                        <div className="h-1 bg-[#222] rounded-full w-full overflow-hidden">
                           <div className="h-full bg-[#ff6600] w-1/3"></div>
                        </div>
                     </div>
                     <button className="text-[#ff6600]"><Play size={24} fill="#ff6600" /></button>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE (Compare Tracks) */}
         <section className="p-6 border-t border-[#444]">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">Compare Exhibits</h3>
            <div className="flex gap-2">
               <div className="flex-1 bg-[#222] rounded p-4 text-center text-sm text-gray-400 border border-[#444]">
                  Object A
               </div>
               <div className="flex-1 bg-[#222] rounded p-4 text-center text-sm text-gray-400 border border-[#444]">
                  Object B
               </div>
            </div>
         </section>

         {/* LATEST ADDED (Archive) */}
         <section className="p-6 pb-12">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">Collection Database</h3>
            <ul className="divide-y divide-[#444]">
               {dbLatest.map((c) => (
                  <li key={c.id} className="py-3 flex justify-between items-center text-sm">
                     <span>{c.name}</span>
                     <span className="text-gray-500 text-xs">{c.id.substring(0,3)}</span>
                  </li>
               ))}
            </ul>
            <Link href="/consoles" className="block text-center mt-6 text-[#ff6600] text-sm font-bold">
               View Full Collection
            </Link>
         </section>

      </main>

      {/* PLAYER BAR */}
      <div className="fixed bottom-0 max-w-md w-full bg-[#222] border-t border-[#444] p-4 flex justify-between items-center">
         <div className="text-xs">
            <span className="block text-gray-400">Now Viewing</span>
            <span className="font-bold">Main Hall</span>
         </div>
         <div className="flex gap-6 text-white">
            <SkipForward className="rotate-180" size={24} />
            <Pause size={24} fill="white" />
            <SkipForward size={24} />
         </div>
      </div>
    </div>
  );
}
