'use client';

import { FC } from 'react';
import SwissButton from '@/components/console/swiss/SwissButton';

interface FinderLandingProps {
  onStart: () => void;
}

export const FinderLanding: FC<FinderLandingProps> = ({ onStart }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500">

      {/* HEADER SECTION (Vault Style) */}
      <div className="relative w-full py-24 md:py-32 px-6 md:px-12 border-b border-border-strong/5 overflow-hidden flex flex-col items-center text-center">
         {/* Background Effects */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-bg-primary/50 to-bg-bg-primary pointer-events-none"></div>

         <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-7xl font-pixel font-bold tracking-tighter text-text-primary uppercase drop-shadow-lg leading-tight mb-6">
                Handheld <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Finder</span><span className="text-emerald-500 animate-pulse">_</span>
            </h1>
            <p className="text-lg md:text-2xl text-zinc-400 font-light font-mono max-w-2xl mx-auto mb-12">
                Identify your perfect device. Input your preferences for nostalgia, performance, and budget to receive a calibrated recommendation.
            </p>

            <div className="flex flex-col items-center gap-4">
                <SwissButton
                    variant="primary"
                    onClick={onStart}
                    className="text-lg md:text-xl px-12 py-5 font-pixel tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1"
                >
                    INITIATE SCAN
                </SwissButton>
                <span className="text-xs font-mono text-zinc-600 tracking-[0.2em] uppercase">
                    ~2 Minute Analysis Cycle
                </span>
            </div>
         </div>
      </div>

    </div>
  );
};
