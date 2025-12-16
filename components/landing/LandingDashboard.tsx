import React from 'react';
import { Cpu, HardDrive, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LandingDashboard() {
  return (
    <div className="min-h-screen bg-[#0f0f1b] text-white font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Header Widget */}
        <div className="col-span-12 md:col-span-8 bg-[#1a1a2e] border border-[#00ff9d]/30 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu size={120} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-[#00ff9d]">THE RETRO CIRCUIT</h1>
            <p className="text-gray-400 max-w-lg mb-6">Archive of gaming hardware. Technical specifications, release dates, and performance metrics for over 200 systems.</p>
            <div className="flex gap-4">
                <Link href="/console" className="bg-[#00ff9d] text-black px-6 py-2 font-bold hover:bg-[#00cc7d] transition-colors">
                    ENTER VAULT
                </Link>
                <Link href="/arena" className="border border-[#00ff9d] text-[#00ff9d] px-6 py-2 font-bold hover:bg-[#00ff9d]/10 transition-colors">
                    VS MODE
                </Link>
            </div>
        </div>

        {/* Stats Widget */}
        <div className="col-span-12 md:col-span-4 bg-[#1a1a2e] border border-[#ff00ff]/30 p-6 flex flex-col justify-between">
             <div>
                 <h3 className="text-[#ff00ff] text-sm uppercase tracking-widest mb-2">System Status</h3>
                 <div className="text-3xl font-bold">ONLINE</div>
             </div>
             <div className="space-y-4 mt-8">
                 <div className="flex justify-between text-sm text-gray-400">
                     <span>Consoles</span>
                     <span className="text-white">142</span>
                 </div>
                 <div className="w-full bg-gray-800 h-1">
                     <div className="bg-[#ff00ff] h-1 w-[70%]"></div>
                 </div>

                 <div className="flex justify-between text-sm text-gray-400">
                     <span>Variants</span>
                     <span className="text-white">894</span>
                 </div>
                 <div className="w-full bg-gray-800 h-1">
                     <div className="bg-[#00ff9d] h-1 w-[85%]"></div>
                 </div>
             </div>
        </div>

        {/* Quick Links / Grid */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a2e] border border-gray-800 p-6 hover:border-[#00ff9d] transition-colors cursor-pointer group">
                <HardDrive className="text-gray-600 group-hover:text-[#00ff9d] mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Hardware Database</h3>
                <p className="text-gray-500 text-sm">Detailed specs for every console generation.</p>
            </div>
            <div className="bg-[#1a1a2e] border border-gray-800 p-6 hover:border-[#ff00ff] transition-colors cursor-pointer group">
                <Zap className="text-gray-600 group-hover:text-[#ff00ff] mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Performance Arena</h3>
                <p className="text-gray-500 text-sm">Head-to-head comparisons and benchmark estimates.</p>
            </div>
             <div className="bg-[#1a1a2e] border border-gray-800 p-6 hover:border-[#00ccff] transition-colors cursor-pointer group">
                <Activity className="text-gray-600 group-hover:text-[#00ccff] mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Market Trends</h3>
                <p className="text-gray-500 text-sm">Track popularity and collector interest over time.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
