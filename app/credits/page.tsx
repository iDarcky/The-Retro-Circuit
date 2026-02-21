import { siteConfig } from '../../config/site';

export const metadata = {
  title: 'Credits & Inspiration | The Retro Circuit',
  description: 'Source attribution and project inspiration.',
};

export default function CreditsPage() {
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-violet-500/30 selection:text-white pb-24 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

      {/* 1. HERO HEADER */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 border-b border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto w-full">

           {/* Metadata Pill - Violet Variant */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-900/30 bg-violet-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-violet-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
               System Online // Attribution Protocol // v{siteConfig.version}
           </div>

           {/* Title */}
           <h1 className="text-5xl md:text-6xl lg:text-7xl font-pixel text-white leading-none tracking-tighter mb-8">
              CREDITS & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">INSPIRATION</span><span className="text-violet-500 animate-pulse">_</span>
           </h1>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-16 relative z-10">

          {/* Section 1: Tribute */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
             <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-violet-500 border border-violet-500/30 px-2 py-0.5 bg-violet-500/5">[ 01 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Mission</h2>
            </div>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
              <p>
                This project is a tribute to the history of handheld gaming. It exists to preserve technical specifications and provide a clean, data-driven interface for enthusiasts.
              </p>
              <div className="pl-6 border-l-2 border-violet-500/50">
                  <p className="text-zinc-400 font-light italic">
                    Inspired by the raw utility of industrial terminals and the precision of Swiss design.
                  </p>
              </div>
            </div>
          </section>

          {/* Section 2: Pending Data */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 02 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Data Fragments</h2>
            </div>

            <div className="bg-white/[0.02] border border-dashed border-zinc-800 p-12 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-shine pointer-events-none" />

                 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 mb-6 group-hover:border-violet-500/30 transition-colors">
                    <span className="font-mono text-zinc-600 group-hover:text-violet-400 text-lg">?</span>
                 </div>

                 <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest mb-2">
                    [ ADDITIONAL ATTRIBUTIONS PENDING ]
                 </p>
                 <p className="text-zinc-600 text-xs font-mono">
                    System awaiting operator input...
                 </p>
            </div>
          </section>

      </div>
    </div>
  );
}
