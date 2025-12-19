'use client';

import { Press_Start_2P, JetBrains_Mono, Share_Tech_Mono } from "next/font/google";

// Load fonts locally within the error boundary to ensure they are available even if RootLayout fails
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-press-start'
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: '--font-mono'
});

const shareTechMono = Share_Tech_Mono({
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
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${jetBrainsMono.variable} ${shareTechMono.variable} bg-bg-primary text-primary font-mono h-screen flex flex-col items-center justify-center p-4 overflow-hidden`}>

        {/* CRT Scanline Effect */}
        <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

        {/* Main Error Container */}
        <div className="relative border-4 border-accent p-8 md:p-12 max-w-3xl w-full bg-black/80 shadow-[0_0_50px_rgba(255,0,255,0.2)]">

            {/* Header / System Halt */}
            <div className="text-center border-b-2 border-accent/50 pb-8 mb-8">
                <h1 className="font-pixel text-4xl md:text-6xl text-accent mb-8 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    SYSTEM HALT
                </h1>
                <p className="text-secondary text-lg">
                    CRITICAL ERROR DETECTED // CORE DUMP INITIATED
                </p>
            </div>

            {/* Error Details */}
            <div className="flex flex-col gap-6 mb-12">
                <div className="bg-black border border-border-normal p-4 font-mono text-sm text-gray-400">
                    <p className="text-primary text-xs uppercase mb-2">Error Diagnostic:</p>
                    <div className="h-[120px] overflow-y-auto custom-scrollbar p-2 bg-bg-primary/50">
                        <pre className="font-mono text-sm text-accent/90 whitespace-pre-wrap break-words">
                            {error.message || 'Unknown system failure'}
                        </pre>
                        {error.digest && (
                            <p className="mt-4 text-xs text-gray-500">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
                <button
                    onClick={() => reset()}
                    className="group relative px-8 py-4 bg-transparent border-2 border-secondary text-secondary font-pixel text-sm uppercase tracking-widest hover:bg-secondary hover:text-bg-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,255,157,0.2)] hover:shadow-[0_0_40px_rgba(0,255,157,0.6)]"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <span className="animate-pulse">▶</span> REBOOT SYSTEM
                    </span>
                </button>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-accent"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-accent"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-accent"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-accent"></div>
        </div>

      </body>
    </html>
  );
}
