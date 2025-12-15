'use client';

import { useState, useEffect } from 'react';
import BootSequence from './BootSequence';

export default function Gameboy() {
  const [stage, setStage] = useState<'INSERT' | 'PLAY'>('INSERT');

  useEffect(() => {
    const t1 = setTimeout(() => {
        setStage('PLAY');
    }, 1200);

    return () => clearTimeout(t1);
  }, []);

  return (
    // Main Stage
    <div className="relative w-full h-[80vh] flex items-center justify-center overflow-visible scale-125 md:scale-150 origin-center"
         style={{ perspective: '2000px' }}
    >

        {/* 3D Pivot Group */}
        <div
            className="relative w-[360px] h-[600px]"
            style={{
                transformStyle: 'preserve-3d',
                transform: stage === 'INSERT'
                    ? 'rotateY(-60deg) translateX(-50px)'
                    : 'rotateY(0deg) translateX(0px)',
                transition: 'transform 2000ms cubic-bezier(0.25, 1, 0.5, 1)'
            }}
        >

            {/* --- CARTRIDGE (Animated) --- */}
            <div
                className="absolute top-[-200px] left-1/2 ml-[-100px] w-[200px] h-[220px] bg-gray-700 rounded-t-lg border-4 border-gray-600 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                style={{
                    transform: stage === 'INSERT'
                        ? 'translateZ(-50px) translateY(0px)'
                        : 'translateZ(-50px) translateY(280px)',
                    transition: 'transform 1500ms ease-out 500ms',
                    transformStyle: 'preserve-3d'
                }}
            >
                <div className="absolute top-4 left-4 right-4 h-32 bg-gray-800 rounded flex items-center justify-center border-2 border-gray-900">
                    <div className="font-pixel text-xs text-gray-500 tracking-widest">SYSTEM DISK</div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex flex-col gap-2 items-center opacity-30">
                     <div className="w-40 h-1.5 bg-black"></div>
                     <div className="w-40 h-1.5 bg-black"></div>
                     <div className="w-40 h-1.5 bg-black"></div>
                </div>
            </div>


            {/* --- GAMEBOY CHASSIS (FRONT) --- */}
            <div
                className="absolute inset-0 bg-retro-dark border-4 border-retro-grid rounded-[20px_20px_50px_20px] shadow-[0_0_50px_rgba(0,255,157,0.2)] flex flex-col items-center p-6 bg-[#1a1a2e]"
                style={{
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(25px)',
                }}
            >

                {/* Top Border Detail */}
                <div className="w-full h-3 border-b-2 border-retro-grid/30 mb-4 flex justify-between px-2">
                    <div className="w-1.5 h-full bg-retro-grid/20"></div>
                    <div className="w-1.5 h-full bg-retro-grid/20"></div>
                </div>

                {/* SCREEN BEZEL */}
                <div className="w-full aspect-[10/9] bg-[#444] rounded-t-lg rounded-b-[40px] p-6 relative shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">

                    {/* "BATTERY" LED */}
                    <div className="absolute top-[40%] left-2 flex flex-col gap-1 items-center">
                        <div className="w-2 h-2 rounded-full bg-retro-neon/80 animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]"></div>
                        <span className="text-[5px] text-[#888] font-mono tracking-widest">PWR</span>
                    </div>

                    {/* LCD SCREEN */}
                    <div className="w-full h-full bg-[#8BAC0F] border-4 border-[#333] shadow-inner overflow-hidden relative">
                         <div className={`transition-opacity duration-1000 delay-[2000ms] ${stage === 'PLAY' ? 'opacity-100' : 'opacity-0'}`}>
                            <BootSequence />
                         </div>
                    </div>

                    <div className="text-center mt-2 font-pixel text-[10px] text-gray-500 tracking-[0.2em]">
                        DOT MATRIX WITH STEREO SOUND
                    </div>
                </div>

                {/* LOGO (Compact) */}
                <div className="my-4">
                    <span className="font-pixel text-retro-neon text-xl tracking-widest italic drop-shadow-[0_0_8px_rgba(0,255,157,0.5)] opacity-80">
                        The Circuit
                    </span>
                </div>

                {/* CONTROLS (Compact) */}
                <div className="w-full flex-1 flex justify-between items-start pt-2 px-2 relative z-10">
                    {/* D-PAD */}
                    <div className="w-24 h-24 relative top-2">
                        <div className="absolute top-8 left-0 w-24 h-8 bg-black rounded shadow-[0_4px_0_#111]"></div>
                        <div className="absolute top-0 left-8 w-8 h-24 bg-black rounded shadow-[0_4px_0_#111]"></div>
                        <div className="absolute top-8 left-8 w-8 h-8 bg-black/90 rounded-full radial-gradient"></div>
                    </div>

                    {/* A/B BUTTONS */}
                    <div className="w-28 h-16 relative rotate-[-25deg] top-4 right-2">
                        <div className="absolute right-0 top-1 w-10 h-10 bg-[#b91c4d] rounded-full shadow-[0_3px_0_#7a1233] hover:mt-1 hover:shadow-none transition-all cursor-pointer flex items-center justify-center active:scale-95 border-b border-black/20">
                            <span className="text-[9px] text-black/40 font-bold mt-1 ml-1">A</span>
                        </div>
                        <div className="absolute left-0 top-5 w-10 h-10 bg-[#b91c4d] rounded-full shadow-[0_3px_0_#7a1233] hover:mt-1 hover:shadow-none transition-all cursor-pointer flex items-center justify-center active:scale-95 border-b border-black/20">
                             <span className="text-[9px] text-black/40 font-bold mt-1 ml-1">B</span>
                        </div>
                    </div>
                </div>

                {/* SELECT / START (Moved to absolute bottom to save flow space) */}
                <div className="absolute bottom-12 flex gap-4 z-10">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-3 bg-gray-600 rounded-full border border-gray-700 rotate-[-25deg] shadow-[0_2px_0_#333]"></div>
                        <span className="text-[6px] tracking-widest font-mono text-gray-500 mt-1">SELECT</span>
                    </div>
                     <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-3 bg-gray-600 rounded-full border border-gray-700 rotate-[-25deg] shadow-[0_2px_0_#333]"></div>
                        <span className="text-[6px] tracking-widest font-mono text-gray-500 mt-1">START</span>
                    </div>
                </div>

                {/* SPEAKER GRILL (Adjusted Position) */}
                <div className="absolute bottom-6 right-6 flex gap-2 -rotate-[25deg] z-0 opacity-60">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-2 h-16 bg-black/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                    ))}
                </div>

            </div>

             {/* --- GAMEBOY CHASSIS (BACK) --- */}
             <div
                className="absolute inset-0 bg-[#151525] rounded-[20px]"
                style={{
                    transform: 'translateZ(-25px) rotateY(180deg)',
                    backfaceVisibility: 'hidden'
                }}
             ></div>

             {/* --- SIDE PANELS --- */}
             <div
                className="absolute top-0 right-0 bottom-0 w-[50px] bg-[#11111f] border-l border-white/5"
                style={{
                    transformOrigin: 'right center',
                    transform: 'rotateY(90deg) translateZ(25px)'
                }}
             ></div>

             <div
                className="absolute top-0 left-0 bottom-0 w-[50px] bg-[#222233] border-l border-retro-grid/20"
                style={{
                    transformOrigin: 'left center',
                    transform: 'rotateY(-90deg) translateZ(25px)'
                }}
             ></div>

        </div>
    </div>
  );
}
