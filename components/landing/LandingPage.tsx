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
          <h1 className="text-[4vw] md:text-[5vw] leading-[1.3] font-pixel font-bold tracking-tighter uppercase mb-8 text-white">
            Welcome to<br/>
            the <span className="text-accent">Circuit_</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-border-subtle pt-8">
            <div className="col-span-12 md:col-span-6">
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted block mb-2">SYSTEM STATUS</span>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-color-success rounded-full animate-pulse"></div>
                 <span className="font-mono text-sm">ONLINE // V.2.0</span>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 flex justify-start md:justify-end">
               <Link
                 href="/consoles"
                 className="inline-block bg-accent text-inverse font-pixel text-xs md:text-sm px-6 py-4 hover:bg-white transition-colors uppercase tracking-widest"
               >
                 Browse The Library
               </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. FEATURED SECTIONS (VS MODE ONLY) */}
      <section className="px-6 md:px-12 py-12 border-b border-border-subtle">
        <div className="max-w-[1800px] mx-auto">
           <div className="border border-border-subtle bg-bg-primary p-8 md:p-12">
                 <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                           <Swords className="w-12 h-12 text-color-primary stroke-1" />
                           <h2 className="text-4xl font-bold tracking-tighter">VS MODE</h2>
                        </div>
                        <p className="text-text-secondary text-lg font-light mb-8 max-w-xl">
                           Directly compare technical specifications. Analyze CPU clock speeds, display density, and physical dimensions side-by-side.
                        </p>
                        <Link href="/arena" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest hover:text-color-primary transition-colors border-b border-text-muted hover:border-color-primary pb-1">
                           Enter Arena <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="w-full lg:w-1/2 border border-border-subtle bg-bg-secondary/50 p-1">
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
