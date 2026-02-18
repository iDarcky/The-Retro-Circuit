import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Swords, ChevronRight } from 'lucide-react';
import { fetchLatestConsoles } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import QuickCompare from './QuickCompare';

export default async function LandingPage() {
  const latestConsoles = await fetchLatestConsoles(5);
  // Removed unused upcomingConsoles
  const allConsoles = await fetchConsoleList();

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary selection:bg-color-primary selection:text-white pb-32">

      {/* 1. HERO - TYPOGRAPHIC STATEMENT */}
      <header className="px-6 md:px-12 pt-32 pb-24 border-b border-border-subtle">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[5vw] md:text-[6vw] leading-[1.3] font-pixel font-bold tracking-tighter uppercase mb-8 text-white max-w-5xl mx-auto">
              Welcome to<br/>
              the <span className="text-color-primary">Circuit_</span>
            </h1>

            <Link
              href="/consoles"
              className="inline-flex items-center gap-3 bg-color-primary text-white font-mono text-sm md:text-base px-8 py-4 hover:bg-white hover:text-black transition-all uppercase tracking-widest border border-transparent hover:border-white"
            >
              Browse The Library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-t border-border-subtle pt-12 mt-16 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted">SYSTEM STATUS</span>
              <div className="flex items-center justify-center md:justify-start gap-2">
                 <div className="w-2 h-2 bg-color-success rounded-full animate-pulse"></div>
                 <span className="font-mono text-sm">ONLINE // V.2.0</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted">DATABASE</span>
              <span className="font-mono text-sm">{allConsoles.length} ENTRIES ARCHIVED</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted">LATEST UPDATE</span>
              <span className="font-mono text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ANALYSIS & COMPARE */}
      <section className="px-6 md:px-12 py-24 border-b border-border-subtle bg-bg-secondary/20">
        <div className="max-w-[1800px] mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-bg-secondary text-xs font-mono uppercase tracking-widest text-text-muted mb-6">
                    <Swords className="w-3 h-3" /> Analysis Tools
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">HEAD-TO-HEAD<br/>COMPARISON.</h2>
                  <p className="text-text-secondary text-lg font-light mb-8 max-w-md leading-relaxed">
                     Our arena mode allows for direct specification battles. Analyze CPU clock speeds, display density, and physical form factors in real-time.
                  </p>
                  <Link href="/arena" className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-text-primary border-b border-color-primary pb-1 hover:text-color-primary transition-colors">
                     Enter The Arena <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>

              <div className="relative">
                 {/* Decorative Grid Background */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 mask-gradient"></div>

                 <div className="relative z-10 border border-border-subtle bg-bg-primary p-6 shadow-2xl">
                    <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-color-primary"></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-color-primary"></div>
                    <QuickCompare consoles={allConsoles} />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. LATEST TICKER / DATA LIST */}
      <section className="px-6 md:px-12 py-24">
         <div className="max-w-[1800px] mx-auto">
            <div className="flex items-baseline justify-between mb-12 border-b border-border-subtle pb-4">
               <h3 className="text-2xl font-bold tracking-tight">LATEST ACQUISITIONS</h3>
               <Link href="/consoles" className="font-mono text-xs text-text-muted hover:text-text-primary uppercase tracking-widest flex items-center gap-1">
                  View Full Index <ChevronRight size={12} />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
               {latestConsoles.map((console, index) => (
                  <Link
                    key={console.id}
                    href={`/consoles/${console.slug}`}
                    className="group grid grid-cols-12 gap-4 py-6 border-b border-border-subtle hover:bg-bg-secondary/50 transition-colors items-center"
                  >
                     <div className="col-span-2 md:col-span-1 font-mono text-xs text-text-muted">
                        {(index + 1).toString().padStart(2, '0')}
                     </div>

                     <div className="col-span-3 md:col-span-2">
                        {console.image_url ? (
                           <Image
                              src={console.image_url}
                              alt={console.name}
                              width={100}
                              height={60}
                              className="w-full h-auto object-contain mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity"
                           />
                        ) : (
                           <div className="w-12 h-8 bg-border-subtle"></div>
                        )}
                     </div>

                     <div className="col-span-7 md:col-span-4">
                        <span className="block font-mono text-[10px] uppercase text-color-primary mb-1">
                           {console.manufacturer?.name}
                        </span>
                        <h4 className="text-lg font-bold tracking-tight group-hover:text-white transition-colors">
                           {console.name}
                        </h4>
                     </div>

                     <div className="col-span-6 md:col-span-3 hidden md:block">
                        <span className="block font-mono text-[10px] text-text-muted uppercase">Release</span>
                        <span className="font-mono text-sm text-text-secondary">
                           {console.specs?.release_date ? new Date(console.specs.release_date).getFullYear() : 'TBA'}
                        </span>
                     </div>

                     <div className="col-span-6 md:col-span-2 hidden md:flex justify-end">
                        <ArrowRight className="w-4 h-4 text-border-normal group-hover:text-color-primary -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
