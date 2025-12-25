
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, ExternalLink } from 'lucide-react';

export default async function JournalConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(4),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#2c3e50] font-serif selection:bg-[#d6eaf8]">

      {/* HEADER */}
      <nav className="border-b border-gray-300 bg-white py-4 px-8 md:px-16 flex justify-between items-end shadow-sm">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">The Retro Circuit Journal</h1>
            <p className="text-xs text-gray-500 font-sans mt-1">Proceedings of the Interactive Hardware Society</p>
         </div>
         <div className="text-xs font-sans text-gray-500 text-right hidden md:block">
            Vol. 42, No. 1<br/>
            ISSN 2024-9999
         </div>
      </nav>

      <main className="max-w-5xl mx-auto p-8 md:p-16">

         {/* ABSTRACT / FINDER */}
         <section className="mb-16 border-b border-gray-300 pb-12">
            <h2 className="font-sans text-xs font-bold uppercase text-gray-400 mb-4 tracking-wider">Abstract</h2>
            <div className="bg-white border border-gray-200 p-8 shadow-sm">
               <h3 className="text-xl md:text-2xl font-bold mb-4">Methodology for Hardware Selection in Retro Gaming Contexts</h3>
               <p className="mb-6 leading-relaxed text-sm md:text-base text-gray-700">
                  This study proposes a novel algorithm for matching user preferences with historical gaming hardware.
                  By analyzing input parameters such as nostalgia factor, technical aptitude, and budget constraints,
                  we demonstrate a 98% improvement in satisfaction metrics.
               </p>
               <div className="flex gap-4">
                  <Link href="/finder" className="font-sans text-xs bg-[#2c3e50] text-white px-4 py-2 font-bold hover:bg-[#34495e]">
                     Run Simulation (Finder)
                  </Link>
                  <span className="font-sans text-xs text-gray-400 py-2">DOI: 10.1093/retro/finder.v1</span>
               </div>
            </div>
         </section>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* LEFT COLUMN (Latest Released) */}
            <div className="lg:col-span-8">
               <h2 className="font-sans text-xs font-bold uppercase text-gray-400 mb-6 tracking-wider border-b border-gray-300 pb-2">Recent Publications</h2>
               <div className="space-y-8">
                  {realWorldLatest.map((c, i) => (
                     <div key={c.id} className="flex gap-6 items-start group cursor-pointer hover:bg-white p-4 -ml-4 transition-colors rounded-sm">
                        <div className="w-24 h-32 bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center p-2">
                           {c.image_url ? (
                              <Image src={c.image_url} alt={c.name} width={80} height={80} className="object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all" />
                           ) : <FileText className="text-gray-300" />}
                        </div>
                        <div>
                           <h3 className="text-lg font-bold mb-2 group-hover:text-blue-800 transition-colors">{c.name}: A Technical Overview</h3>
                           <p className="text-xs font-sans text-gray-500 mb-2">
                              {c.manufacturer?.name}, et al. ({c.release_year}).
                              <i className="font-serif"> Journal of Handheld Computing</i>, 12(3), 45-50.
                           </p>
                           <p className="text-sm text-gray-600 line-clamp-2">
                              An analysis of the {c.name}'s architecture, focusing on its CPU performance ({c.specs?.cpu_clock_max_mhz || 'N/A'} MHz) and market impact.
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* RIGHT COLUMN (VS & DB) */}
            <div className="lg:col-span-4 space-y-12">

               {/* VS MODE */}
               <section className="bg-gray-100 p-6 border border-gray-200">
                  <h4 className="font-sans text-xs font-bold uppercase mb-4 text-gray-500">Comparative Analysis</h4>
                  <div className="flex items-center justify-between text-center font-sans text-xs font-bold text-gray-400 mb-4">
                     <div className="w-12 h-12 border border-gray-300 bg-white flex items-center justify-center">A</div>
                     <span>vs.</span>
                     <div className="w-12 h-12 border border-gray-300 bg-white flex items-center justify-center">B</div>
                  </div>
                  <button className="w-full bg-white border border-gray-300 py-2 text-xs font-sans font-bold hover:bg-gray-50">
                     Select Variables
                  </button>
               </section>

               {/* LATEST ADDED */}
               <section>
                  <h4 className="font-sans text-xs font-bold uppercase mb-4 text-gray-400 border-b border-gray-300 pb-2">Index Updates</h4>
                  <ul className="text-sm space-y-3">
                     {dbLatest.map((c) => (
                        <li key={c.id} className="flex gap-2 items-baseline">
                           <span className="text-xs font-sans text-gray-400">[{c.id.substring(0,4)}]</span>
                           <span className="hover:underline cursor-pointer">{c.name}</span>
                        </li>
                     ))}
                  </ul>
                  <Link href="/consoles" className="flex items-center gap-1 mt-6 text-xs font-sans text-blue-800 hover:underline">
                     View Full Index <ExternalLink size={10} />
                  </Link>
               </section>

            </div>
         </div>

      </main>
    </div>
  );
}
