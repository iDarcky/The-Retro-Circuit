
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { ChefHat } from 'lucide-react';

export default async function MenuConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#2c2c2c] font-serif selection:bg-[#2c2c2c] selection:text-[#fffcf5]">

      {/* HEADER */}
      <nav className="py-12 text-center border-b border-double border-[#2c2c2c] mx-8 md:mx-24">
         <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4">Le Circuit Rétro</h1>
         <div className="flex justify-center gap-8 text-xs font-sans uppercase tracking-widest text-gray-500">
            <span>Est. 2024</span>
            <ChefHat size={16} />
            <span>Tasting Menu</span>
         </div>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-16">

         {/* HERO / FINDER */}
         <section className="text-center mb-24">
            <span className="font-serif italic text-gray-400 text-lg block mb-4">Pour Commencer</span>
            <h2 className="text-3xl font-bold mb-6">The Curator's Selection</h2>
            <p className="text-sm font-sans text-gray-600 leading-loose max-w-md mx-auto mb-8">
               Allow our sommeliers to guide you through a personalized tasting of handheld history, paired perfectly with your nostalgic palette.
            </p>
            <Link href="/finder" className="inline-block border border-[#2c2c2c] px-8 py-3 text-xs font-sans uppercase tracking-widest hover:bg-[#2c2c2c] hover:text-[#fffcf5] transition-colors">
               Begin Tasting Experience
            </Link>
         </section>

         {/* LATEST RELEASED (Seasonal) */}
         <section className="mb-24 text-center">
            <span className="font-serif italic text-gray-400 text-lg block mb-8">Plats Principaux (Seasonal)</span>

            <div className="space-y-12">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="group cursor-pointer">
                     <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-2 mb-2">
                        <h3 className="text-xl font-bold group-hover:italic transition-all">{c.name}</h3>
                        <span className="font-sans text-sm font-bold">{c.release_year}</span>
                     </div>
                     <p className="font-sans text-xs text-gray-500 italic mb-4">
                        {c.manufacturer?.name} — {c.specs?.cpu_model ? `Served with ${c.specs.cpu_model}` : 'Market Price'}
                     </p>
                     <div className="h-0 group-hover:h-32 transition-all duration-500 overflow-hidden flex items-center justify-center opacity-0 group-hover:opacity-100">
                        {c.image_url && (
                           <Image src={c.image_url} alt={c.name} width={100} height={80} className="object-contain" />
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE (Pairing) */}
         <section className="mb-24 bg-white p-12 shadow-sm border border-gray-100 text-center">
            <h3 className="text-2xl font-bold mb-6">A Study in Contrasts</h3>
            <p className="font-sans text-xs text-gray-500 mb-8">Compare two distinct flavors side-by-side.</p>

            <div className="flex justify-center items-center gap-12 font-serif italic text-lg">
               <span>Option A</span>
               <span className="not-italic text-xs font-sans border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center">&</span>
               <span>Option B</span>
            </div>
         </section>

         {/* LATEST ADDED (Dessert/Archive) */}
         <section className="text-center">
            <span className="font-serif italic text-gray-400 text-lg block mb-8">From The Cellar (Archive)</span>
            <ul className="space-y-4 font-sans text-xs uppercase tracking-widest text-gray-600">
               {dbLatest.map((c) => (
                  <li key={c.id} className="hover:text-black cursor-default">
                     {c.name} <span className="opacity-30 mx-2">/</span> {c.manufacturer?.name}
                  </li>
               ))}
            </ul>
            <div className="mt-12">
               <Link href="/consoles" className="border-b border-[#2c2c2c] pb-1 hover:border-transparent transition-all text-xs font-sans uppercase">
                  View Full Wine List
               </Link>
            </div>
         </section>

      </main>
    </div>
  );
}
