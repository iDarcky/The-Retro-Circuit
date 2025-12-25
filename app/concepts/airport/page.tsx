
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Plane, ArrowRight } from 'lucide-react';

export default async function AirportConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(5),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-[#222] text-[#f0c420] font-mono selection:bg-[#f0c420] selection:text-black">

      {/* HEADER */}
      <nav className="bg-[#111] p-4 border-b border-[#333] flex justify-between items-center">
         <div className="flex items-center gap-4">
            <Plane className="transform -rotate-45" />
            <h1 className="text-xl font-bold tracking-widest uppercase">RETRO INT'L DEPARTURES</h1>
         </div>
         <div className="text-sm animate-pulse">
            {new Date().toLocaleTimeString()}
         </div>
      </nav>

      <main className="p-4 md:p-8">

         {/* HERO / FINDER */}
         <section className="mb-12 bg-[#111] p-8 border border-[#333]">
            <h2 className="text-sm text-gray-500 mb-4 uppercase tracking-widest">Passenger Advisory</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
               <div>
                  <p className="text-2xl md:text-4xl font-bold uppercase leading-tight mb-4 text-white">
                     Unsure of your final destination?
                  </p>
                  <p className="text-gray-400 max-w-lg mb-6">
                     Use our automated terminal to find the flight path that suits your gaming itinerary.
                  </p>
               </div>
               <Link href="/finder" className="bg-[#f0c420] text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors">
                  Check In Now
               </Link>
            </div>
         </section>

         {/* LATEST RELEASED (Departures Board) */}
         <section className="mb-12">
            <div className="flex justify-between items-end mb-4">
               <h3 className="text-xl font-bold uppercase text-white">Departures (New Releases)</h3>
               <span className="text-xs text-[#f0c420] animate-pulse">ON TIME</span>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse bg-[#111]">
                  <thead className="bg-[#333] text-white text-xs uppercase">
                     <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Flight (Console)</th>
                        <th className="p-3">Destination (Maker)</th>
                        <th className="p-3">Gate</th>
                        <th className="p-3">Status</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm font-bold">
                     {realWorldLatest.map((c, i) => (
                        <tr key={c.id} className="border-b border-[#222] hover:bg-[#222] transition-colors">
                           <td className="p-3 text-white">{c.release_year}</td>
                           <td className="p-3 text-[#f0c420] uppercase">{c.name}</td>
                           <td className="p-3 text-white uppercase">{c.manufacturer?.name}</td>
                           <td className="p-3 text-white">A{i+1}</td>
                           <td className="p-3 text-[#00ff00] uppercase">BOARDING</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </section>

         {/* VS MODE (Transfer) */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-[#111] p-6 border border-[#333] flex flex-col justify-between">
               <div>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase">Flight Connections</h3>
                  <p className="text-xs text-gray-500 mb-6">Compare transfer options between two carriers.</p>
               </div>
               <div className="flex items-center gap-4 text-[#f0c420]">
                  <div className="border border-[#f0c420] px-4 py-2 w-full text-center">FLIGHT A</div>
                  <ArrowRight />
                  <div className="border border-[#f0c420] px-4 py-2 w-full text-center">FLIGHT B</div>
               </div>
            </div>

            {/* LATEST ADDED (Arrivals) */}
            <div className="bg-[#111] p-6 border border-[#333]">
               <h3 className="text-lg font-bold text-white mb-4 uppercase">Arrivals (Database)</h3>
               <ul className="space-y-2 text-xs">
                  {dbLatest.map((c) => (
                     <li key={c.id} className="flex justify-between border-b border-[#222] pb-1">
                        <span className="uppercase text-white">{c.name}</span>
                        <span className="text-[#f0c420]">LANDED</span>
                     </li>
                  ))}
               </ul>
               <Link href="/consoles" className="block text-right mt-4 text-[#f0c420] hover:underline text-xs uppercase">
                  View All Flights
               </Link>
            </div>
         </section>

      </main>
    </div>
  );
}
