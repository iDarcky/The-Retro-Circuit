'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SwissButton from '@/components/console/swiss/SwissButton';

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
        className="font-pixel text-8xl text-accent mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] glitch-hover cursor-help transition-all duration-100 select-none"
        title="SYSTEM_ERROR_404"
      >
        404
      </div>
      
      <h2 className="font-pixel text-2xl text-accent mb-8 tracking-widest animate-[neon-pulse_3s_ease-in-out_infinite]">SIGNAL LOST</h2>
      
      {/* Terminal Log Output */}
      <div
        role="status"
        aria-live="polite"
        className="p-6 border-2 border-border-normal bg-black/80 mb-10 w-full max-w-md relative overflow-hidden"
      >

        <div className="font-mono text-sm text-emerald-400 space-y-2 text-left relative z-10 min-h-[140px]">
            {logs.map((log, i) => (
                <div key={i} className="animate-fadeIn">
                    {log}
                </div>
            ))}
            <div className="animate-pulse text-primary mt-2">_</div>
        </div>
      </div>

      <Link href="/">
        <SwissButton variant="primary">RETURN TO DASHBOARD</SwissButton>
      </Link>
    </div>
  );
}