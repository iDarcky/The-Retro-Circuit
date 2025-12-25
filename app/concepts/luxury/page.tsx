
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default async function LuxuryConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

      {/* HEADER */}
      <nav className="p-12 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-50">
         <span className="text-xl tracking-[0.5em] uppercase font-light">The Retro Circuit</span>
         <div className="flex gap-12 text-xs tracking-widest font-bold uppercase">
            <Link href="/consoles" className="hover:underline underline-offset-8 decoration-1">Collection</Link>
            <Link href="/finder" className="hover:underline underline-offset-8 decoration-1">Atelier</Link>
         </div>
      </nav>

      <main className="px-8 md:px-24 pb-24">

         {/* HERO / FINDER */}
         <section className="min-h-[80vh] flex flex-col justify-center items-center text-center mb-32">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-8 text-gray-400">Autumn / Winter Collection</span>
            <h1 className="text-6xl md:text-9xl font-thin tracking-tighter mb-12 leading-[0.8]">
               OBJECTS<br/>OF DESIRE
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-gray-500 mb-12">
               Discover the silhouette that defines you. A curated selection of handheld masterpieces designed for the discerning individual.
            </p>
            <Link href="/finder" className="border-b border-black pb-1 text-sm tracking-widest uppercase hover:text-gray-500 transition-colors">
               Find Your Silhouette
            </Link>
         </section>

         {/* LATEST RELEASED (Runway) */}
         <section className="mb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-12 items-end">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="flex flex-col">
                     <div className="bg-gray-50 aspect-[3/4] mb-6 flex items-center justify-center p-8 relative group cursor-pointer overflow-hidden">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={400} height={500} className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                        ) : <div className="w-px h-24 bg-gray-200"></div>}
                        <div className="absolute bottom-4 left-4 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                           FABRIC: PLASTIC / GLASS / SILICON
                        </div>
                     </div>
                     <div className="flex justify-between items-start border-t border-black pt-4">
                        <div>
                           <span className="block text-[10px] tracking-widest uppercase text-gray-400 mb-1">{c.manufacturer?.name}</span>
                           <h3 className="text-xl font-light">{c.name}</h3>
                        </div>
                        <span className="text-xs font-bold">{c.release_year}</span>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE (Editorial) */}
         <section className="mb-32 border-y border-gray-100 py-24">
            <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
               <div className="flex-1 text-right">
                  <span className="block text-4xl md:text-6xl font-thin mb-4 hover:italic cursor-pointer transition-all">Model A</span>
                  <span className="text-xs tracking-widest text-gray-400 uppercase">Select Configuration</span>
               </div>

               <div className="text-2xl font-serif italic text-gray-300 px-12">
                  vs
               </div>

               <div className="flex-1 text-left">
                  <span className="block text-4xl md:text-6xl font-thin mb-4 hover:italic cursor-pointer transition-all">Model B</span>
                  <span className="text-xs tracking-widest text-gray-400 uppercase">Select Configuration</span>
               </div>
            </div>
         </section>

         {/* LATEST ADDED (Lookbook Index) */}
         <section className="max-w-2xl mx-auto">
            <h3 className="text-center text-xs tracking-[0.3em] uppercase mb-16 text-gray-400">Archive Index</h3>
            <div className="space-y-8">
               {dbLatest.map((c) => (
                  <div key={c.id} className="flex items-baseline justify-between group cursor-pointer">
                     <div className="flex items-baseline gap-8">
                        <span className="text-[10px] text-gray-300">00{c.id.substring(0,2)}</span>
                        <span className="text-2xl font-light group-hover:underline underline-offset-8 decoration-1 decoration-gray-200">{c.name}</span>
                     </div>
                     <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Look</span>
                  </div>
               ))}
            </div>
            <div className="text-center mt-24">
               <Link href="/consoles" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors">
                  View Full Catalogue <ArrowRight size={12} />
               </Link>
            </div>
         </section>

      </main>
    </div>
  );
}
