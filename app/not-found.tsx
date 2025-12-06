'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "> INITIATING SEARCH PROTOCOL...",
      "> SCANNING SECTOR 7G... [FAILED]",
      "> PINGING MAINFRAME... [NO RESPONSE]",
      "> ERROR: DATA PACKET CORRUPTED.",
      "> SUGGESTION: RETURN TO BASE."
    ];

    let delay = 0;
    
    sequence.forEach((line) => {
        // Randomize typing speed slightly for realism
        delay += 300 + Math.random() * 400;
        
        setTimeout(() => {
            setLogs(prev => [...prev, line]);
        }, delay);
    });

  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      {/* 404 Header with Glitch Effect */}
      <div 
        className="font-pixel text-8xl text-retro-pink mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] glitch-hover cursor-help transition-all duration-100 select-none"
        title="SYSTEM_ERROR_404"
      >
        404
      </div>
      
      <h2 className="font-pixel text-2xl text-retro-pink mb-8 tracking-widest animate-[neon-pulse_3s_ease-in-out_infinite]">SIGNAL LOST</h2>
      
      {/* Terminal Log Output */}
      <div className="p-6 border-2 border-retro-grid bg-black/80 mb-10 w-full max-w-md shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Scanline decoration inside terminal */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,157,0.1)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
        
        <div className="font-mono text-sm text-retro-neon space-y-2 text-left relative z-10 min-h-[140px]">
            {logs.map((log, i) => (
                <div key={i} className="animate-fadeIn">
                    {log}
                </div>
            ))}
            <div className="animate-pulse text-retro-blue mt-2">_</div>
        </div>
      </div>

      <Link href="/">
        <Button variant="primary">RETURN TO DASHBOARD</Button>
      </Link>
    </div>
  );
}