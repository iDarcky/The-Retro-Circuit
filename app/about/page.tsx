import { siteConfig } from '../../config/site';
import { ArrowRight, Mail, Github, Linkedin, Database, Layout, Shield, Globe, Monitor, Code } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'System Manifesto | The Retro Circuit',
  description: 'Operational manual, system specifications, and operator data.',
};

export default function AboutPage() {
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-violet-500/30 selection:text-white pb-24">
      
      {/* 1. HERO HEADER */}
      <header className="px-6 md:px-12 pt-24 pb-16 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto w-full">

           {/* Metadata Row */}
           <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-emerald-500/80 mb-8 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                 System Online
              </span>
              <span className="text-zinc-600">//</span>
              <span>Firmware: {siteConfig.version}</span>
              <span className="text-zinc-600">//</span>
              <span>EST: {siteConfig.est}</span>
           </div>

           {/* Title */}
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-pixel text-white leading-none tracking-tighter mb-8">
              THE RETRO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">CIRCUIT //</span>
           </h1>

        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* LEFT COLUMN (Mission & Operator) */}
        <div className="lg:col-span-7 flex flex-col gap-24">

            {/* 2. MISSION / SIGNAL NOISE RATIO */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                   <span className="font-mono text-xs text-violet-500 border border-violet-500/30 px-2 py-0.5 bg-violet-500/5">[ 01 ]</span>
                   <h2 className="font-mono text-sm tracking-widest text-zinc-400 uppercase">Signal Noise Ratio</h2>
                </div>

                <div className="space-y-8">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-white">
                        The retro handheld market is a labyrinth of fragmented data. Variants, revisions, and silent upgrades create static in the signal.
                    </p>
                    <div className="pl-6 border-l-2 border-violet-500">
                        <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                            In a sea of subjective noise, we provide the raw signal. <br />
                            <span className="text-white font-medium">No feelings. Just data.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. OPERATOR LOG (Swiss Identity Card) */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                   <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 03 ]</span>
                   <h2 className="font-mono text-sm tracking-widest text-zinc-400 uppercase">Operator Log</h2>
                </div>

                <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                         <Shield size={64} strokeWidth={1} />
                    </div>

                    {/* Avatar Placeholder */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="font-pixel text-2xl text-zinc-700 group-hover:text-white transition-colors">OP</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-6 relative z-10">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl text-white font-bold tracking-tight uppercase">Product Lead</h3>
                                <span className="font-mono text-xs text-emerald-500 border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5">ADMIN_ACCESS</span>
                            </div>
                            <div className="h-px w-full bg-white/10 mb-4"></div>
                            <p className="font-mono text-sm text-zinc-400 leading-relaxed max-w-lg">
                                Built to solve the chaos of handheld specifications. This project serves as both a public utility for the retro gaming community and a demonstration of modern full-stack architecture.
                            </p>
                        </div>

                        <div className="font-mono text-xs text-zinc-500 flex items-center gap-2">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                             CURRENT_OBJECTIVE: DATA_EXPANSION
                        </div>
                    </div>
                </div>
            </section>

        </div>

        {/* RIGHT COLUMN (Architecture & Actions) */}
        <div className="lg:col-span-5 flex flex-col gap-24">

            {/* 4. SYSTEM ARCHITECTURE (Clean Data Table) */}
            <section>
                 <div className="flex items-center gap-4 mb-8">
                   <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 02 ]</span>
                   <h2 className="font-mono text-sm tracking-widest text-zinc-400 uppercase">System Architecture</h2>
                </div>

                <div className="border-t border-white/10">
                    <ArchitectureRow label="Core Framework" value="Next.js 16 (App Router)" icon={<Monitor size={14} />} />
                    <ArchitectureRow label="Server Components" value="React 19" icon={<Code size={14} />} />
                    <ArchitectureRow label="Data Layer" value="Supabase (PostgreSQL)" icon={<Database size={14} />} />
                    <ArchitectureRow label="UI Engine" value="Tailwind CSS" icon={<Layout size={14} />} />
                    <ArchitectureRow label="Type Safety" value="TypeScript (Strict)" icon={<Shield size={14} />} />
                    <ArchitectureRow label="Deployment" value="Vercel Edge Network" icon={<Globe size={14} />} />
                </div>
            </section>

             {/* 5. ACTIONS (Relevant Links) */}
             <section>
                 <div className="flex items-center gap-4 mb-8">
                   <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 04 ]</span>
                   <h2 className="font-mono text-sm tracking-widest text-zinc-400 uppercase">Relevant Links</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <ActionCard
                        href={siteConfig.links.email}
                        label="Open Comms"
                        sublabel="Contact via Email"
                        icon={<Mail size={18} />}
                    />
                     <ActionCard
                        href={siteConfig.links.github}
                        label="View Source"
                        sublabel="GitHub Repository"
                        icon={<Github size={18} />}
                        external
                    />
                     <ActionCard
                        href={siteConfig.links.linkedin}
                        label="Connect"
                        sublabel="LinkedIn Profile"
                        icon={<Linkedin size={18} />}
                        external
                    />
                </div>
            </section>

        </div>

      </div>

    </div>
  );
}

function ArchitectureRow({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/10 group hover:bg-white/[0.02] transition-colors px-2 -mx-2">
            <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                {icon}
                <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
            </div>
            <span className="font-mono text-xs text-zinc-300 group-hover:text-white transition-colors text-right">{value}</span>
        </div>
    );
}

function ActionCard({ href, label, sublabel, icon, external }: { href: string, label: string, sublabel: string, icon: React.ReactNode, external?: boolean }) {
    const className = "group block border border-white/10 bg-white/[0.02] p-4 hover:bg-white/5 transition-all hover:border-violet-500/30 relative overflow-hidden";
    const content = (
        <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-violet-500/50 transition-colors">
                    {icon}
                </div>
                <div>
                    <div className="text-white font-medium text-sm group-hover:text-violet-400 transition-colors">{label}</div>
                    <div className="text-zinc-500 text-xs font-mono">{sublabel}</div>
                </div>
            </div>
            <ArrowRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {content}
        </Link>
    );
}
