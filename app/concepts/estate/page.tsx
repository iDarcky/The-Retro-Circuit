
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Home, MapPin, Maximize } from 'lucide-react';

export default async function EstateConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-[#d2d2d7]">

      <nav className="bg-white/80 backdrop-blur-md px-8 py-4 sticky top-0 z-50 flex justify-between items-center border-b border-gray-200">
         <span className="font-serif text-xl tracking-tight">RetroProperties</span>
         <div className="flex gap-6 text-sm font-medium text-gray-500">
            <Link href="/consoles" className="hover:text-black transition-colors">Listings</Link>
            <Link href="/finder" className="hover:text-black transition-colors">Agents</Link>
         </div>
      </nav>

      {/* HERO / FINDER */}
      <section className="relative h-[600px] flex items-center justify-center bg-gray-200 overflow-hidden">
         {/* Fake Hero Image Placeholder */}
         <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-200 opacity-50"></div>
         <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Home size={400} strokeWidth={0.5} />
         </div>

         <div className="relative z-10 bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-lg shadow-2xl max-w-3xl text-center mx-4">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">Find your space.</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
               From cozy 8-bit cottages to modern handheld penthouses. We help you find the console that feels like home.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
               <Link href="/finder" className="bg-[#1d1d1f] text-white px-8 py-4 rounded-md font-medium hover:bg-black transition-colors">
                  Start Property Search
               </Link>
               <button className="bg-white border border-gray-300 text-[#1d1d1f] px-8 py-4 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  Contact an Agent
               </button>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-24">

         {/* LATEST RELEASED (Listings) */}
         <section className="mb-24">
            <div className="flex justify-between items-end mb-8">
               <h2 className="text-3xl font-serif">New on the Market</h2>
               <span className="text-sm text-gray-500">Showing 3 of {realWorldLatest.length} Listings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
                     <div className="h-64 bg-gray-100 relative flex items-center justify-center p-8">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={250} height={200} className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
                        ) : <div className="text-gray-300 font-serif text-4xl italic">Sold</div>}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                           New Listing
                        </div>
                     </div>
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-xl font-bold">{c.name}</h3>
                           <span className="font-mono text-lg font-medium">{c.specs?.price_launch_usd ? `$${c.specs.price_launch_usd}` : 'Price on Request'}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{c.manufacturer?.name} • Built {c.release_year}</p>

                        <div className="flex gap-4 border-t border-gray-100 pt-4 text-xs font-medium text-gray-500">
                           <span className="flex items-center gap-1"><Maximize size={14} /> {c.specs?.screen_size_inch || '-'} in²</span>
                           <span className="flex items-center gap-1"><MapPin size={14} /> Global</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE & DB */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

            {/* VS MODE */}
            <section className="bg-[#1d1d1f] text-white p-12 rounded-2xl flex flex-col justify-center">
               <h3 className="text-2xl font-serif mb-4">Compare Properties</h3>
               <p className="text-gray-400 mb-8 max-w-sm">
                  Review specifications, price per pixel, and amenities side-by-side.
               </p>
               <div className="flex gap-4 items-center mb-8">
                  <div className="h-16 w-16 bg-white/10 rounded-lg flex items-center justify-center font-serif text-2xl">+</div>
                  <span className="font-serif italic text-gray-500">vs</span>
                  <div className="h-16 w-16 bg-white/10 rounded-lg flex items-center justify-center font-serif text-2xl">+</div>
               </div>
               <button className="self-start text-sm border-b border-white pb-1 hover:text-gray-300 transition-colors">
                  Open Comparator Tool
               </button>
            </section>

            {/* LATEST ADDED (Recent Sales) */}
            <section>
               <h3 className="text-xl font-serif mb-6">Recent Transactions (Database)</h3>
               <div className="space-y-4">
                  {dbLatest.map((c) => (
                     <div key={c.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                        <div>
                           <span className="block font-medium">{c.name}</span>
                           <span className="text-xs text-gray-500 uppercase tracking-wide">Closing Date: Today</span>
                        </div>
                        <Link href="/consoles" className="text-sm font-medium text-blue-600 hover:underline">
                           View Details
                        </Link>
                     </div>
                  ))}
               </div>
            </section>

         </div>

      </main>
    </div>
  );
}
