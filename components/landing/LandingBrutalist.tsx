import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function LandingBrutalist() {
  return (
    <div className="min-h-screen bg-[#ff4d00] text-black font-mono p-4">
        <div className="border-4 border-black min-h-[calc(100vh-2rem)] relative">

            {/* Header */}
            <div className="border-b-4 border-black p-4 flex justify-between items-center bg-white">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Retro<br/>Circuit</h1>
                <div className="text-right font-bold text-xs md:text-sm">
                    <p>EST. 2024</p>
                    <p>ARCHIVE_V1.0</p>
                </div>
            </div>

            {/* Marquee */}
            <div className="border-b-4 border-black overflow-hidden whitespace-nowrap bg-yellow-300 py-2">
                <div className="animate-marquee inline-block font-bold text-2xl uppercase">
                    /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// PRESERVING HISTORY /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// PRESERVING HISTORY ///
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[600px]">

                {/* Left: Big Link */}
                <div className="border-b-4 md:border-b-0 md:border-r-4 border-black p-8 hover:bg-black hover:text-[#ff4d00] transition-colors cursor-pointer group flex flex-col justify-between">
                     <div>
                        <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] mb-4">
                            Data<br/>Base
                        </h2>
                        <p className="font-bold text-xl max-w-sm">
                            COMPREHENSIVE SPECIFICATIONS FOR VIDEO GAME CONSOLES.
                        </p>
                     </div>
                     <div className="self-end">
                         <ArrowUpRight className="w-16 h-16 border-[3px] border-black rounded-full p-2 bg-[#00ff9d]" />
                     </div>
                </div>

                {/* Right: Stacked Links */}
                <div className="flex flex-col">
                    <div className="flex-1 border-b-4 border-black p-8 hover:bg-white transition-colors cursor-pointer flex items-center justify-between">
                         <span className="text-4xl font-black uppercase">VS Mode</span>
                         <span className="text-xl font-bold">(COMPARE)</span>
                    </div>
                    <div className="flex-1 border-b-4 border-black p-8 hover:bg-white transition-colors cursor-pointer flex items-center justify-between">
                         <span className="text-4xl font-black uppercase">News</span>
                         <span className="text-xl font-bold">(READ)</span>
                    </div>
                     <div className="flex-1 p-8 bg-black text-white hover:bg-gray-900 transition-colors cursor-pointer flex items-center justify-center">
                         <span className="text-2xl font-bold uppercase tracking-widest text-center">Join The Circuit</span>
                    </div>
                </div>

            </div>

             {/* Footer Decoration */}
             <div className="absolute bottom-0 left-0 p-2 font-bold text-[10px]">
                 RAW DATA // NO PRESERVATIVES
             </div>
        </div>
    </div>
  );
}
