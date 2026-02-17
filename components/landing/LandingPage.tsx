import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Search, Cpu, Database } from 'lucide-react';
import { fetchLatestConsoles, fetchRealWorldLatest } from '../../lib/api/latest';
import { fetchConsoleList } from '../../lib/api/consoles';
import QuickCompare from './QuickCompare';

export default async function LandingPage() {
  const latestConsoles = await fetchLatestConsoles(3);
  const upcomingConsoles = await fetchRealWorldLatest(3);
  const allConsoles = await fetchConsoleList();

  return (
    <div className="bg-bg-primary min-h-screen font-sans selection:bg-color-primary selection:text-black">

      {/* HERO SECTION */}
      <section className="relative w-full max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none hidden lg:block">
           <div className="w-64 h-64 border border-text-muted rounded-full border-dashed animate-spin-slow"></div>
        </div>

        <div className="max-w-4xl">
           <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-text-primary mb-6 leading-[0.9]">
             THE RETRO <br/>
             <span className="text-color-primary">CIRCUIT.</span>
           </h1>
           <p className="text-lg md:text-2xl text-text-secondary max-w-2xl leading-relaxed mb-12 font-light">
             The definitive archive of handheld gaming history. <br/>
             Precision data for the modern enthusiast.
           </p>

           <div className="flex flex-wrap gap-4">
              <Link href="/about" className="group flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-mono text-sm uppercase tracking-widest">
                 <span className="w-2 h-2 bg-color-primary rounded-full group-hover:animate-pulse"></span>
                 System Protocol
              </Link>
           </div>
        </div>
      </section>

      {/* NAVIGATION COMMAND CENTER */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CARD 1: VAULT */}
            <Link href="/consoles" className="group relative h-[300px] bg-bg-secondary border border-border-subtle hover:border-color-primary transition-all duration-300 p-8 flex flex-col justify-between overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Database size={120} />
               </div>
               <div>
                  <span className="font-mono text-color-primary text-xs tracking-[0.2em] mb-2 block">01 // INDEX</span>
                  <h3 className="text-3xl font-bold text-text-primary">CONSOLE VAULT</h3>
               </div>
               <div className="flex items-center gap-2 text-text-secondary group-hover:text-text-primary transition-colors">
                  <span className="font-mono text-sm">ACCESS DATABASE</span>
                  <ArrowUpRight size={16} />
               </div>
            </Link>

            {/* CARD 2: FABRICATORS */}
            <Link href="/fabricators" className="group relative h-[300px] bg-bg-secondary border border-border-subtle hover:border-color-secondary transition-all duration-300 p-8 flex flex-col justify-between overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cpu size={120} />
               </div>
               <div>
                  <span className="font-mono text-color-secondary text-xs tracking-[0.2em] mb-2 block">02 // MANUFACTURERS</span>
                  <h3 className="text-3xl font-bold text-text-primary">FABRICATORS</h3>
               </div>
               <div className="flex items-center gap-2 text-text-secondary group-hover:text-text-primary transition-colors">
                  <span className="font-mono text-sm">BROWSE ENTITIES</span>
                  <ArrowUpRight size={16} />
               </div>
            </Link>

            {/* CARD 3: FINDER */}
            <Link href="/finder" className="group relative h-[300px] bg-color-primary text-black hover:bg-white transition-all duration-300 p-8 flex flex-col justify-between overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Search size={120} />
               </div>
               <div>
                  <span className="font-mono text-black/60 text-xs tracking-[0.2em] mb-2 block">03 // ANALYSIS</span>
                  <h3 className="text-3xl font-bold">FINDER TOOL</h3>
               </div>
               <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-sm font-bold">START QUERY</span>
                  <ArrowUpRight size={16} />
               </div>
            </Link>
        </div>
      </section>

      {/* LATEST TRANSMISSIONS */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mb-32">
         <div className="flex items-end justify-between mb-12 border-b border-border-subtle pb-6">
            <h2 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight">
              LATEST <span className="font-bold">ARRIVALS</span>
            </h2>
            <span className="hidden md:block font-mono text-text-muted text-xs">
               SYNC STATUS: ONLINE
            </span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestConsoles.map((console) => (
               <ConsoleCard key={console.id} data={console} label="NEW ENTRY" />
            ))}
         </div>
      </section>

      {/* UPCOMING RELEASES */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mb-32">
         <div className="flex items-end justify-between mb-12 border-b border-border-subtle pb-6">
            <h2 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight">
              MARKET <span className="font-bold">WATCH</span>
            </h2>
            <Link href="/consoles" className="font-mono text-color-primary text-xs hover:underline">
               VIEW ALL RELEASES
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingConsoles.map((console) => (
               <ConsoleCard key={console.id} data={console} label="MARKET RELEASE" accentColor="secondary" />
            ))}
         </div>
      </section>

      {/* QUICK COMPARE WIDGET */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mb-24">
         <div className="bg-bg-card border border-border-subtle p-8 md:p-12 rounded-2xl relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-1">
                  <h2 className="text-3xl font-bold text-text-primary mb-4">QUICK COMPARE</h2>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                     Directly compare technical specifications of two devices. Analyze CPU architecture, display density, and physical dimensions.
                  </p>
                  <div className="flex items-center gap-2 text-color-primary font-mono text-xs uppercase tracking-widest">
                     <span className="w-2 h-2 bg-color-primary rounded-full animate-pulse"></span>
                     Ready for Input
                  </div>
               </div>

               <div className="lg:col-span-2">
                  <QuickCompare consoles={allConsoles} />
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}

// Sub-component for Console Cards to keep main clean
function ConsoleCard({ data, label, accentColor = 'primary' }: { data: any, label: string, accentColor?: 'primary' | 'secondary' }) {
   const isPrimary = accentColor === 'primary';
   const borderColorClass = isPrimary ? 'group-hover:border-color-primary' : 'group-hover:border-color-secondary';
   const textColorClass = isPrimary ? 'text-color-primary' : 'text-color-secondary';

   return (
      <Link href={`/consoles/${data.slug}`} className={`group bg-bg-secondary border border-border-subtle ${borderColorClass} transition-all duration-300 flex flex-col`}>
         {/* Image Header */}
         <div className="relative h-[220px] bg-bg-tertiary flex items-center justify-center p-6 overflow-hidden">
             {data.image_url ? (
                <Image
                  src={data.image_url}
                  alt={data.name}
                  width={400}
                  height={300}
                  className="w-auto h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
             ) : (
                <span className="font-mono text-text-muted text-4xl">?</span>
             )}

             <div className="absolute top-4 left-4">
                <span className={`bg-black/80 backdrop-blur-md ${textColorClass} border border-border-subtle text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-widest`}>
                   {label}
                </span>
             </div>
         </div>

         {/* Content Body */}
         <div className="p-6 flex flex-col flex-grow">
            <div className="mb-4">
               <span className="text-text-muted font-mono text-xs uppercase tracking-widest block mb-1">
                  {data.manufacturer?.name || 'UNKNOWN'}
               </span>
               <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-white transition-colors">
                  {data.name}
               </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-border-subtle">
               <div>
                  <span className="block text-[10px] text-text-muted uppercase font-mono mb-1">Display</span>
                  <span className="block text-sm text-text-secondary font-mono">
                     {data.specs?.screen_size_inch ? `${data.specs.screen_size_inch}"` : 'N/A'}
                  </span>
               </div>
               <div>
                  <span className="block text-[10px] text-text-muted uppercase font-mono mb-1">Chipset</span>
                  <span className="block text-sm text-text-secondary font-mono truncate">
                     {data.specs?.cpu_model || data.specs?.cpu_architecture || 'N/A'}
                  </span>
               </div>
            </div>
         </div>
      </Link>
   );
}
