import React from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Terminal, Cpu, Box, Grid } from 'lucide-react';

export default function LandingBrutalist() {
  return (
    <div className="min-h-screen bg-retro-dark text-retro-neon font-mono selection:bg-retro-pink selection:text-white border-[16px] border-retro-dark overflow-x-hidden">

      {/* Brutalist Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-retro-dark border-b-4 border-retro-neon p-4 flex justify-between items-center shadow-[0_10px_0_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-retro-neon flex items-center justify-center border-2 border-black">
                <Terminal size={24} className="text-black" />
            </div>
            <div className="flex flex-col">
                <span className="font-pixel text-xl leading-none text-white">RETRO_CIRCUIT</span>
                <span className="text-xs bg-retro-pink text-black px-1 mt-1 w-max font-bold">RAW DATA ARCHIVE</span>
            </div>
        </div>

        <div className="hidden md:flex gap-8">
            <Link href="/console" className="uppercase font-bold hover:bg-retro-neon hover:text-black px-2 transition-colors">
                [DIR_01] CONSOLES
            </Link>
            <Link href="/fabricators" className="uppercase font-bold hover:bg-retro-blue hover:text-black px-2 transition-colors">
                [DIR_02] FABRICATORS
            </Link>
            <Link href="/arena" className="uppercase font-bold hover:bg-retro-pink hover:text-black px-2 transition-colors">
                [EXEC] VS_MODE
            </Link>
        </div>

        <Link href="/login" className="border-2 border-retro-neon px-6 py-2 font-bold hover:bg-retro-neon hover:text-black transition-all shadow-[4px_4px_0_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_white]">
            INIT_SESSION
        </Link>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[calc(100vh-100px)] border-l-2 border-retro-grid">

        {/* Left Column (Hero Text) */}
        <div className="col-span-1 md:col-span-8 p-8 md:p-16 flex flex-col justify-between border-r-2 border-retro-grid relative">
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
            <div className="h-1/3 border-b-2 border-retro-grid p-8 flex flex-col justify-center hover:bg-retro-grid/20 transition-colors group cursor-pointer">
                <Cpu size={48} className="text-retro-blue mb-4 group-hover:animate-spin" />
                <h3 className="text-2xl font-bold text-white mb-2">CPU ARCHITECTURE</h3>
                <p className="text-xs text-gray-500">Compare clock speeds, bit-widths, and instruction sets across generations.</p>
            </div>
            <div className="h-1/3 border-b-2 border-retro-grid p-8 flex flex-col justify-center hover:bg-retro-grid/20 transition-colors group cursor-pointer">
                <Box size={48} className="text-retro-pink mb-4 group-hover:animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">3D RENDERING</h3>
                <p className="text-xs text-gray-500">Analyze polygon counts, fill rates, and texture capabilities.</p>
            </div>
            <div className="h-1/3 p-8 flex flex-col justify-center bg-retro-neon text-black">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-4xl font-black">VS<br/>MODE</h3>
                    <ArrowUpRight size={48} />
                </div>
                <p className="font-bold text-sm">HEAD-TO-HEAD COMPARISON ENGINE</p>
                <Link href="/arena" className="mt-4 underline decoration-4 underline-offset-4 hover:text-white">LAUNCH MODULE &rarr;</Link>
            </div>
        </div>

      </div>

      {/* Marquee Footer */}
      <div className="bg-retro-pink text-black overflow-hidden py-3 font-bold text-xl border-y-4 border-black">
        <div className="whitespace-nowrap animate-marquee">
            NINTENDO // SEGA // SONY // MICROSOFT // ATARI // SNK // NEC // PANASONIC // NINTENDO // SEGA // SONY // MICROSOFT // ATARI // SNK // NEC // PANASONIC
        </div>
      </div>

    </div>
  );
}
