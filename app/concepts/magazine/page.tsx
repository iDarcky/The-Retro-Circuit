
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Zap, MessageSquare, Flame } from 'lucide-react';

export default async function MagazineConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(4),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black font-sans overflow-x-hidden selection:bg-[#ff0099] selection:text-white">
       {/* Background noise/texture */}
       <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

       {/* HEADER */}
       <header className="bg-[#ff0033] text-white p-4 border-b-4 border-black sticky top-0 z-50 shadow-[0_4px_0_rgba(0,0,0,0.2)] transform -rotate-1">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
             <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase transform rotate-1 drop-shadow-[4px_4px_0_#000]">
                RETRO<span className="text-[#ffee00]">MAG</span>
             </h1>
             <div className="hidden md:flex gap-4 font-bold text-lg italic">
                <span className="bg-black px-2 transform -rotate-2">ISSUES</span>
                <span className="bg-[#0033cc] px-2 transform rotate-2">REVIEWS</span>
                <span className="bg-[#ffcc00] text-black px-2 transform -rotate-1">CHEATS</span>
             </div>
          </div>
       </header>

       <main className="max-w-6xl mx-auto p-4 md:p-8">

          {/* HERO / FINDER */}
          <section className="bg-[#ffcc00] p-8 md:p-12 mb-16 border-4 border-black shadow-[12px_12px_0_#000] relative transform rotate-1">
             <div className="absolute -top-6 -right-6 bg-[#00ccff] text-white w-24 h-24 rounded-full flex items-center justify-center font-black text-center text-sm border-4 border-black animate-bounce z-10 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                FREE<br/>GUIDE!
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                   <h2 className="text-5xl md:text-7xl font-black leading-[0.9] mb-6 italic text-white drop-shadow-[4px_4px_0_#000] -rotate-2">
                      WHAT'S YOUR<br/><span className="text-black">PERFECT</span><br/>SYSTEM?
                   </h2>
                   <p className="font-bold text-xl mb-8 leading-tight max-w-md">
                      Don't waste your allowance on trash! Take our radical quiz to find the ULTIMATE handheld for you!
                   </p>
                   <Link href="/finder" className="inline-block bg-[#ff0099] text-white text-2xl font-black italic px-8 py-4 border-4 border-black hover:scale-105 transition-transform shadow-[6px_6px_0_#000]">
                      TAKE THE QUIZ! &gt;&gt;
                   </Link>
                </div>
                <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-black translate-x-4 translate-y-4"></div>
                    <div className="relative bg-white border-4 border-black p-4 h-64 flex items-center justify-center">
                       <span className="text-6xl font-black text-gray-200 rotate-12">???</span>
                    </div>
                </div>
             </div>
          </section>

          {/* VS MODE */}
          <section className="mb-20">
             <div className="bg-black text-white inline-block px-4 py-2 font-black text-2xl italic mb-4 transform -rotate-2">
                HEAD-TO-HEAD
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-8 border-black">
                <div className="bg-[#0033cc] p-12 text-center text-white relative overflow-hidden group hover:bg-[#002299] transition-colors cursor-pointer">
                   <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-20"></div>
                   <h3 className="text-4xl font-black italic relative z-10">CHALLENGER 1</h3>
                   <p className="font-bold relative z-10 mt-2">Pick your fighter!</p>
                </div>

                <div className="bg-[#ff0033] p-12 text-center text-white relative overflow-hidden group hover:bg-[#cc0022] transition-colors cursor-pointer">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-20"></div>
                    <div className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 bg-yellow-400 text-black font-black text-4xl p-4 border-4 border-black z-20 rotate-12 md:rotate-0 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                       VS
                    </div>
                   <h3 className="text-4xl font-black italic relative z-10">CHALLENGER 2</h3>
                   <p className="font-bold relative z-10 mt-2">Who will win?!</p>
                </div>
             </div>
          </section>

          {/* FRESH DROPS */}
          <section className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                 <h2 className="text-5xl font-black italic text-black transform -rotate-1">
                    HOT <span className="text-[#ff0099]">NEW</span> GEAR
                 </h2>
                 <Flame className="text-[#ff0033] animate-pulse" size={48} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {realWorldLatest.map((c, i) => (
                    <div key={c.id} className={`bg-white border-4 border-black p-4 shadow-[8px_8px_0_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-transform ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                       <div className="bg-gray-100 mb-4 h-32 flex items-center justify-center overflow-hidden border-2 border-black">
                          {c.image_url ? (
                             <Image src={c.image_url} alt={c.name} width={150} height={150} className="object-contain hover:scale-110 transition-transform" />
                          ) : <span className="font-black text-2xl text-gray-300">NO PIC</span>}
                       </div>
                       <div className="bg-[#00ccff] text-white text-xs font-bold inline-block px-2 py-1 mb-2 transform -rotate-2 border border-black">
                          RATING: 9/10
                       </div>
                       <h3 className="font-black text-xl leading-tight mb-2 uppercase italic">{c.name}</h3>
                       <p className="text-xs font-bold text-gray-500 line-clamp-2">
                          {c.manufacturer?.name} drops another banger? Read the full specs inside!
                       </p>
                    </div>
                 ))}
              </div>
          </section>

          {/* DATABASE */}
          <section className="bg-black text-[#00ff00] p-8 font-mono border-4 border-gray-500 rounded-xl relative">
             <div className="absolute -top-4 left-8 bg-gray-200 text-black font-bold px-4 py-1 border-2 border-black transform -rotate-2">
                CHEAT CODES & DATABASE
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div>
                   <h3 className="text-xl font-bold mb-4 border-b border-[#00ff00] pb-2">&gt; RECENTLY_DUMPED.LOG</h3>
                   <ul className="space-y-2">
                      {dbLatest.map((c) => (
                         <li key={c.id} className="flex gap-2 text-sm hover:bg-[#003300] cursor-pointer p-1">
                            <span>*</span>
                            <span className="truncate">{c.name.toUpperCase()}</span>
                            <span className="ml-auto opacity-50">[{c.manufacturer?.name.substring(0,3).toUpperCase()}]</span>
                         </li>
                      ))}
                   </ul>
                </div>
                <div className="flex flex-col justify-center items-center text-center border-l border-[#00ff00] pl-8">
                    <p className="mb-6 text-lg">
                       UNLOCK THE FULL DATABASE?
                    </p>
                    <Link href="/consoles" className="bg-[#00ff00] text-black font-bold px-6 py-3 hover:bg-white transition-colors">
                       INSERT COIN TO ENTER
                    </Link>
                </div>
             </div>
          </section>

       </main>

       <footer className="bg-white border-t-4 border-black p-12 text-center mt-12">
          <p className="font-black italic text-xl">THE RETRO CIRCUIT MAGAZINE</p>
          <p className="text-xs mt-2 font-bold text-gray-400">NOT AFFILIATED WITH ANYONE. FOR ENTERTAINMENT PURPOSES ONLY.</p>
       </footer>
    </div>
  );
}
