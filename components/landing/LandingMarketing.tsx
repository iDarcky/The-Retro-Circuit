import React from 'react';
import Link from 'next/link';
import { ArrowRight, Box } from 'lucide-react';

export default function LandingMarketing() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

        {/* Simple Header */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div className="font-bold text-xl text-blue-400">RC.</div>
            <nav className="flex gap-6 text-sm text-slate-400">
                <a href="#" className="hover:text-white">Features</a>
                <a href="#" className="hover:text-white">Documentation</a>
                <a href="#" className="hover:text-white">Blog</a>
            </nav>
        </div>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                    Every console.<br/>
                    <span className="text-blue-500">One database.</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 max-w-lg">
                    The Retro Circuit is the developer-first platform for gaming history. Access technical specifications, release data, and performance metrics via our GraphQL API.
                </p>
                <div className="flex gap-4">
                    <Link href="/console" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 group">
                        BROWSE CONSOLES <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                        READ DOCS
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800">
                    <p className="text-sm text-slate-500 mb-2 font-mono">TRUSTED BY ENTHUSIASTS AT</p>
                    <div className="flex gap-6 text-slate-600 font-bold">
                        <span>IGN</span>
                        <span>KOTAKU</span>
                        <span>POLYGON</span>
                    </div>
                </div>
            </div>

            {/* Code Snippet / Visual */}
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20"></div>
                <div className="relative bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-2xl">
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
{`{
  "console": "PlayStation 2",
  "manufacturer": "Sony",
  "specs": {
    "cpu": "Emotion Engine @ 294 MHz",
    "gpu": "Graphics Synthesizer @ 147 MHz",
    "ram": "32 MB RDRAM",
    "storage": "Memory Card (8MB)"
  },
  "sales": "155 Million"
}`}
                    </pre>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-blue-600 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
                    <Box size={24} />
                    <div>
                        <div className="text-xs font-bold opacity-80">DATABASE SIZE</div>
                        <div className="font-bold">142 SYSTEMS</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
}
