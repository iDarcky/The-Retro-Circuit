import React from 'react';
import { Gamepad2, Database, Trophy, Search, User } from 'lucide-react';

export default function LandingBento() {
  return (
    <div className="min-h-screen bg-[#111] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">The Circuit.</h1>
                <p className="text-gray-400">Your digital museum.</p>
            </div>
            <div className="text-right text-sm text-gray-500">
                <p>Tuesday, 24 Oct</p>
                <p>14:20 PM</p>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[800px]">

            {/* HERO BLOCK */}
            <div className="col-span-1 md:col-span-2 md:row-span-2 bg-[#1a1a1a] rounded-3xl p-8 flex flex-col justify-between hover:bg-[#222] transition-colors group cursor-pointer border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="z-10">
                    <div className="bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-medium backdrop-blur mb-4">Featured Console</div>
                    <h2 className="text-5xl font-bold mb-2">GameCube</h2>
                    <p className="text-gray-400 max-w-sm">The indigo lunchbox that defied physics. Explore the 128-bit era.</p>
                </div>
                <div className="h-48 bg-purple-900/30 rounded-2xl flex items-center justify-center z-10">
                    <Gamepad2 className="w-24 h-24 text-purple-400" />
                </div>
            </div>

            {/* STATS BLOCK */}
            <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 flex flex-col justify-center items-center text-center">
                 <div className="text-5xl font-bold text-[#00ff9d] mb-1">1,240</div>
                 <div className="text-sm text-gray-400 uppercase tracking-widest">Consoles Archived</div>
            </div>

            {/* SEARCH BLOCK */}
            <div className="bg-[#00ff9d] rounded-3xl p-6 text-black flex flex-col justify-between group cursor-pointer">
                 <Search className="w-8 h-8" />
                 <div>
                     <h3 className="text-2xl font-bold">Find anything.</h3>
                     <p className="opacity-70 text-sm">Specs, years, revisions.</p>
                 </div>
            </div>

            {/* PROFILE BLOCK */}
            <div className="md:row-span-2 bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
                 <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                         <User className="w-5 h-5" />
                     </div>
                     <div>
                         <div className="font-bold">Guest User</div>
                         <div className="text-xs text-gray-500">Sign in to sync</div>
                     </div>
                 </div>
                 <div className="flex-1 bg-black/20 rounded-xl p-4">
                     <h4 className="font-bold text-sm mb-2 text-gray-300">Recent Activity</h4>
                     <div className="space-y-3">
                         {[1,2,3].map(i => (
                             <div key={i} className="flex gap-2 items-center text-xs text-gray-500">
                                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                 <span>Viewed Sega Saturn</span>
                             </div>
                         ))}
                     </div>
                 </div>
            </div>

            {/* VS MODE BLOCK */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group cursor-pointer">
                 <div className="z-10 text-white">
                     <h3 className="text-3xl font-bold">VS Mode</h3>
                     <p className="text-white/80">Compare up to 4 devices.</p>
                 </div>
                 <Trophy className="w-16 h-16 text-white/20 group-hover:text-white/40 transition-colors z-10 rotate-12" />
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            </div>

            {/* DATABASE BLOCK */}
            <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 hover:bg-[#222] transition-colors cursor-pointer flex flex-col justify-center items-center text-center">
                <Database className="w-8 h-8 text-blue-400 mb-2" />
                <span className="font-bold text-sm">Full Database</span>
            </div>

        </div>
      </div>
    </div>
  );
}
