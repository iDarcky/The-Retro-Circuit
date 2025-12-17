import React from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Grid } from 'lucide-react';
import { createClient } from '../../lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  // Fetch count of consoles
  const { count } = await supabase.from('consoles').select('*', { count: 'exact', head: true });

  return (
    <div className="min-h-screen bg-retro-dark text-retro-neon font-mono selection:bg-retro-pink selection:text-white border-[16px] border-retro-dark overflow-x-hidden flex flex-col">

      {/* Marquee Banner */}
      <div className="bg-retro-pink text-black overflow-hidden py-2 font-bold text-lg border-b-4 border-black">
        <div className="whitespace-nowrap animate-marquee">
            /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING /// /// SYSTEM ONLINE /// WELCOME TO THE VAULT /// DATABASE LOADING ///
        </div>
      </div>

      {/* Main Grid Layout - Swiss Style 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 border-l-2 border-retro-grid min-h-[calc(100vh-200px)]">

        {/* Left Column (Hero / Database) - 7/12 columns */}
        <div className="col-span-1 md:col-span-7 flex flex-col border-r-2 border-retro-grid">

            {/* Top Hero Section */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-retro-dark relative">
                <div className="absolute top-4 right-4 text-xs text-gray-500">
                    EST. 2024<br/>ARCHIVE_V1.0
                </div>

                <div className="mt-12">
                    <h1 className="text-7xl md:text-[7rem] font-black text-white leading-[0.85] tracking-tighter mix-blend-difference mb-8">
                        DATA<br/>
                        BASE
                    </h1>
                    <p className="text-xl font-bold text-gray-400 border-l-4 border-retro-pink pl-6 py-2">
                        COMPREHENSIVE SPECIFICATIONS FOR<br/>VIDEO GAME CONSOLES.
                    </p>
                </div>

                <div className="flex flex-col gap-6 mt-16 md:mt-24">
                    {/* Specific Button Design from Screenshot 2 */}
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

            {/* Bottom "Latest" Box (Placeholder for future) */}
            <div className="h-[250px] border-t-2 border-retro-grid bg-black/50 p-8 flex flex-col justify-center">
                <h3 className="text-retro-blue font-bold text-xl mb-2">LATEST_ADDITIONS</h3>
                <div className="flex gap-4 opacity-50">
                    <div className="w-32 h-20 bg-retro-grid/50 animate-pulse"></div>
                    <div className="w-32 h-20 bg-retro-grid/50 animate-pulse delay-75"></div>
                    <div className="w-32 h-20 bg-retro-grid/50 animate-pulse delay-150"></div>
                </div>
            </div>

        </div>

        {/* Right Column (Menu Stack) - 5/12 columns */}
        <div className="col-span-1 md:col-span-5 flex flex-col">

            {/* Block 1: VS MODE */}
            <Link href="/arena" className="h-[200px] bg-retro-neon text-black p-8 border-b-2 border-black flex flex-col justify-between hover:bg-white transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <h3 className="text-4xl font-black tracking-tighter">VS MODE</h3>
                    <span className="font-bold text-xs border border-black px-2 py-1">[COMPARE]</span>
                </div>
                <ArrowUpRight size={48} className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2 group-hover:-translate-y-2" />
            </Link>

            {/* Block 2: NEWS */}
            <Link href="/news" className="h-[200px] bg-retro-blue text-black p-8 border-b-2 border-black flex flex-col justify-between hover:bg-white transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <h3 className="text-4xl font-black tracking-tighter">NEWS</h3>
                    <span className="font-bold text-xs border border-black px-2 py-1">[READ]</span>
                </div>
            </Link>

            {/* Block 3: JOIN - Fills remaining space */}
            <Link href="/login" className="flex-1 min-h-[200px] bg-black text-white p-8 flex flex-col justify-center items-center hover:bg-retro-pink hover:text-black transition-colors group text-center">
                <h3 className="text-3xl font-bold tracking-widest group-hover:scale-110 transition-transform">
                    JOIN THE CIRCUIT
                </h3>
            </Link>

        </div>

      </div>

    </div>
  );
}
