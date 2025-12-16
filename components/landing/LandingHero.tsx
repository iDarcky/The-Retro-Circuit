import React from 'react';
import Link from 'next/link';
import { ArrowRight, Database, Cpu, Zap, Search } from 'lucide-react';

export default function LandingHero() {
  return (
    <div className="min-h-screen bg-retro-dark text-white font-sans flex flex-col relative overflow-hidden selection:bg-retro-neon selection:text-black">

        {/* Modern Sticky Nav (Glassmorphism) */}
        <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-retro-dark/70 border-b border-white/5">
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-tr from-retro-neon to-retro-blue rounded-lg shadow-[0_0_15px_rgba(0,255,157,0.3)] group-hover:shadow-[0_0_25px_rgba(0,255,157,0.5)] transition-all duration-300"></div>
                <span className="font-mono font-bold text-lg tracking-wider text-white group-hover:text-retro-neon transition-colors">RETRO_CIRCUIT</span>
            </div>

            <div className="hidden md:flex gap-8 text-sm font-mono tracking-widest text-gray-400">
                <Link href="/console" className="hover:text-retro-neon transition-colors flex items-center gap-2">
                    <Database size={14} /> CONSOLES
                </Link>
                <Link href="/fabricators" className="hover:text-retro-blue transition-colors flex items-center gap-2">
                    <Cpu size={14} /> FABRICATORS
                </Link>
                <Link href="/arena" className="hover:text-retro-pink transition-colors flex items-center gap-2">
                    <Zap size={14} /> VS MODE
                </Link>
            </div>

            <div className="flex gap-4">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Search size={20} />
                </button>
                <Link href="/login" className="hidden md:block bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full font-mono text-xs hover:border-retro-neon hover:text-retro-neon transition-all">
                    ACCESS_TERMINAL
                </Link>
            </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 mt-[-4rem]">

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-mono mb-8 text-retro-neon hover:bg-white/10 transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-retro-neon animate-pulse"></span>
                SYSTEM V2.0 ONLINE
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter max-w-5xl mb-6 text-white drop-shadow-[0_0_50px_rgba(0,255,157,0.1)]">
                PRESERVE THE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-retro-neon via-retro-blue to-retro-pink">
                    GOLDEN AGE
                </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-light">
                The definitive archive of gaming history. Analyze hardware specs, track market value, and explore the lineage of over 200 consoles.
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <Link href="/console" className="group bg-retro-neon text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2">
                    ENTER VAULT
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/arena" className="group bg-transparent text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2">
                    COMPARE SPECS
                    <Zap size={20} className="text-gray-500 group-hover:text-retro-pink transition-colors" />
                </Link>
            </div>

            {/* Tech Stack / Manufacturers */}
            <div className="mt-20 border-t border-white/5 pt-10 w-full max-w-4xl">
                <p className="font-mono text-xs text-gray-600 mb-6 tracking-[0.2em]">INDEXING HARDWARE FROM</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="font-bold text-xl hover:text-retro-blue transition-colors cursor-default">NINTENDO</span>
                    <span className="font-bold text-xl hover:text-blue-500 transition-colors cursor-default">SEGA</span>
                    <span className="font-bold text-xl hover:text-white transition-colors cursor-default">SONY</span>
                    <span className="font-bold text-xl hover:text-retro-neon transition-colors cursor-default">MICROSOFT</span>
                    <span className="font-bold text-xl hover:text-retro-pink transition-colors cursor-default">ATARI</span>
                </div>
            </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-retro-blue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-retro-neon/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-0 pointer-events-none"></div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

    </div>
  );
}
