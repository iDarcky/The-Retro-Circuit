
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Globe, Music, Battery, Monitor, ChevronRight } from 'lucide-react';

export default async function Y2KConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2f3] to-[#8e9eab] font-sans selection:bg-[#74ebd5] selection:text-white overflow-x-hidden">

      {/* GLOSSY HEADER */}
      <nav className="bg-white/60 backdrop-blur-md border-b border-white/50 sticky top-0 z-50 px-6 py-3 shadow-lg flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow-inner border border-white/50"></div>
            <span className="font-bold text-slate-600 tracking-tight text-lg shadow-white drop-shadow-sm">RetroCircuit XP</span>
         </div>
         <div className="flex bg-white/50 rounded-full px-1 py-1 border border-white/60 shadow-inner">
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm px-3 text-slate-600 w-32 md:w-48 placeholder:text-slate-400" />
            <button className="bg-gradient-to-b from-[#a1c4fd] to-[#c2e9fb] rounded-full p-1.5 text-white shadow-sm hover:brightness-105">
               <Search size={14} />
            </button>
         </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-12">

         {/* HERO / FINDER (Window Style) */}
         <section className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.15)] overflow-hidden mb-12">
            {/* Window Bar */}
            <div className="bg-gradient-to-r from-[#e0eafc] to-[#cfdef3] p-2 flex items-center justify-between border-b border-white/50">
               <span className="text-xs font-bold text-slate-500 ml-2">Console Finder Wizard.exe</span>
               <div className="flex gap-1.5 mr-1">
                  <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/30"></div>
               </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative">
               {/* Aero Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-[#00c6ff]/10 to-[#0072ff]/10 blur-3xl pointer-events-none"></div>

               <div className="flex-1 relative z-10">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-4 drop-shadow-sm tracking-tight">
                     Find your <br/> <span className="text-[#0072ff]">Dream Device</span>
                  </h1>
                  <p className="text-slate-500 mb-8 leading-relaxed">
                     Welcome to the Hardware Setup Wizard. We will help you configure the perfect gaming experience.
                  </p>
                  <Link href="/finder" className="inline-block bg-gradient-to-b from-[#00c6ff] to-[#0072ff] text-white font-bold rounded-full px-8 py-3 shadow-[0_4px_10px_rgba(0,114,255,0.3)] hover:shadow-[0_6px_15px_rgba(0,114,255,0.4)] hover:-translate-y-0.5 transition-all border-t border-white/30">
                     Start Wizard &rarr;
                  </Link>
               </div>

               <div className="flex-1 flex justify-center relative z-10">
                   <div className="w-64 h-48 bg-white/30 rounded-lg border border-white/50 shadow-inner flex items-center justify-center backdrop-blur-md relative overflow-hidden">
                       <Monitor size={64} className="text-slate-400 opacity-50" />
                       {/* Gloss Shine */}
                       <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                   </div>
               </div>
            </div>
         </section>

         {/* WIDGETS ROW (Latest Released) */}
         <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-600 mb-6 flex items-center gap-2">
               <Globe size={20} className="text-[#0072ff]" />
               Network Updates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="bg-white/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-white/50 flex flex-col items-center text-center group">
                     <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full shadow-inner mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {c.image_url ? (
                            <Image src={c.image_url} alt={c.name} width={60} height={60} className="object-contain mix-blend-multiply" />
                        ) : <div className="w-10 h-10 bg-gray-300 rounded-full" />}
                     </div>
                     <h3 className="font-bold text-slate-700">{c.name}</h3>
                     <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 mt-2 border border-slate-200">
                        {c.release_year || 'N/A'}
                     </span>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE (Media Player Style) */}
         <section className="bg-[#2d3436] rounded-xl overflow-hidden shadow-2xl mb-12 text-white relative">
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

             <div className="p-4 bg-gradient-to-b from-[#636e72] to-[#2d3436] border-b border-[#b2bec3]/20 flex justify-between items-center">
                <span className="font-bold text-sm text-gray-200">Comparison Player 2.0</span>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                   <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                </div>
             </div>

             <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-12">
                <div className="w-32 h-32 rounded-full bg-black/50 border-4 border-[#0984e3] flex items-center justify-center shadow-[0_0_20px_#0984e3]">
                   <span className="text-2xl font-bold text-[#74b9ff]">+</span>
                </div>

                <div className="text-center">
                   <h3 className="text-2xl font-bold mb-2">Versus Mode</h3>
                   <p className="text-gray-400 text-sm">Select two tracks to mix</p>
                </div>

                <div className="w-32 h-32 rounded-full bg-black/50 border-4 border-[#fdcb6e] flex items-center justify-center shadow-[0_0_20px_#fdcb6e]">
                   <span className="text-2xl font-bold text-[#ffeaa7]">+</span>
                </div>
             </div>
         </section>

         {/* LATEST ADDED (Sidebar/Gadget style) */}
         <section className="bg-[#dfe6e9]/50 rounded-xl p-6 border border-white/50">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-600">My Database</h3>
                <Link href="/consoles" className="text-xs text-[#0984e3] hover:underline">View All</Link>
             </div>

             <div className="space-y-3">
                {dbLatest.map((c) => (
                   <div key={c.id} className="bg-white/80 rounded-lg p-3 flex items-center justify-between shadow-sm border border-white/60">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500">
                            <Battery size={14} />
                         </div>
                         <div>
                            <span className="block font-bold text-sm text-slate-700">{c.name}</span>
                            <span className="block text-[10px] text-slate-400">{c.manufacturer?.name}</span>
                         </div>
                      </div>
                      <button className="text-slate-400 hover:text-[#0984e3]">
                         <ChevronRight size={16} />
                      </button>
                   </div>
                ))}
             </div>
         </section>

      </main>

      <footer className="text-center py-8 text-slate-400 text-sm">
         <p>Designed for RetroCircuit XP. Resolution 800x600 recommended.</p>
      </footer>
    </div>
  );
}
