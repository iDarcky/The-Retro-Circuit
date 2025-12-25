
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, LayoutGrid, Smartphone } from 'lucide-react';

export default async function GlassConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc] font-sans selection:bg-white/50 selection:text-black">

      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#8ec5fc] mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
         <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#e0c3fc] mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-pink-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="relative z-10 px-8 py-6 flex justify-between items-center">
         <div className="text-2xl font-bold text-white drop-shadow-md tracking-tight">
            RetroCircuit
         </div>
         <div className="flex gap-4">
            <Link href="/consoles" className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2 rounded-2xl text-white font-medium transition-all shadow-sm border border-white/40">
               Database
            </Link>
         </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

         {/* LEFT COLUMN: HERO & FINDER */}
         <div className="lg:col-span-8 flex flex-col gap-8">
            <section className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-12 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

               <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 tracking-tight relative z-10">
                  Discover your <br/> Next Handheld.
               </h1>
               <p className="text-slate-600 text-xl mb-10 max-w-md relative z-10">
                  Our guided finder helps you navigate the history of gaming hardware.
               </p>

               <Link href="/finder" className="inline-flex items-center gap-3 bg-white/60 hover:bg-white/80 text-slate-800 font-bold px-8 py-4 rounded-2xl backdrop-blur-md shadow-lg transition-all transform hover:scale-105">
                  <Search size={20} /> Launch Finder
               </Link>
            </section>

            {/* LATEST RELEASED (Masonry-ish) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="bg-white/20 backdrop-blur-lg border border-white/30 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1">
                     <div className="flex justify-between items-start mb-4">
                        <span className="bg-white/40 px-3 py-1 rounded-full text-xs font-bold text-slate-700">{c.release_year}</span>
                        <ArrowRight className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" size={18} />
                     </div>
                     <div className="h-32 mb-4 flex items-center justify-center">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={120} height={100} className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                        ) : <Smartphone className="text-white/50" size={48} />}
                     </div>
                     <h3 className="font-bold text-xl text-slate-800">{c.name}</h3>
                     <p className="text-slate-600 text-sm">{c.manufacturer?.name}</p>
                  </div>
               ))}
            </section>
         </div>

         {/* RIGHT COLUMN: VS & DB */}
         <div className="lg:col-span-4 flex flex-col gap-8">

            {/* VS MODE */}
            <section className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl text-center">
               <h2 className="text-2xl font-bold text-slate-800 mb-8">Compare</h2>

               <div className="flex justify-center items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/30 border border-white/50 flex items-center justify-center shadow-inner">
                     <span className="text-2xl text-slate-500 font-light">+</span>
                  </div>
                  <span className="font-black text-white text-xl drop-shadow-sm">VS</span>
                  <div className="w-16 h-16 rounded-2xl bg-white/30 border border-white/50 flex items-center justify-center shadow-inner">
                     <span className="text-2xl text-slate-500 font-light">+</span>
                  </div>
               </div>

               <button className="w-full py-3 rounded-xl bg-slate-800/10 hover:bg-slate-800/20 text-slate-800 font-bold transition-colors">
                  Select Devices
               </button>
            </section>

            {/* LATEST ADDED LIST */}
            <section className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-xl flex-grow">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/30 rounded-xl">
                     <LayoutGrid size={20} className="text-slate-700" />
                  </div>
                  <h2 className="font-bold text-slate-800">Database</h2>
               </div>

               <div className="space-y-4">
                  {dbLatest.map((c) => (
                     <div key={c.id} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                           {c.image_url ? (
                               <Image src={c.image_url} alt={c.name} width={24} height={24} className="object-contain" />
                           ) : <div className="w-2 h-2 bg-slate-400 rounded-full"></div>}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">{c.name}</h4>
                           <span className="text-xs text-slate-600">{c.manufacturer?.name}</span>
                        </div>
                     </div>
                  ))}
               </div>

               <Link href="/consoles" className="block text-center mt-8 text-sm text-slate-500 hover:text-slate-800 font-medium">
                  View Full Collection
               </Link>
            </section>
         </div>

      </main>
    </div>
  );
}
