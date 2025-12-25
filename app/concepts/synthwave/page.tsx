
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Disc } from 'lucide-react';

export default async function SynthwaveConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#120024] text-[#ff00de] font-sans overflow-x-hidden selection:bg-[#00f0ff] selection:text-black">

      {/* BACKGROUND SUN & GRID */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 w-full h-full bg-gradient-to-b from-[#120024] to-[#240046]"></div>
          {/* Sun */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full bg-gradient-to-t from-[#ff00de] to-[#ffbd00] shadow-[0_0_100px_#ff00de] opacity-80"></div>
          {/* Horizon */}
          <div className="absolute bottom-0 w-full h-[50vh] bg-[#120024] opacity-90"></div>
          {/* Grid */}
          <div className="absolute bottom-0 w-full h-[50vh]" style={{
              backgroundImage: 'linear-gradient(transparent 95%, #00f0ff 95%), linear-gradient(90deg, transparent 95%, #00f0ff 95%)',
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg) scale(2)',
              transformOrigin: 'bottom'
          }}></div>
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-sm">
         <div className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ff00de] drop-shadow-[2px_2px_0_rgba(255,255,255,0.2)]">
            RETRO CIRCUIT
         </div>
         <div className="flex gap-6 text-[#00f0ff] font-bold italic text-sm">
            <Link href="/consoles" className="hover:text-white drop-shadow-[0_0_5px_#00f0ff]">DATABASE</Link>
            <Link href="/about" className="hover:text-white drop-shadow-[0_0_5px_#00f0ff]">ABOUT</Link>
         </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">

         {/* HERO / FINDER */}
         <section className="text-center py-20 mb-20">
             <h1 className="text-5xl md:text-7xl font-black italic text-white mb-6 drop-shadow-[4px_4px_0_#ff00de]">
                CHOOSE YOUR<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#00f0ff] to-[#0080ff]">DESTINY</span>
             </h1>
             <p className="text-[#e0e0e0] text-lg md:text-xl font-light italic mb-12 tracking-wide max-w-2xl mx-auto drop-shadow-md">
                Cruising through the digital highway? Use our finder to locate the ultimate hardware.
             </p>
             <Link href="/finder" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ff00de] to-[#7b00ff] text-white text-xl font-bold italic px-10 py-4 rounded-full shadow-[0_0_20px_#ff00de] hover:scale-110 transition-transform">
                <Play fill="white" /> START ENGINE
             </Link>
         </section>

         {/* LATEST (Cards) */}
         <section className="mb-24">
            <h2 className="text-3xl font-black italic text-[#ffbd00] mb-8 drop-shadow-[2px_2px_0_#ff0055]">NEW ARRIVALS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="bg-[#1a0b2e]/80 border border-[#ff00de] p-6 rounded-xl relative overflow-hidden group hover:shadow-[0_0_30px_#ff00de] transition-shadow backdrop-blur-md">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ff00de]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="h-48 mb-6 flex items-center justify-center relative z-10">
                        {c.image_url ? (
                            <Image src={c.image_url} alt={c.name} width={200} height={150} className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        ) : <Disc size={48} className="text-[#ff00de]" />}
                     </div>
                     <h3 className="text-2xl font-bold italic text-white relative z-10">{c.name}</h3>
                     <p className="text-[#00f0ff] text-sm relative z-10">{c.manufacturer?.name} // {c.release_year}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE */}
         <section className="mb-24 bg-gradient-to-r from-[#240046] to-[#120024] p-8 rounded-2xl border border-[#00f0ff]/50 shadow-[0_0_20px_#00f0ff]/30">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex-1 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-black rounded-full border-4 border-[#00f0ff] flex items-center justify-center shadow-[0_0_15px_#00f0ff] cursor-pointer hover:bg-[#00f0ff]/20 transition-colors">
                       <span className="text-4xl text-[#00f0ff] font-thin">+</span>
                    </div>
                    <span className="text-white font-bold italic">PLAYER 1</span>
                 </div>

                 <div className="text-6xl font-black italic text-[#ffbd00] drop-shadow-[0_0_10px_#ffbd00]">
                    VS
                 </div>

                 <div className="flex-1 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-black rounded-full border-4 border-[#ff00de] flex items-center justify-center shadow-[0_0_15px_#ff00de] cursor-pointer hover:bg-[#ff00de]/20 transition-colors">
                       <span className="text-4xl text-[#ff00de] font-thin">+</span>
                    </div>
                    <span className="text-white font-bold italic">PLAYER 2</span>
                 </div>
             </div>
         </section>

         {/* DATABASE */}
         <section className="relative z-10 bg-black/50 p-8 rounded-xl backdrop-blur-sm border border-[#7b00ff]">
            <h3 className="text-[#00f0ff] font-bold text-xl mb-6 flex items-center gap-2">
               <span className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse"></span>
               DATABASE FEED
            </h3>
            <div className="space-y-4">
               {dbLatest.map((c) => (
                  <div key={c.id} className="flex justify-between items-center border-b border-[#7b00ff]/30 pb-2 hover:bg-[#7b00ff]/10 p-2 rounded transition-colors cursor-pointer">
                     <span className="text-white font-mono">{c.name}</span>
                     <span className="text-[#ff00de] text-sm font-mono">{c.specs?.cpu_model || 'UNKNOWN CPU'}</span>
                  </div>
               ))}
            </div>
         </section>

      </main>

      <footer className="relative z-10 text-center py-12 text-[#ff00de]/60 text-xs font-mono">
         PRESS START TO CONTINUE
      </footer>
    </div>
  );
}
