
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import Link from 'next/link';
import Image from 'next/image';
import { Smile, Heart, CheckCircle, ArrowRight } from 'lucide-react';

export default async function PsychConcept() {
  const [realWorldLatest, dbLatest] = await Promise.all([
    fetchRealWorldLatest(3),
    fetchLatestConsoles(5)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] to-[#e6e9f0] text-[#4a4a4a] font-sans selection:bg-[#ff9a9e] selection:text-white">

      {/* HEADER */}
      <nav className="p-6 md:p-8 flex justify-between items-center">
         <span className="font-bold text-lg text-[#6b7c93] tracking-tight">
            <span className="text-[#ff9a9e]">●</span> inner_gaming
         </span>
         <div className="text-sm font-medium text-[#6b7c93]">Log In</div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">

         {/* HERO / FINDER */}
         <section className="text-center mb-16 bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-white/50">
            <Smile className="mx-auto text-[#ff9a9e] mb-6" size={48} />
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-[#2d3748]">
               Find your gaming personality type.
            </h1>
            <p className="text-lg text-[#718096] mb-8 leading-relaxed max-w-lg mx-auto">
               Are you a Nostalgic Purist or a Performance Maximizer? Take our free 2-minute assessment to discover the hardware that truly understands you.
            </p>
            <Link href="/finder" className="inline-block bg-[#ff9a9e] text-white px-8 py-4 rounded-full font-bold shadow-[0_4px_14px_0_rgba(255,154,158,0.39)] hover:-translate-y-1 transition-transform">
               Take the Assessment
            </Link>
         </section>

         {/* LATEST RELEASED (Types) */}
         <section className="mb-16">
            <h2 className="text-center text-sm font-bold text-[#a0aec0] uppercase tracking-wider mb-8">Recently Analyzed Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {realWorldLatest.map((c) => (
                  <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                     <div className="h-32 bg-[#f7fafc] rounded-xl mb-4 flex items-center justify-center p-4">
                        {c.image_url ? (
                           <Image src={c.image_url} alt={c.name} width={120} height={100} className="object-contain opacity-80" />
                        ) : <div className="w-12 h-12 bg-[#cbd5e0] rounded-full"></div>}
                     </div>
                     <h3 className="font-bold text-[#2d3748] mb-1">{c.name}</h3>
                     <p className="text-sm text-[#718096] mb-3">{c.manufacturer?.name}</p>
                     <div className="flex gap-2">
                        <span className="text-[10px] bg-[#e2e8f0] px-2 py-1 rounded-full text-[#4a5568]">Introverted</span>
                        <span className="text-[10px] bg-[#e2e8f0] px-2 py-1 rounded-full text-[#4a5568]">Portable</span>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* VS MODE (Compatibility) */}
         <section className="bg-[#fff5f5] p-8 md:p-12 rounded-3xl mb-16 flex flex-col items-center text-center">
            <Heart className="text-[#fc8181] mb-4" size={32} />
            <h3 className="text-2xl font-bold text-[#2d3748] mb-4">Compatibility Check</h3>
            <p className="text-[#718096] mb-8 max-w-sm">
               Wondering if two consoles can coexist in your collection? Compare their traits side-by-side.
            </p>
            <div className="flex gap-4 items-center bg-white p-2 rounded-full shadow-sm w-full max-w-md border border-[#fed7d7]">
               <div className="flex-1 text-sm text-[#a0aec0]">You</div>
               <span className="text-[#fc8181] font-bold">+</span>
               <div className="flex-1 text-sm text-[#a0aec0]">?</div>
            </div>
         </section>

         {/* LATEST ADDED (Feed) */}
         <section>
            <h3 className="text-lg font-bold text-[#2d3748] mb-6">Community Updates</h3>
            <div className="space-y-4">
               {dbLatest.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                     <CheckCircle className="text-[#68d391]" size={20} />
                     <div className="flex-grow">
                        <span className="font-bold text-[#2d3748]">{c.name}</span>
                        <span className="text-sm text-[#718096]"> was added to the database.</span>
                     </div>
                     <ArrowRight size={16} className="text-[#cbd5e0]" />
                  </div>
               ))}
            </div>
            <div className="text-center mt-8">
               <Link href="/consoles" className="text-[#ff9a9e] font-bold hover:underline">View All Records</Link>
            </div>
         </section>

      </main>
    </div>
  );
}
