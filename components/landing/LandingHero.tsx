import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function LandingHero() {
  return (
    <div className="w-full min-h-screen bg-retro-dark flex flex-col items-center justify-center relative overflow-hidden">

        {/* Background Grid Effect */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
             style={{
                 backgroundImage: 'linear-gradient(rgba(42, 42, 64, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(42, 42, 64, 0.5) 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
             }}>
        </div>

        {/* Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-retro-dark via-transparent to-transparent z-0"></div>

        <div className="z-10 text-center flex flex-col items-center gap-8 p-4">

            <div className="scale-150 mb-8">
                {/* Assuming Logo component takes className or similar, or just render it */}
                <Logo />
            </div>

            <h1 className="text-4xl md:text-6xl font-pixel text-white tracking-widest drop-shadow-[0_0_15px_rgba(0,255,157,0.5)]">
                THE CIRCUIT
            </h1>

            <p className="max-w-md text-gray-400 font-mono text-sm md:text-base leading-relaxed">
                The definitive archive of retro gaming hardware, fabrication history, and technical specifications.
            </p>

            <div className="flex gap-6 mt-8">
                <Link href="/console" className="px-8 py-3 bg-retro-neon text-black font-bold font-mono hover:bg-white transition-colors skew-x-[-10deg]">
                    <span className="skew-x-[10deg] inline-block">BROWSE ARCHIVE</span>
                </Link>
                <Link href="/arena" className="px-8 py-3 border border-retro-neon text-retro-neon font-bold font-mono hover:bg-retro-neon/10 transition-colors skew-x-[-10deg]">
                     <span className="skew-x-[10deg] inline-block">COMPARE SPECS</span>
                </Link>
            </div>

        </div>

        {/* Footer Text */}
        <div className="absolute bottom-8 text-xs text-gray-600 font-mono tracking-widest">
            EST. 2024 // SYSTEM READY
        </div>

    </div>
  );
}
