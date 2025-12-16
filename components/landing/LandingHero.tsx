import React from 'react';
import Link from 'next/link';

export default function LandingHero() {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col relative overflow-hidden">

        {/* Nav */}
        <nav className="p-6 flex justify-between items-center z-10">
            <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full"></div>
                RetroCircuit
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                <a href="#" className="hover:text-black">Products</a>
                <a href="#" className="hover:text-black">Resources</a>
                <a href="#" className="hover:text-black">Company</a>
                <a href="#" className="hover:text-black">Pricing</a>
            </div>
            <div className="flex gap-4">
                <button className="text-sm font-medium">Log in</button>
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800">Sign up</button>
            </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 mt-[-4rem]">
            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold mb-6 text-gray-600 border border-gray-200">
                v2.0 is now live — See what's new
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-br from-black to-gray-600 pb-2">
                The modern standard for retro analytics.
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">
                Comprehensive data for over 200 gaming systems. Compare specs, track market value, and explore history with our powerful API and dashboard.
            </p>
            <div className="flex gap-4">
                <Link href="/console" className="bg-black text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-black/20">
                    Start Browsing
                </Link>
                <button className="bg-white text-black border border-gray-200 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors">
                    View Demo
                </button>
            </div>

            <div className="mt-12 flex items-center gap-8 opacity-50 grayscale">
                <div className="font-bold text-xl">SONY</div>
                <div className="font-bold text-xl">NINTENDO</div>
                <div className="font-bold text-xl">SEGA</div>
                <div className="font-bold text-xl">MICROSOFT</div>
            </div>
        </div>

        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-purple-200/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/50 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-0"></div>

    </div>
  );
}
