'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminHubClient() {
    const [sessionId, setSessionId] = useState('INIT...');

    useEffect(() => {
        setSessionId(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn min-h-screen flex flex-col">

            {/* HEADER */}
            <header className="mb-12 pt-8 border-b border-white pb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-8xl font-pixel text-white leading-none tracking-tighter mix-blend-difference">
                            ADMIN_HUB
                        </h1>
                        <p className="font-mono text-xs md:text-sm text-gray-500 mt-2 tracking-widest uppercase">
                            // SYSTEM COMMAND CENTER // v2.0.0
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="font-mono text-xs text-emerald-500">SYSTEM ONLINE</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* GRID NAV */}
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">

                {/* 1. CONSOLES */}
                <Link href="/admin/consoles" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-white transition-colors">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors">01 // DATABASE</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-white transition-colors duration-300">
                            CONSOLES
                        </h2>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <span className="font-mono text-[10px] text-gray-600 group-hover:text-primary transition-colors">
                            [ACCESS INDEX]
                        </span>
                    </div>
                    {/* Hover Effect: Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                </Link>

                {/* 2. FABRICATORS */}
                <Link href="/admin/fabricators" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-white transition-colors">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors">02 // MANUFACTURERS</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-white transition-colors duration-300">
                            FABRICATORS
                        </h2>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <span className="font-mono text-[10px] text-gray-600 group-hover:text-primary transition-colors">
                            [MANAGE ENTITIES]
                        </span>
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                </Link>

                {/* 3. ROADMAP */}
                <Link href="/admin/roadmap" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-white transition-colors">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors">03 // PLANNING</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-white transition-colors duration-300">
                            ROADMAP
                        </h2>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <span className="font-mono text-[10px] text-gray-600 group-hover:text-primary transition-colors">
                            [VIEW MISSIONS]
                        </span>
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                </Link>

                {/* 4. BROADCAST / SIGNALS */}
                <Link href="/admin/signals" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-white transition-colors">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors">04 // BROADCAST</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-white transition-colors duration-300">
                            SIGNALS
                        </h2>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <span className="font-mono text-[10px] text-gray-600 group-hover:text-primary transition-colors">
                            [TRANSMIT]
                        </span>
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                </Link>

                {/* 5. REVIEWS */}
                 <Link href="/admin/reviews" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-white transition-colors">
                     <div className="absolute top-4 left-4 z-10">
                        <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors">05 // ANALYSIS</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-white transition-colors duration-300">
                            REVIEWS
                        </h2>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <span className="font-mono text-[10px] text-gray-600 group-hover:text-primary transition-colors">
                            [PUBLISH]
                        </span>
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                </Link>

                {/* 6. NEWS */}
                <Link href="/admin/news" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-white transition-colors">
                     <div className="absolute top-4 left-4 z-10">
                        <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors">06 // PRESS</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-white transition-colors duration-300">
                            NEWS
                        </h2>
                    </div>
                    <div className="absolute bottom-4 right-4">
                         <span className="font-mono text-[10px] text-gray-600 group-hover:text-primary transition-colors">
                            [UPDATE]
                        </span>
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                </Link>

            </main>

            {/* FOOTER STATUS */}
            <footer className="mt-auto pt-12 pb-4 border-t border-border-subtle">
                <div className="flex justify-between font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                    <div>
                        MEMORY: 64KB OK
                    </div>
                    <div>
                        SESSION ID: {sessionId}
                    </div>
                </div>
            </footer>
        </div>
    );
}
