
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';

export default async function EightBitConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#202020] text-white font-pixel selection:bg-[#cc0000] selection:text-white image-pixelated">

      {/* HEADER */}
      <header className="bg-[#cc0000] border-b-4 border-black p-4 sticky top-0 z-50 shadow-[0_4px_0_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
           <h1 className="text-xl md:text-2xl drop-shadow-[2px_2px_0_#000]">RETRO_CIRCUIT</h1>
           <div className="flex gap-4 text-xs md:text-sm">
              <span className="cursor-pointer hover:underline">START</span>
              <span className="cursor-pointer hover:underline">SELECT</span>
           </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-16">

         {/* HERO / FINDER */}
         <section className="bg-blue-600 border-4 border-white p-8 md:p-12 text-center shadow-[8px_8px_0_black] relative">
            <div className="absolute top-0 left-0 p-2 text-xs">WORLD 1-1</div>
            <h2 className="text-3xl md:text-5xl mb-8 leading-relaxed drop-shadow-[4px_4px_0_black]">
               IT'S DANGEROUS TO GO ALONE!
            </h2>
            <p className="text-sm md:text-base mb-8 max-w-lg mx-auto leading-loose">
               TAKE THIS FINDER TOOL WITH YOU TO CHOOSE YOUR DESTINY.
            </p>
            <Link href="/finder" className="inline-block bg-white text-black text-xl px-8 py-4 border-4 border-black hover:bg-[#ffcc00] transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none">
               PRESS START
            </Link>
         </section>

         {/* VS MODE */}
         <section>
            <div className="flex items-center justify-center gap-4 mb-8">
               <div className="h-1 bg-white flex-grow"></div>
               <h3 className="text-xl text-[#ffcc00]">VS MODE</h3>
               <div className="h-1 bg-white flex-grow"></div>
            </div>

            <div className="bg-black border-4 border-white p-2 grid grid-cols-2 gap-2">
               <div className="bg-[#444] h-40 flex items-center justify-center border-2 border-dashed border-[#888] hover:bg-[#555] cursor-pointer">
                  <span className="text-4xl text-[#888]">?</span>
               </div>
               <div className="bg-[#444] h-40 flex items-center justify-center border-2 border-dashed border-[#888] hover:bg-[#555] cursor-pointer">
                  <span className="text-4xl text-[#888]">?</span>
               </div>
            </div>
            <div className="text-center mt-4 text-xs text-gray-400">SELECT PLAYER 1 AND PLAYER 2</div>
         </section>

         {/* LATEST RELEASED */}
         <section>
             <h3 className="text-xl text-[#00cc00] mb-8 text-center">&gt; NEW CHALLENGERS</h3>
             <div className="space-y-4">
                {realWorldLatest.map((c) => (
                   <div key={c.id} className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0_#888] flex items-center gap-4">
                       <div className="w-16 h-16 bg-gray-200 border-2 border-black shrink-0 flex items-center justify-center">
                          {c.image_url ? (
                             <Image src={c.image_url} alt={c.name} width={40} height={40} className="object-contain" />
                          ) : <div className="w-4 h-4 bg-black"></div>}
                       </div>
                       <div>
                          <h4 className="font-bold text-sm md:text-base">{c.name.toUpperCase()}</h4>
                          <div className="text-[10px] mt-1 bg-black text-white inline-block px-1">
                             LVL {c.release_year || '??'}
                          </div>
                       </div>
                   </div>
                ))}
             </div>
         </section>

         {/* LATEST ADDED */}
         <section className="bg-[#000088] border-4 border-white p-6 text-white text-xs md:text-sm leading-loose shadow-[8px_8px_0_black]">
             <h3 className="text-center mb-6 text-[#00ccff]">HIGH SCORES (DB)</h3>
             <ul className="space-y-2">
                {dbLatest.map((c) => (
                   <li key={c.id} className="flex justify-between border-b border-blue-800 pb-1">
                      <span>{c.name.toUpperCase()}</span>
                      <span>{Math.floor(Math.random() * 50000)} PTS</span>
                   </li>
                ))}
             </ul>
             <div className="text-center mt-8">
                <Link href="/consoles" className="animate-pulse text-[#ffcc00] hover:underline">
                   VIEW ALL RECORDS
                </Link>
             </div>
         </section>

      </main>

      <footer className="bg-[#111] text-gray-500 text-center py-8 text-[10px]">
         (C) 198X THE RETRO CIRCUIT CO. LTD.
      </footer>
    </div>
  );
}
