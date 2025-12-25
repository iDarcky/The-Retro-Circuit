
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default async function MuseumConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#Fdfdfd] text-[#1a1a1a] font-serif selection:bg-[#d4af37] selection:text-white">

      {/* HEADER */}
      <nav className="py-8 px-8 md:px-16 flex justify-between items-center border-b border-gray-100">
        <span className="text-xl font-bold tracking-widest uppercase">The Retro Circuit</span>
        <div className="hidden md:flex gap-8 text-sm text-gray-500 italic">
          <span>Collection</span>
          <span>Exhibitions</span>
          <span>Curators</span>
        </div>
        <Link href="/consoles" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors">
          View Archive
        </Link>
      </nav>

      <main>
        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
             <h1 className="text-[20vw] font-bold leading-none">ICON</h1>
          </div>

          <div className="z-10 text-center max-w-2xl">
            <span className="block text-[#d4af37] text-xs font-sans font-bold tracking-[0.3em] mb-6">EXHIBIT A: THE FINDER</span>
            <h2 className="text-5xl md:text-7xl font-medium mb-8 leading-tight">
              Curate Your <br/> <i className="font-light">Perfect System</i>
            </h2>
            <p className="text-gray-500 text-lg mb-12 font-sans font-light leading-relaxed">
              Discovering the past is not just about nostalgia. It is about finding the precise instrument that resonates with your history.
            </p>
            <Link href="/finder" className="bg-black text-white px-10 py-4 font-sans text-xs uppercase tracking-widest hover:bg-[#d4af37] transition-colors">
              Begin Guided Tour
            </Link>
          </div>
        </section>

        {/* LATEST RELEASED (Grid) */}
        <section className="py-24 px-8 md:px-16 bg-[#f8f8f8]">
           <div className="max-w-7xl mx-auto">
             <div className="flex items-baseline justify-between mb-16">
               <h3 className="text-3xl font-light">Recent Acquisitions</h3>
               <span className="font-sans text-xs text-gray-400 uppercase tracking-widest">Year {new Date().getFullYear()}</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {realWorldLatest.map((c) => (
                 <div key={c.id} className="group cursor-pointer">
                   <div className="aspect-square bg-white shadow-sm mb-6 flex items-center justify-center p-8 transition-transform duration-700 group-hover:-translate-y-2">
                      {c.image_url ? (
                        <Image src={c.image_url} alt={c.name} width={300} height={300} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500" />
                      ) : <div className="w-12 h-12 bg-gray-100 rounded-full" />}
                   </div>
                   <div className="flex flex-col items-center text-center">
                     <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mb-2">{c.manufacturer?.name}</span>
                     <h4 className="text-xl font-medium mb-2">{c.name}</h4>
                     <span className="w-8 h-px bg-[#d4af37]"></span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* VS MODE (Minimal Split) */}
        <section className="h-[600px] flex flex-col md:flex-row border-y border-gray-200">
           <div className="flex-1 bg-white flex items-center justify-center border-r border-gray-100 relative group hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="absolute top-8 left-8 font-sans text-xs text-gray-300">FIG. 01</span>
              <span className="text-4xl text-gray-200 group-hover:text-gray-800 transition-colors font-light">Select Object A</span>
           </div>

           <div className="w-full md:w-32 flex items-center justify-center bg-white z-10 -my-4 md:-mx-4 md:my-0">
              <div className="w-16 h-16 rounded-full border border-gray-200 bg-white flex items-center justify-center font-sans text-xs font-bold text-[#d4af37]">VS</div>
           </div>

           <div className="flex-1 bg-white flex items-center justify-center border-l border-gray-100 relative group hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="absolute top-8 right-8 font-sans text-xs text-gray-300">FIG. 02</span>
              <span className="text-4xl text-gray-200 group-hover:text-gray-800 transition-colors font-light">Select Object B</span>
           </div>
        </section>

        {/* LATEST ADDED (List) */}
        <section className="py-24 px-8 md:px-16">
           <div className="max-w-4xl mx-auto">
              <h3 className="text-center font-sans text-xs font-bold tracking-[0.3em] mb-12 text-gray-400">ARCHIVE UPDATES</h3>
              <div className="space-y-8">
                 {dbLatest.map((c) => (
                   <div key={c.id} className="flex items-center justify-between border-b border-gray-100 pb-8 group hover:pl-4 transition-all">
                      <div className="flex items-baseline gap-6">
                        <span className="font-sans text-xs text-[#d4af37]">REF-{c.id.substring(0,3)}</span>
                        <h4 className="text-2xl font-light group-hover:italic transition-all">{c.name}</h4>
                      </div>
                      <span className="font-sans text-xs text-gray-300 uppercase tracking-widest group-hover:text-black transition-colors">View Record</span>
                   </div>
                 ))}
              </div>
              <div className="text-center mt-16">
                 <Link href="/consoles" className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest hover:gap-4 transition-all">
                    Access Full Database <ArrowRight size={14} />
                 </Link>
              </div>
           </div>
        </section>

      </main>

      <footer className="bg-[#111] text-[#444] py-16 px-8 md:px-16 font-sans text-xs uppercase tracking-widest text-center">
         <p>&copy; The Retro Circuit Foundation.</p>
      </footer>
    </div>
  );
}
