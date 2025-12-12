'use client';

import { useEffect } from 'react';
import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";
import "../styles/globals.css";

// Load fonts explicitly as this replaces RootLayout
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-press-start'
});

const shareTech = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-share-tech'
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${shareTech.variable} bg-[#0f0f1b] text-white font-mono min-h-screen flex flex-col items-center justify-center overflow-hidden`}>
        {/* CRT Overlay Effects - Recreating minimal styles just in case globals fail, but using classes from globals.css */}
        <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
        <div className="crt-flicker fixed inset-0 pointer-events-none z-40"></div>

        <div className="relative z-50 max-w-2xl w-full p-8 text-center flex flex-col items-center">
            {/* Title */}
            <h1 className="font-pixel text-4xl md:text-6xl text-[#ff00ff] mb-8 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                SYSTEM HALT
            </h1>

            {/* Main Message Box */}
            <div className="border-2 border-[#2a2a40] bg-black/80 p-6 mb-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-left w-full max-w-lg relative overflow-hidden">
                {/* Inner decorative scanline */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,157,0.1)_1px,transparent_1px)] bg-[size:100%_4px]"></div>

                <div className="relative z-10 space-y-3 font-mono">
                    <p className="text-[#00ff9d] text-lg">
                        <span className="animate-pulse mr-2">_</span>The mainframe has encountered an unrecoverable error.
                    </p>
                    <p className="text-[#00ff9d] text-lg">
                        {">"} SYSTEM_INTEGRITY: COMPROMISED
                    </p>

                    {/* Technical Error Details */}
                    <div className="mt-6 pt-4 border-t border-[#2a2a40]">
                        <p className="text-[#00ffff] text-xs uppercase mb-2">Error Diagnostic:</p>
                        <pre className="font-mono text-sm text-[#ff00ff]/90 whitespace-pre-wrap break-words">
                            {error.message || "Unknown System Failure"}
                        </pre>
                        {error.digest && (
                            <p className="text-xs text-gray-500 mt-2 font-mono">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reboot Button */}
            <button
                onClick={() => reset()}
                className="
                    font-mono font-bold py-3 px-8
                    uppercase tracking-wider
                    transition-all duration-200
                    transform border-2 relative
                    overflow-hidden group focus:outline-none
                    active:scale-95
                    border-[#00ff9d] text-[#00ff9d]
                    hover:bg-[#00ff9d] hover:text-[#0f0f1b]
                    shadow-[0_0_15px_rgba(0,255,157,0.5)]
                "
            >
                REBOOT SYSTEM
            </button>
        </div>
      </body>
    </html>
  );
}
