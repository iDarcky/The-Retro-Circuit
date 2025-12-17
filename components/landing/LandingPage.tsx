import React from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Cpu, Box, Grid } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-retro-dark text-retro-neon font-mono selection:bg-retro-pink selection:text-white border-[16px] border-retro-dark overflow-x-hidden flex flex-col">

      {/*
          NOTE: Navigation is now handled globally by DesktopHeader (Brutalist Style)
      */}

      {/* Marquee Banner (Moved to top as requested) */}
      <div className="bg-retro-pink text-black overflow-hidden py-2 font-bold text-lg border-b-4 border-black">
        <div className="whitespace-nowrap animate-marquee">
            /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING /// /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING ///
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 border-l-2 border-retro-grid">

        {/* Left Column (Hero Text) */}
        <div className="col-span-1 md:col-span-8 p-8 md:p-16 flex flex-col justify-between border-r-2 border-retro-grid relative min-h-[600px]">
            <div className="absolute top-4 right-4 text-xs text-gray-500">
                SYS_TIME: {new Date().toLocaleTimeString()}
            </div>

            <div className="mt-12">
                <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mix-blend-difference mb-8">
                    HARDWARE<br/>
                    <span className="text-retro-neon">SPECS</span><br/>
                    UNLEASHED
                </h1>
                <p className="text-xl md:text-2xl max-w-2xl font-bold text-gray-400 border-l-4 border-retro-pink pl-6 py-2 bg-retro-grid/10">
                    No fluff. No marketing jargon. Just raw technical specifications and historical data for over 200 gaming systems.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-16">
                <Link href="/console" className="bg-white text-black text-xl font-bold px-8 py-6 flex items-center justify-between gap-8 hover:bg-retro-blue hover:scale-[1.02] transition-all border-4 border-black shadow-[8px_8px_0_#ff00ff]">
                    BROWSE DATABASE
                    <ArrowDownLeft size={32} />
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Grid size={16} />
                    <span>204 SYSTEMS INDEXED</span>
                </div>
            </div>
        </div>

        {/* Right Column (Stats/Visuals) */}
        <div className="col-span-1 md:col-span-4 bg-black flex flex-col">
            <div className="h-1/3 border-b-2 border-retro-grid p-8 flex flex-col justify-center hover:bg-retro-grid/20 transition-colors group cursor-pointer min-h-[200px]">
                <Cpu size={48} className="text-retro-blue mb-4 group-hover:animate-spin" />
                <h3 className="text-2xl font-bold text-white mb-2">CPU ARCHITECTURE</h3>
                <p className="text-xs text-gray-500">Compare clock speeds, bit-widths, and instruction sets across generations.</p>
            </div>
            <div className="h-1/3 border-b-2 border-retro-grid p-8 flex flex-col justify-center hover:bg-retro-grid/20 transition-colors group cursor-pointer min-h-[200px]">
                <Box size={48} className="text-retro-pink mb-4 group-hover:animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">3D RENDERING</h3>
                <p className="text-xs text-gray-500">Analyze polygon counts, fill rates, and texture capabilities.</p>
            </div>
            <div className="h-1/3 p-8 flex flex-col justify-center bg-retro-neon text-black min-h-[200px]">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-4xl font-black">VS<br/>MODE</h3>
                    <ArrowUpRight size={48} />
                </div>
                <p className="font-bold text-sm">HEAD-TO-HEAD COMPARISON ENGINE</p>
                <Link href="/arena" className="mt-4 underline decoration-4 underline-offset-4 hover:text-white">LAUNCH MODULE &rarr;</Link>
            </div>
        </div>

      </div>

    </div>
  );
}
