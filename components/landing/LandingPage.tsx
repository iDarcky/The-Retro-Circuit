import React from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Grid } from 'lucide-react';
import { createClient } from '../../lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  // Fetch count of consoles
  const { count } = await supabase.from('consoles').select('*', { count: 'exact', head: true });

  return (
    // Outer Container: 16px Padding (p-4)
    <div className="min-h-screen bg-retro-dark p-4 font-mono selection:bg-retro-pink selection:text-white flex flex-col gap-4">

      {/*
          BLOCK 1: Title Box
          Height: 156px, Background: White, Border: 4px Black
      */}
      <div className="h-[156px] w-full bg-white border-4 border-black flex items-center justify-center">
        <h1 className="text-black font-pixel text-4xl md:text-6xl tracking-tight">
          RETRO CIRCUIT
        </h1>
      </div>

      {/*
          BLOCK 2: Marquee Box
          Height: 52px, Background: Pink, Border: 4px Black
      */}
      <div className="h-[52px] w-full bg-retro-pink border-4 border-black overflow-hidden flex items-center">
        <div className="whitespace-nowrap animate-marquee font-bold text-black text-lg">
          /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING /// /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING /// /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING ///
        </div>
      </div>

      {/*
          BLOCK 3: Main Content Grid (Existing Content)
          Wrapped in border-4 to match the style "Use this border everywhere"
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-4 border-black">

        {/* Left Column (Hero / Database) - 7/12 columns */}
        <div className="col-span-1 md:col-span-7 flex flex-col border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[600px] bg-retro-dark relative p-8 md:p-12 justify-between">
            <div className="absolute top-4 right-4 text-xs text-gray-500">
                EST. 2024<br/>ARCHIVE_V1.0
            </div>

            <div className="mt-12">
                <h2 className="text-7xl md:text-[7rem] font-black text-white leading-[0.85] tracking-tighter mix-blend-difference mb-8">
                    DATA<br/>
                    BASE
                </h2>
                <p className="text-xl font-bold text-gray-400 border-l-4 border-retro-pink pl-6 py-2">
                    COMPREHENSIVE SPECIFICATIONS FOR<br/>VIDEO GAME CONSOLES.
                </p>
            </div>

            <div className="flex flex-col gap-6 mt-16 md:mt-24">
                <Link href="/console" className="bg-white text-black text-2xl font-bold px-8 py-4 flex items-center justify-between gap-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black shadow-[8px_8px_0_#ff00ff]">
                    <span className="font-mono tracking-wider">BROWSE DATABASE</span>
                    <ArrowDownLeft size={32} />
                </Link>

                {/* Real Data Count */}
                <div className="flex items-center gap-4 text-lg text-gray-500 font-bold">
                    <Grid size={24} />
                    <span>{count || 0} SYSTEMS INDEXED</span>
                </div>
            </div>
        </div>

        {/* Right Column (Menu Stack) - 5/12 columns */}
        <div className="col-span-1 md:col-span-5 flex flex-col">

            {/* VS MODE */}
            <Link href="/arena" className="h-[200px] bg-retro-neon text-black p-8 border-b-4 border-black flex flex-col justify-between hover:bg-white transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <h3 className="text-4xl font-black tracking-tighter">VS MODE</h3>
                    <span className="font-bold text-xs border border-black px-2 py-1">[COMPARE]</span>
                </div>
                <ArrowUpRight size={48} className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2 group-hover:-translate-y-2" />
            </Link>

            {/* NEWS */}
            <Link href="/news" className="h-[200px] bg-retro-blue text-black p-8 border-b-4 border-black flex flex-col justify-between hover:bg-white transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <h3 className="text-4xl font-black tracking-tighter">NEWS</h3>
                    <span className="font-bold text-xs border border-black px-2 py-1">[READ]</span>
                </div>
            </Link>

            {/* JOIN */}
            <Link href="/login" className="h-[200px] bg-black text-white p-8 flex flex-col justify-center items-center hover:bg-retro-pink hover:text-black transition-colors group text-center border-b-4 md:border-b-0 border-black">
                <h3 className="text-3xl font-bold tracking-widest group-hover:scale-110 transition-transform">
                    JOIN THE CIRCUIT
                </h3>
            </Link>

            {/* FILLER (To match height if needed, or just let it flow) */}
            <div className="flex-1 bg-retro-dark"></div>

        </div>

      </div>

    </div>
  );
}
