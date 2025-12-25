
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Cloud, Sun, Wind, Thermometer } from 'lucide-react';

export default async function WeatherConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4facfe] to-[#00f2fe] text-white font-sans selection:bg-white/30 selection:text-white">

      <nav className="p-6 flex justify-between items-center text-white/90">
         <span className="font-bold text-xl drop-shadow-md">RetroCast</span>
         <div className="flex gap-4 text-sm font-medium">
            <span>°F</span>
            <span className="opacity-50">°C</span>
         </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-12">

         {/* HERO / FINDER */}
         <section className="mb-12 text-center pt-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-6 shadow-lg border border-white/30">
               <Sun size={48} className="text-yellow-300 animate-spin-slow" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-md">Clear Skies</h1>
            <p className="text-xl md:text-2xl font-medium mb-8 text-blue-100">
               Perfect conditions to find your next handheld.
            </p>
            <Link href="/finder" className="bg-white text-[#4facfe] px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-colors">
               See Your Forecast
            </Link>
         </section>

         {/* LATEST RELEASED (Hourly Forecast) */}
         <section className="mb-12">
            <h2 className="text-sm font-bold uppercase text-blue-100 mb-4 ml-2">Recent Conditions</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="min-w-[160px] bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-white/20">
                     <span className="text-xs font-bold mb-2 opacity-80">{c.release_year}</span>
                     <div className="h-16 w-16 mb-2 flex items-center justify-center">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={60} height={60} className="object-contain drop-shadow-md" />
                        ) : <Cloud size={32} />}
                     </div>
                     <span className="font-bold text-center text-sm leading-tight mb-1">{c.name}</span>
                     <span className="text-xs opacity-70">{c.specs?.cpu_clock_max_mhz ? `${Math.round(c.specs.cpu_clock_max_mhz / 100)}°` : '--'}</span>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE (Details Grid) */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
               <h3 className="flex items-center gap-2 font-bold mb-4 opacity-80"><Thermometer size={18} /> Comparison Radar</h3>
               <div className="h-32 flex items-center justify-center gap-8">
                  <div className="text-center">
                     <div className="text-2xl font-bold">A</div>
                     <div className="h-1 bg-white/30 w-16 rounded mt-2"></div>
                  </div>
                  <div className="text-xs opacity-50">VS</div>
                  <div className="text-center">
                     <div className="text-2xl font-bold">B</div>
                     <div className="h-1 bg-white/30 w-16 rounded mt-2"></div>
                  </div>
               </div>
            </div>

            {/* LATEST ADDED (List) */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
               <h3 className="flex items-center gap-2 font-bold mb-4 opacity-80"><Wind size={18} /> Incoming Systems</h3>
               <div className="space-y-3">
                  {dbLatest.map((c) => (
                     <div key={c.id} className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="font-medium text-sm">{c.name}</span>
                        <span className="text-xs opacity-60">High Pressure</span>
                     </div>
                  ))}
               </div>
               <Link href="/consoles" className="block text-center mt-4 text-xs font-bold opacity-70 hover:opacity-100">
                  View Full Map
               </Link>
            </div>
         </section>

      </main>
    </div>
  );
}
