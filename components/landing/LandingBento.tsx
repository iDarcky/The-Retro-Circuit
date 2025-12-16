import React from 'react';
import { Gamepad2, Database, Trophy, Search, User } from 'lucide-react';

export default function LandingBento() {
  return (
    <div className="min-h-screen bg-[#111] text-white p-4 md:p-8 font-sans flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 grid-rows-4 gap-4 h-[800px]">

            {/* Main Title - Large Square */}
            <div className="md:col-span-2 md:row-span-2 bg-[#1a1a1a] rounded-3xl p-8 flex flex-col justify-between hover:bg-[#222] transition-colors group cursor-pointer border border-white/5">
                <div>
                    <Gamepad2 className="w-24 h-24 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-5xl font-bold mb-2">The Retro Circuit</h1>
                    <p className="text-gray-400 text-lg">Preserving gaming history, one spec at a time.</p>
                </div>
            </div>

            {/* Search - Horizontal Rectangle */}
            <div className="md:col-span-2 bg-[#2a2a2a] rounded-3xl p-6 flex items-center gap-4 hover:bg-[#333] transition-colors cursor-pointer border border-white/5">
                 <Search className="w-8 h-8" />
                 <span className="text-2xl font-medium text-gray-400">Search for a console...</span>
            </div>

            {/* User Profile - Small Square */}
            <div className="md:col-span-1 md:row-span-1 bg-blue-600 rounded-3xl p-6 flex flex-col justify-between hover:bg-blue-500 transition-colors cursor-pointer text-white">
                 <div className="flex justify-between items-start">
                     <div className="bg-white/20 p-2 rounded-full">
                         <User className="w-5 h-5" />
                     </div>
                     <div className="font-bold">Guest User</div>
                 </div>
                 <div className="text-3xl font-bold">Login</div>
            </div>

            {/* Stats - Small Square */}
            <div className="md:col-span-1 md:row-span-1 bg-[#1a1a1a] rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-[#222] transition-colors border border-white/5">
                 <div className="text-5xl font-bold text-green-400">142</div>
                 <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Systems Archived</div>
            </div>

            {/* VS Mode - Vertical Rectangle */}
            <div className="md:col-span-1 md:row-span-2 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-6 relative overflow-hidden group cursor-pointer border border-white/5">
                 <div className="absolute top-6 left-6 z-20">
                     <h3 className="text-2xl font-bold">VS Mode</h3>
                     <p className="text-purple-200 text-sm mt-1">Compare Specs</p>
                 </div>
                 <Trophy className="w-16 h-16 text-white/20 group-hover:text-white/40 transition-colors z-10 rotate-12" />
                 <div className="absolute bottom-6 right-6 bg-white/10 p-3 rounded-full backdrop-blur-md">
                     <span className="text-xl">➔</span>
                 </div>
            </div>

             {/* Database - Wide Rectangle */}
            <div className="md:col-span-2 md:row-span-1 bg-[#1a1a1a] rounded-3xl p-6 flex items-center gap-6 hover:bg-[#222] transition-colors cursor-pointer border border-white/5">
                 <div className="bg-gray-800 p-4 rounded-2xl">
                    <Database className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="font-bold text-sm">Full Database</span>
                 </div>
                 <div>
                     <h3 className="text-xl font-bold">Technical Specifications</h3>
                     <p className="text-gray-400 text-sm">CPU, GPU, RAM, Storage, and more detailed metrics.</p>
                 </div>
            </div>

            {/* News - Square */}
             <div className="md:col-span-1 md:row-span-1 bg-[#1a1a1a] rounded-3xl p-6 flex flex-col justify-end hover:bg-[#222] transition-colors cursor-pointer border border-white/5 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300&h=300')] bg-cover bg-center relative">
                 <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
                 <div className="relative z-10">
                     <div className="text-xs text-green-400 font-bold mb-1">LATEST</div>
                     <h3 className="font-bold leading-tight">Switch 2 Rumors</h3>
                 </div>
            </div>

        </div>
    </div>
  );
}
