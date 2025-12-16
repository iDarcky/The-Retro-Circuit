import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function LandingBrutalist() {
  return (
    <div className="min-h-screen bg-[#ffdd00] font-mono text-black p-4 border-[12px] border-black overflow-hidden relative">

      {/* Decorative background grids */}
      <div className="absolute top-0 right-0 w-1/3 h-full border-l-[4px] border-black bg-[#ff4400]"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 border-t-[4px] border-black bg-[#00aaff]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center border-b-[4px] border-black pb-4 mb-12 bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">The Circuit</h1>
              <button className="bg-black text-white px-6 py-2 font-bold hover:bg-white hover:text-black border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(128,128,128,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                  ENTER_ARCHIVE
              </button>
          </header>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Box 1 */}
               <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                   <h2 className="text-5xl font-black mb-4 uppercase leading-[0.8]">Hardware<br/>Specs</h2>
                   <p className="font-bold text-lg mb-8 border-l-[8px] border-[#ff4400] pl-4">
                       Raw data. No filters. Pure silicon history.
                   </p>
                   <ArrowUpRight className="w-16 h-16 border-[3px] border-black rounded-full p-2 bg-[#00ff9d]" />
               </div>

               {/* Box 2 */}
               <div className="bg-black text-[#00ff9d] border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] transition-all cursor-pointer">
                   <h2 className="text-5xl font-black mb-4 uppercase leading-[0.8]">Compare<br/>Systems</h2>
                   <div className="border-[2px] border-[#00ff9d] p-4 mb-4 font-bold text-center rotate-2">
                       FIGHT!
                   </div>
                   <p className="font-bold text-lg">
                       Side-by-side technical warfare.
                   </p>
               </div>
          </div>

          {/* Scrolling Marquee */}
          <div className="mt-12 border-[4px] border-black bg-white overflow-hidden py-4 rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="whitespace-nowrap animate-marquee font-black text-2xl uppercase">
                  Nintendo • Sega • Sony • Microsoft • Atari • NEC • SNK • Bandai • Panasonic •
                  Nintendo • Sega • Sony • Microsoft • Atari • NEC • SNK • Bandai • Panasonic •
              </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center font-bold">
               <div className="bg-[#ff4400] text-white border-[4px] border-black py-12 text-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">1980s</div>
               <div className="bg-[#00ff9d] text-black border-[4px] border-black py-12 text-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -mt-4">1990s</div>
               <div className="bg-[#00aaff] text-black border-[4px] border-black py-12 text-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">2000s</div>
          </div>

      </div>
    </div>
  );
}
