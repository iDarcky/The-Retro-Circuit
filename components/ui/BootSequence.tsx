'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSound } from './SoundContext';

export default function BootSequence() {
  const [stage, setStage] = useState<'INIT' | 'DROP' | 'BOOT' | 'MENU'>('INIT');
  const { playHover, playClick } = useSound();

  useEffect(() => {
    // Sequence Timings
    const sequence = async () => {
      // Wait for "Cartridge Insert" animation (controlled by parent Gameboy) to finish roughly
      await new Promise(r => setTimeout(r, 2500));
      setStage('DROP');

      // Logo Drop duration
      await new Promise(r => setTimeout(r, 2000));
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
             <div className="flex flex-col items-center gap-4">
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
            <div className="w-full px-6 space-y-6 animate-fadeIn">

                <div className="text-center mb-8">
                     <h2 className="text-lg font-bold tracking-tighter">THE CIRCUIT</h2>
                     <div className="h-1 w-full bg-[#0F380F] mt-1"></div>
                </div>

                <div className="space-y-4">
                    <Link href="/console"
                          className="block w-full border-2 border-[#0F380F] p-2 text-center hover:bg-[#0F380F] hover:text-[#8BAC0F] transition-colors cursor-pointer group"
                          onMouseEnter={playHover}
                          onClick={playClick}
                    >
                        <span className="group-hover:hidden">► CONSOLES</span>
                        <span className="hidden group-hover:inline">► OPEN VAULT</span>
                    </Link>

                    <Link href="/arena"
                          className="block w-full border-2 border-[#0F380F] p-2 text-center hover:bg-[#0F380F] hover:text-[#8BAC0F] transition-colors cursor-pointer group"
                          onMouseEnter={playHover}
                          onClick={playClick}
                    >
                        <span className="group-hover:hidden">► VS MODE</span>
                        <span className="hidden group-hover:inline">► FIGHT</span>
                    </Link>
                </div>

                <div className="absolute bottom-2 right-2 text-[8px] opacity-60">
                    v1.0.4
                </div>
            </div>
        )}
    </div>
  );
}
