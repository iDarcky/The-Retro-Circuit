'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSound } from './SoundContext';

export default function BootSequence() {
  const [stage, setStage] = useState<'INIT' | 'DROP' | 'BOOT' | 'MENU'>('INIT');
  const { playHover, playClick } = useSound();

  useEffect(() => {
    // Sequence Timings relative to component mount
    const sequence = async () => {
      // Immediate: Logo Drop
      setStage('DROP');

      // Wait for drop (1s) + slight pause
      await new Promise(r => setTimeout(r, 1500));
      setStage('BOOT');

      // "Ding" sound time + boot text
      await new Promise(r => setTimeout(r, 1500));
      setStage('MENU');
    };

    sequence();
  }, []);

  return (
    <div className="w-full h-full bg-[#8BAC0F] relative overflow-hidden flex flex-col items-center justify-center font-pixel text-[#0F380F]">

        {/* SCANLINES OVERLAY */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_1px,#0F380F_1px)] bg-[length:100%_4px]"></div>

        {/* STAGE: DROP (Nintendo Logo Style) */}
        {stage === 'DROP' && (
            <div className="animate-slideDown">
                <div className="bg-[#0F380F] text-[#8BAC0F] px-4 py-1 text-2xl tracking-widest border-4 border-[#0F380F] rounded-sm">
                    RETRO
                </div>
            </div>
        )}

        {/* STAGE: BOOT (Registered Trademark) */}
        {stage === 'BOOT' && (
             <div className="flex flex-col items-center gap-4 animate-fadeIn">
                <div className="bg-[#0F380F] text-[#8BAC0F] px-4 py-1 text-2xl tracking-widest border-4 border-[#0F380F] rounded-sm">
                    RETRO
                </div>
                <div className="text-xs tracking-wider animate-pulse">
                    CIRCUIT ®
                </div>
            </div>
        )}

        {/* STAGE: MENU */}
        {stage === 'MENU' && (
            <div className="w-full px-4 space-y-4 animate-fadeIn flex flex-col h-full justify-center">

                <div className="text-center mb-4">
                     <h2 className="text-lg font-bold tracking-tighter">THE CIRCUIT</h2>
                     <div className="h-1 w-full bg-[#0F380F] mt-1"></div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-4">
                    <Link href="/console"
                          className="block w-full border-4 border-[#0F380F] bg-[#8BAC0F] py-4 text-center hover:bg-[#0F380F] hover:text-[#8BAC0F] transition-colors cursor-pointer group shadow-[4px_4px_0_rgba(15,56,15,0.4)]"
                          onMouseEnter={playHover}
                          onClick={playClick}
                    >
                        <div className="flex items-center justify-center gap-2">
                             <span className="text-xl">►</span>
                             <span className="text-xl font-bold tracking-widest">CONSOLES</span>
                        </div>
                    </Link>

                    <Link href="/arena"
                          className="block w-full border-4 border-[#0F380F] bg-[#8BAC0F] py-4 text-center hover:bg-[#0F380F] hover:text-[#8BAC0F] transition-colors cursor-pointer group shadow-[4px_4px_0_rgba(15,56,15,0.4)]"
                          onMouseEnter={playHover}
                          onClick={playClick}
                    >
                        <div className="flex items-center justify-center gap-2">
                             <span className="text-xl">►</span>
                             <span className="text-xl font-bold tracking-widest">VS MODE</span>
                        </div>
                    </Link>
                </div>

                <div className="text-right text-[8px] opacity-60 pb-2">
                    v1.0.4
                </div>
            </div>
        )}
    </div>
  );
}
