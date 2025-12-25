
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default async function AuctionConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#333] font-serif selection:bg-[#c5a059] selection:text-white">

      {/* HEADER */}
      <nav className="bg-white border-b border-gray-200 py-6 px-8 flex justify-between items-center sticky top-0 z-50">
         <span className="text-xl font-bold tracking-widest uppercase">Christie's Circuit</span>
         <div className="flex gap-8 text-xs font-sans uppercase tracking-widest text-gray-500">
            <span>Auctions</span>
            <span>Private Sales</span>
            <span>Departments</span>
         </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-16">

         {/* HERO / FINDER */}
         <section className="flex flex-col md:flex-row gap-12 mb-24 items-center">
            <div className="flex-1">
               <span className="text-[#c5a059] font-sans text-xs font-bold uppercase tracking-widest mb-4 block">Upcoming Lot</span>
               <h1 className="text-5xl font-light mb-6 leading-tight">
                  Discover Rare <br/> <i className="font-serif">Gaming Artifacts</i>
               </h1>
               <p className="text-gray-600 mb-8 max-w-md font-sans text-sm leading-relaxed">
                  Our expert appraisers have curated a selection of the world's most desirable handheld consoles. Find the piece that completes your collection.
               </p>
               <Link href="/finder" className="bg-[#333] text-white px-8 py-4 font-sans text-xs uppercase tracking-widest hover:bg-[#c5a059] transition-colors">
                  Speak with a Specialist (Finder)
               </Link>
            </div>
            <div className="flex-1 bg-white p-12 shadow-xl relative">
               <div className="absolute top-0 right-0 bg-[#c5a059] text-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest">
                  Lot 42
               </div>
               <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  <Search size={64} className="text-gray-300" />
               </div>
            </div>
         </section>

         {/* LATEST RELEASED (The Lots) */}
         <section className="mb-24">
            <div className="flex justify-between items-end mb-12 border-b border-gray-300 pb-4">
               <h2 className="text-2xl font-light">Featured Lots (New Releases)</h2>
               <span className="font-sans text-xs uppercase tracking-widest text-gray-500">London / New York / Tokyo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="group cursor-pointer">
                     <div className="bg-white aspect-[4/3] mb-6 flex items-center justify-center p-8 shadow-sm group-hover:shadow-xl transition-shadow duration-500 relative">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={200} height={150} className="object-contain" />
                        ) : <div className="w-16 h-16 bg-gray-100 rounded-full"></div>}
                     </div>
                     <div className="text-center">
                        <span className="block font-sans text-xs font-bold uppercase tracking-widest text-[#c5a059] mb-2">Estimate Upon Request</span>
                        <h3 className="text-xl font-bold mb-1">{c.name}</h3>
                        <p className="font-sans text-xs text-gray-500 uppercase tracking-widest">{c.manufacturer?.name}, Circa {c.release_year}</p>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE & DB */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-12 shadow-sm border border-gray-100">

            {/* VS MODE */}
            <section className="border-r border-gray-100 pr-12">
               <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Provenance Comparison</h3>
               <div className="flex items-center justify-between mb-8">
                  <div className="text-center">
                     <span className="block text-4xl font-light text-gray-300 mb-2">A</span>
                     <span className="font-sans text-xs uppercase font-bold">Lot 1</span>
                  </div>
                  <div className="h-px bg-gray-300 w-12"></div>
                  <div className="text-center">
                     <span className="block text-4xl font-light text-gray-300 mb-2">B</span>
                     <span className="font-sans text-xs uppercase font-bold">Lot 2</span>
                  </div>
               </div>
               <button className="text-[#c5a059] font-sans text-xs font-bold uppercase tracking-widest hover:underline">
                  Compare Condition Reports
               </button>
            </section>

            {/* LATEST ADDED (Catalog) */}
            <section>
               <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Auction Results</h3>
               <ul className="space-y-4">
                  {dbLatest.map((c) => (
                     <li key={c.id} className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                        <span className="text-lg font-light">{c.name}</span>
                        <span className="font-sans text-xs font-bold text-gray-500">SOLD</span>
                     </li>
                  ))}
               </ul>
               <div className="mt-8 text-right">
                  <Link href="/consoles" className="font-sans text-xs font-bold uppercase tracking-widest hover:text-[#c5a059] transition-colors">
                     View Past Auctions &rarr;
                  </Link>
               </div>
            </section>

         </div>

      </main>
    </div>
  );
}
