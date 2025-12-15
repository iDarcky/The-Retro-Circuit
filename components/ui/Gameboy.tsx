'use client';

import { useState, useEffect } from 'react';
import BootSequence from './BootSequence';

export default function Gameboy() {
  const [stage, setStage] = useState<'INSERT' | 'PLAY'>('INSERT');

  useEffect(() => {
    // Start Animation Sequence
    // 1. Initial State: Side view, Cartridge Hovering (handled by CSS 'INSERT' class)

    // 2. Trigger Action:
    //    - Cartridge drops IN
    //    - Device rotates to FRONT
    const t1 = setTimeout(() => {
        setStage('PLAY');
    }, 800); // Wait 0.8s before starting the rotation/insert sync

    return () => clearTimeout(t1);
  }, []);

  return (
    // Increased scale and container size for "Way Bigger" feel
    <div className="relative w-full h-[80vh] flex items-center justify-center perspective-[2000px] overflow-visible scale-125 md:scale-150 origin-center">

        {/* 3D CONTAINER */}
        <div className={`
            relative w-[360px] h-[600px] transition-transform duration-[2000ms] ease-[cubic-bezier(0.25,1,0.5,1)] transform-style-3d
            ${stage === 'INSERT' ? 'rotate-y-[-60deg] translate-x-[-50px]' : 'rotate-y-0 translate-x-0'}
        `}>

            {/* --- CARTRIDGE (Animated) --- */}
            <div className={`
                absolute top-[-200px] left-1/2 ml-[-100px] w-[200px] h-[220px] bg-gray-700 rounded-t-lg z-0
                shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-4 border-gray-600
                transition-transform duration-[1500ms] ease-out delay-500 transform-style-3d
                ${stage === 'INSERT' ? 'translate-y-0' : 'translate-y-[280px]'}
            `}>
                <div className="absolute top-4 left-4 right-4 h-32 bg-gray-800 rounded flex items-center justify-center border-2 border-gray-900">
                    <div className="font-pixel text-xs text-gray-500 tracking-widest">SYSTEM DISK</div>
                </div>
                {/* Cartridge Grip Lines */}
                <div className="absolute bottom-4 left-0 right-0 flex flex-col gap-2 items-center opacity-30">
                     <div className="w-40 h-1.5 bg-black"></div>
                     <div className="w-40 h-1.5 bg-black"></div>
                     <div className="w-40 h-1.5 bg-black"></div>
                </div>
            </div>


            {/* --- GAMEBOY CHASSIS (FRONT) --- */}
            <div className="absolute inset-0 bg-retro-dark border-4 border-retro-grid rounded-[20px_20px_50px_20px] shadow-[0_0_50px_rgba(0,255,157,0.2)] flex flex-col items-center p-8 z-10 backface-hidden bg-[#1a1a2e]">

                {/* Top Border Detail */}
                <div className="w-full h-4 border-b-2 border-retro-grid/30 mb-6 flex justify-between px-2">
                    <div className="w-1.5 h-full bg-retro-grid/20"></div>
                    <div className="w-1.5 h-full bg-retro-grid/20"></div>
                </div>

                {/* SCREEN BEZEL */}
                <div className="w-full aspect-[10/9] bg-[#444] rounded-t-lg rounded-b-[50px] p-8 relative shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">

                    {/* "BATTERY" LED */}
                    <div className="absolute top-[40%] left-3 flex flex-col gap-1 items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-retro-neon/80 animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]"></div>
                        <span className="text-[6px] text-[#888] font-mono tracking-widest">PWR</span>
                    </div>

                    {/* LCD SCREEN (Content) */}
                    <div className="w-full h-full bg-[#8BAC0F] border-4 border-[#333] shadow-inner overflow-hidden relative">
                         {/* Only show boot sequence after rotation starts to finish */}
                         <div className={`transition-opacity duration-1000 delay-[2000ms] ${stage === 'PLAY' ? 'opacity-100' : 'opacity-0'}`}>
                            <BootSequence />
                         </div>
                    </div>

                    <div className="text-center mt-3 font-pixel text-xs text-gray-500 tracking-[0.3em]">
                        DOT MATRIX WITH STEREO SOUND
                    </div>
                </div>

                {/* LOGO (Unbranded) */}
                <div className="my-8">
                    <span className="font-pixel text-retro-neon text-2xl tracking-widest italic drop-shadow-[0_0_8px_rgba(0,255,157,0.5)] opacity-80">
                        The Circuit
                    </span>
                </div>

                {/* CONTROLS */}
                <div className="w-full flex-1 flex justify-between items-end pb-8 px-4">

                    {/* D-PAD */}
                    <div className="w-28 h-28 relative">
                        <div className="absolute top-9 left-0 w-28 h-10 bg-black rounded shadow-[0_4px_0_#111]"></div>
                        <div className="absolute top-0 left-9 w-10 h-28 bg-black rounded shadow-[0_4px_0_#111]"></div>
                        {/* Center Divot */}
                        <div className="absolute top-9 left-9 w-10 h-10 bg-black/90 rounded-full radial-gradient"></div>
                    </div>

                    {/* A/B BUTTONS */}
                    <div className="w-32 h-20 relative rotate-[-25deg] mb-6">
                        <div className="absolute right-0 top-2 w-12 h-12 bg-[#b91c4d] rounded-full shadow-[0_4px_0_#7a1233] hover:mt-1 hover:shadow-none transition-all cursor-pointer flex items-center justify-center active:scale-95 border-b border-black/20">
                            <span className="text-[10px] text-black/40 font-bold mt-1 ml-1">A</span>
                        </div>
                        <div className="absolute left-0 top-6 w-12 h-12 bg-[#b91c4d] rounded-full shadow-[0_4px_0_#7a1233] hover:mt-1 hover:shadow-none transition-all cursor-pointer flex items-center justify-center active:scale-95 border-b border-black/20">
                             <span className="text-[10px] text-black/40 font-bold mt-1 ml-1">B</span>
                        </div>
                    </div>
                </div>

                {/* SELECT / START */}
                <div className="flex gap-6 mb-10">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-14 h-3.5 bg-gray-600 rounded-full border border-gray-700 rotate-[-25deg] shadow-[0_2px_0_#333]"></div>
                        <span className="text-[8px] tracking-widest font-mono text-gray-500 mt-2">SELECT</span>
                    </div>
                     <div className="flex flex-col items-center gap-1">
                        <div className="w-14 h-3.5 bg-gray-600 rounded-full border border-gray-700 rotate-[-25deg] shadow-[0_2px_0_#333]"></div>
                        <span className="text-[8px] tracking-widest font-mono text-gray-500 mt-2">START</span>
                    </div>
                </div>

                {/* SPEAKER GRILL */}
                <div className="absolute bottom-8 right-8 flex gap-3 -rotate-[25deg]">
                    <div className="w-2.5 h-20 bg-black/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                    <div className="w-2.5 h-20 bg-black/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                    <div className="w-2.5 h-20 bg-black/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                    <div className="w-2.5 h-20 bg-black/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                    <div className="w-2.5 h-20 bg-black/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                    <div className="w-2.5 h-20 bg-black/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                </div>

            </div>

             {/* --- GAMEBOY CHASSIS (SIDE/BACK HINT) --- */}
             <div className="absolute inset-0 bg-[#151525] rounded-[20px] transform translate-z-[-50px] w-[360px] h-[600px]"></div>
             <div className="absolute top-0 right-0 bottom-0 w-[50px] bg-[#11111f] transform rotate-y-[90deg] origin-right border-l border-white/5"></div>
             <div className="absolute top-0 left-0 bottom-0 w-[50px] bg-[#222233] transform rotate-y-[-90deg] origin-left border-l border-retro-grid/20"></div>

        </div>
    </div>
  );
}
