import React from 'react';
import Link from 'next/link';
import { Share2, Bookmark, ChevronRight } from 'lucide-react';

export default function LandingMagazine() {
  return (
    <div className="min-h-screen bg-retro-dark text-white font-sans">

      {/* Magazine Sticky Header */}
      <header className="sticky top-0 z-50 bg-retro-dark/95 backdrop-blur border-b border-gray-800">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-retro-blue to-retro-pink h-1 w-full"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
                <h1 className="font-pixel text-2xl md:text-3xl tracking-tighter text-white">
                    RETRO<span className="text-retro-neon">CIRCUIT</span>
                </h1>
                <span className="text-xs font-mono text-gray-400 hidden md:inline">ISSUE #01 // 2024</span>
            </div>

            <nav className="hidden md:flex gap-8 font-mono text-sm tracking-wide">
                <Link href="/news" className="text-white border-b-2 border-retro-neon pb-1">LATEST</Link>
                <Link href="/console" className="text-gray-400 hover:text-white hover:border-b-2 hover:border-retro-blue pb-1 transition-all">REVIEWS</Link>
                <Link href="/arena" className="text-gray-400 hover:text-white hover:border-b-2 hover:border-retro-pink pb-1 transition-all">FEATURES</Link>
                <Link href="/fabricators" className="text-gray-400 hover:text-white pb-1 transition-colors">HISTORY</Link>
            </nav>

            <button className="bg-white text-black font-bold px-6 py-2 rounded-sm font-mono text-xs hover:bg-gray-200 transition-colors">
                SUBSCRIBE
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

            {/* Main Story */}
            <div className="lg:col-span-8 group cursor-pointer">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-6 border border-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <span className="bg-retro-neon text-black text-xs font-bold px-2 py-1 mb-4 inline-block">COVER STORY</span>
                        <h2 className="text-4xl md:text-6xl font-bold font-pixel leading-tight mb-4 group-hover:text-retro-neon transition-colors">
                            THE 16-BIT WARS REVISITED
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl font-serif">
                            Decades later, we crunch the numbers to see which console truly had the superior hardware. The answer might surprise you.
                        </p>
                    </div>
                    {/* Placeholder for dynamic image */}
                    <div className="w-full h-full bg-gray-900 group-hover:scale-105 transition-transform duration-700"></div>
                </div>
            </div>

            {/* Sidebar Stories */}
            <div className="lg:col-span-4 flex flex-col gap-8 border-l border-gray-800 pl-8">
                <div>
                    <span className="text-retro-pink font-mono text-xs mb-2 block">TRENDING HARDWARE</span>
                    <h3 className="text-xl font-bold hover:text-retro-pink cursor-pointer transition-colors mb-2">
                        GameCube's resurgence: Why prices are skyrocketing
                    </h3>
                    <p className="text-sm text-gray-500">Market Analysis • 5 min read</p>
                </div>
                <div className="w-full h-px bg-gray-800"></div>
                <div>
                    <span className="text-retro-blue font-mono text-xs mb-2 block">FROM THE ARCHIVE</span>
                    <h3 className="text-xl font-bold hover:text-retro-blue cursor-pointer transition-colors mb-2">
                        The lost prototypes of the Sega Saturn
                    </h3>
                    <p className="text-sm text-gray-500">History • 12 min read</p>
                </div>
                <div className="w-full h-px bg-gray-800"></div>
                <div className="bg-gray-900 p-6 rounded border border-gray-800">
                    <h4 className="font-pixel text-lg mb-4 text-white">WEEKLY NEWSLETTER</h4>
                    <p className="text-sm text-gray-400 mb-4">Get the latest retro market data delivered to your inbox.</p>
                    <input type="email" placeholder="Your email address" className="w-full bg-black border border-gray-700 p-2 text-sm text-white mb-2 focus:border-retro-neon outline-none" />
                    <button className="w-full bg-retro-blue text-black font-bold text-xs py-2 hover:bg-white transition-colors">JOIN</button>
                </div>
            </div>
        </div>

        {/* Featured Section */}
        <div className="border-t-4 border-white pt-12">
            <div className="flex justify-between items-end mb-8">
                <h3 className="text-5xl font-black text-gray-800">FEATURED</h3>
                <Link href="/console" className="flex items-center gap-2 text-retro-neon font-mono text-sm hover:underline">
                    VIEW ALL CONSOLES <ChevronRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="aspect-[4/3] bg-gray-900 mb-4 relative overflow-hidden">
                            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-3 py-1 font-mono text-xs border border-gray-700">
                                SPEC_REVIEW
                            </div>
                        </div>
                        <h4 className="text-xl font-bold mb-2 group-hover:text-retro-pink transition-colors">
                            Sony PlayStation 2
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2">
                            The best-selling console of all time defined a generation with its DVD playback and massive library.
                        </p>
                        <div className="mt-4 flex gap-4 text-xs font-mono text-gray-400">
                            <span className="flex items-center gap-1"><Share2 size={12} /> SHARE</span>
                            <span className="flex items-center gap-1"><Bookmark size={12} /> SAVE</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}
