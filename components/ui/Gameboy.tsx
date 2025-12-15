'use client';

import { useState, useEffect } from 'react';
import BootSequence from './BootSequence';

export default function Gameboy() {
  const [stage, setStage] = useState<'INSERT' | 'ROTATE' | 'PLAY'>('INSERT');

  useEffect(() => {
    // 1. Start: Cartridge is outside (Side View)
    // 2. Animation: Insert Cartridge (1s)
    const t1 = setTimeout(() => {
        setStage('ROTATE');
    }, 1500);

    // 3. Animation: Rotate to Front (1s)
    const t2 = setTimeout(() => {
        setStage('PLAY');
    }, 2500);

    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-[2000px] overflow-visible">

        {/* 3D CONTAINER */}
        <div className={`
            relative w-[320px] h-[540px] transition-transform duration-1000 ease-in-out transform-style-3d
            ${stage === 'INSERT' ? 'rotate-y-[-80deg] translate-x-[-100px]' : ''}
            ${stage === 'ROTATE' ? 'rotate-y-0 translate-x-0' : ''}
            ${stage === 'PLAY' ? 'rotate-y-0 translate-x-0' : ''}
        `}>

            {/* --- CARTRIDGE (Animated) --- */}
            <div className={`
                absolute top-[-180px] left-1/2 ml-[-90px] w-[180px] h-[200px] bg-gray-700 rounded-t-lg z-0
                shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-4 border-gray-600
                transition-transform duration-1000 ease-out transform-style-3d
                ${stage === 'INSERT' ? 'translate-y-[180px]' : 'translate-y-[280px]'}
            `}>
                <div className="absolute top-4 left-4 right-4 h-32 bg-gray-800 rounded flex items-center justify-center border-2 border-gray-900">
                    <div className="font-pixel text-xs text-gray-500 tracking-widest">RETRO CIRCUIT</div>
                </div>
                {/* Cartridge Grip Lines */}
                <div className="absolute bottom-4 left-0 right-0 flex flex-col gap-1 items-center opacity-30">
                     <div className="w-32 h-1 bg-black"></div>
                     <div className="w-32 h-1 bg-black"></div>
                     <div className="w-32 h-1 bg-black"></div>
                </div>
            </div>


            {/* --- GAMEBOY CHASSIS (FRONT) --- */}
            <div className="absolute inset-0 bg-retro-dark border-4 border-retro-grid rounded-[20px_20px_40px_20px] shadow-[0_0_50px_rgba(0,255,157,0.2)] flex flex-col items-center p-6 z-10 backface-hidden bg-[#1a1a2e]">

                {/* Top Border Detail */}
                <div className="w-full h-4 border-b-2 border-retro-grid/30 mb-4 flex justify-between px-2">
                    <div className="w-1 h-full bg-retro-grid/20"></div>
                    <div className="w-1 h-full bg-retro-grid/20"></div>
                </div>

                {/* SCREEN BEZEL */}
                <div className="w-full aspect-[10/9] bg-[#555] rounded-t-lg rounded-b-[40px] p-8 relative shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">

                    {/* "BATTERY" LED */}
                    <div className="absolute top-[40%] left-2 flex flex-col gap-1 items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]"></div>
                        <span className="text-[6px] text-[#888] font-mono">BATTERY</span>
                    </div>

                    {/* LCD SCREEN (Content) */}
                    <div className="w-full h-full bg-[#8BAC0F] border-4 border-[#444] shadow-inner overflow-hidden relative">
                         <BootSequence />
                    </div>

                    <div className="text-center mt-2 font-pixel text-xs text-gray-400 tracking-[0.2em] italic">
                        NINTENDO <span className="text-[8px]">GAME BOY</span> TM
                    </div>
                </div>

                {/* LOGO */}
                <div className="my-6">
                    <span className="font-pixel text-retro-neon text-lg tracking-widest italic drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">
                        Nintendo
                    </span>
                </div>

                {/* CONTROLS */}
                <div className="w-full flex-1 flex justify-between items-end pb-8 px-2">

                    {/* D-PAD */}
                    <div className="w-24 h-24 relative">
                        <div className="absolute top-8 left-0 w-24 h-8 bg-black rounded shadow-[0_4px_0_#222]"></div>
                        <div className="absolute top-0 left-8 w-8 h-24 bg-black rounded shadow-[0_4px_0_#222]"></div>
                        {/* Center Divot */}
                        <div className="absolute top-8 left-8 w-8 h-8 bg-black/80 rounded-full radial-gradient"></div>
                    </div>

                    {/* A/B BUTTONS */}
                    <div className="w-28 h-16 relative rotate-[-25deg] mb-4">
                        <div className="absolute right-0 top-2 w-10 h-10 bg-[#8b1d3f] rounded-full shadow-[0_3px_0_#5a1025] hover:mt-1 hover:shadow-none transition-all cursor-pointer flex items-center justify-center active:scale-95">
                            <span className="text-[8px] text-black/50 font-bold mt-8 ml-8">A</span>
                        </div>
                        <div className="absolute left-0 top-2 w-10 h-10 bg-[#8b1d3f] rounded-full shadow-[0_3px_0_#5a1025] hover:mt-1 hover:shadow-none transition-all cursor-pointer flex items-center justify-center active:scale-95">
                             <span className="text-[8px] text-black/50 font-bold mt-8 ml-8">B</span>
                        </div>
                    </div>
                </div>

                {/* SELECT / START */}
                <div className="flex gap-4 mb-8">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-3 bg-gray-500 rounded-full border border-gray-600 rotate-[-25deg] shadow-[0_2px_0_#333]"></div>
                        <span className="text-[8px] tracking-widest font-mono text-gray-400 mt-1">SELECT</span>
                    </div>
                     <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-3 bg-gray-500 rounded-full border border-gray-600 rotate-[-25deg] shadow-[0_2px_0_#333]"></div>
                        <span className="text-[8px] tracking-widest font-mono text-gray-400 mt-1">START</span>
                    </div>
                </div>

                {/* SPEAKER GRILL */}
                <div className="absolute bottom-6 right-6 flex gap-2 -rotate-[25deg]">
                    <div className="w-2 h-16 bg-black/30 rounded-full shadow-inner"></div>
                    <div className="w-2 h-16 bg-black/30 rounded-full shadow-inner"></div>
                    <div className="w-2 h-16 bg-black/30 rounded-full shadow-inner"></div>
                    <div className="w-2 h-16 bg-black/30 rounded-full shadow-inner"></div>
                    <div className="w-2 h-16 bg-black/30 rounded-full shadow-inner"></div>
                </div>

            </div>

             {/* --- GAMEBOY CHASSIS (SIDE/BACK HINT) --- */}
             <div className="absolute inset-0 bg-[#151525] rounded-[20px] transform translate-z-[-40px] w-[320px] h-[540px]"></div>
             <div className="absolute top-0 right-0 bottom-0 w-[40px] bg-[#11111f] transform rotate-y-[90deg] origin-right"></div>
             <div className="absolute top-0 left-0 bottom-0 w-[40px] bg-[#222233] transform rotate-y-[-90deg] origin-left border-l border-retro-grid/20"></div>

        </div>
    </div>
  );
}
