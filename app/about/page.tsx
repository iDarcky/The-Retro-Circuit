import { siteConfig } from '../../config/site';
import { ArrowRight, Mail, Linkedin, Database, Layout, Globe, Monitor, Code } from 'lucide-react';
import Link from 'next/link';
import { getSystemVersion } from '../../app/actions/roadmap';
import EmailActionCard from '../../components/about/EmailActionCard';
import { fetchConsoleAndVariantCounts } from '../../app/actions/consoles';

export const metadata = {
  title: 'System Manifesto | The Retro Circuit',
  description: 'Operational manual, system specifications, and operator data.',
};

export default async function AboutPage() {
  const version = await getSystemVersion();
  const counts = await fetchConsoleAndVariantCounts();
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-orange-500/30 selection:text-white pb-24">
      
      {/* 1. HERO HEADER */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 border-b border-white/5 relative overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

        <div className="max-w-[1800px] mx-auto w-full relative z-10">

           {/* Metadata Row */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-900/30 bg-emerald-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-emerald-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               System Online // {version} // EST: {siteConfig.est}
           </div>

           {/* Title */}
           <h1 className="text-4xl md:text-6xl font-pixel text-white leading-none tracking-tighter mb-8">
              THE RETRO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">CIRCUIT</span><span className="text-orange-500 animate-pulse">_</span>
           </h1>

        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-x-24 gap-y-16 lg:gap-y-24 items-start">
        
        {/* 1. MISSION / SIGNAL NOISE RATIO */}
        <section className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-orange-500 border border-orange-500/30 px-2 py-0.5 bg-orange-500/5">[ 01 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-orange-500 uppercase">ORIGIN SIGNAL</h2>
            </div>

            <div className="space-y-8">
                <div className="text-lg text-zinc-300 font-light leading-relaxed space-y-6">
                    <p>The retro handheld market is a labyrinth of fragmented data. Variants, revisions, and silent upgrades create static in the signal.</p>
                    <p>The Circuit exists to cut through that. Not by cataloguing everything, but by cataloguing things correctly &mdash; with the kind of judgment that knows when two devices that share a name are actually the same product, and when they're not.</p>
                    <p>There are already solutions in this space and this isn't an attempt to replace them. It's a different take. A hub where good data, good design, and a genuine love for the hardware finally coexist.</p>
                </div>
                <div className="pl-6 border-l-2 border-orange-500">
                    <p className="text-lg text-zinc-400 font-light leading-relaxed">
                        In a sea of subjective noise, we provide the raw signal. <br />
                        <span className="text-white font-medium">No feelings. Just data.</span>
                    </p>
                </div>
            </div>
        </section>

        {/* 2. STATE OF THE BUILD */}
        <section className="lg:col-span-5">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-orange-500 border border-orange-500/30 px-2 py-0.5 bg-orange-500/5">[ 02 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-orange-500 uppercase">STATE OF THE BUILD</h2>
            </div>

            <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
                <p>
                    The Circuit is live but unfinished. Pre-Alpha means the data is growing, features are evolving, and things may occasionally break. That's the deal for now.
                </p>
                <p>
                    <span className="text-white font-medium">{counts.consoles}</span> consoles catalogued. <span className="text-white font-medium">{counts.variants}</span> hardware variants. The Console Vault is live. Arena VS is live. The Finder — the feature that answers "what should I actually buy?" — is in active development.
                </p>
                <p>
                    Signals, reviews, and editorial content are planned. The priority right now is getting the data right before building on top of it.
                </p>
                <p>
                    Everything being built, fixed, and shipped is on the public roadmap. No vague promises, just a changelog and a queue.
                </p>

                <div className="pt-4">
                    <Link
                        href="/roadmap"
                        className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-orange-500/30 transition-all px-6 py-3 font-mono text-sm uppercase tracking-widest group"
                    >
                        [ &rarr; ] VIEW PUBLIC ROADMAP
                    </Link>
                </div>
            </div>
        </section>

        {/* 3. CREDITS & ACKNOWLEDGEMENTS */}
        <section className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-orange-500 border border-orange-500/30 px-2 py-0.5 bg-orange-500/5">[ 03 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-orange-500 uppercase">CREDITS & ACKNOWLEDGEMENTS</h2>
            </div>

            <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
                <p>
                    The Circuit wasn't built in a vacuum. The tools, open-source projects, and resources that made this possible are all catalogued on the Credits page.
                </p>
                <p>
                    This space has people who have put real work into it. The goal was never to compete with that or copy it, but to add to it. To contribute something that didn't exist in quite this way before.
                </p>
                <p>
                    If something here helped you or sparked something in you, that's the point and we are happy.
                </p>

                <div className="pt-4">
                    <Link
                        href="/credits"
                        className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-orange-500/30 transition-all px-6 py-3 font-mono text-sm uppercase tracking-widest group"
                    >
                        [ &rarr; ] VIEW CREDITS
                    </Link>
                </div>
            </div>
        </section>

         {/* 4. SYSTEM ARCHITECTURE (Clean Data Table) */}
         <section className="lg:col-span-5">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-orange-500 border border-orange-500/30 px-2 py-0.5 bg-orange-500/5">[ 04 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-orange-500 uppercase">SYSTEM ARCHITECTURE</h2>
            </div>

            <div className="border-t border-white/10">
                <ArchitectureRow label="Core Framework" value="Next.js 16 (App Router)" icon={<Monitor size={14} />} />
                <ArchitectureRow label="Server Components" value="React 19" icon={<Code size={14} />} />
                <ArchitectureRow label="Data Layer" value="Supabase (PostgreSQL)" icon={<Database size={14} />} />
                <ArchitectureRow label="UI Engine" value="Tailwind CSS" icon={<Layout size={14} />} />
                <ArchitectureRow label="Type Safety" value="TypeScript (Strict)" icon={<ShieldIcon size={14} />} />
                <ArchitectureRow label="Deployment" value="Vercel Edge Network" icon={<Globe size={14} />} />
            </div>
        </section>

        {/* 5. OPERATOR LOG (Swiss Identity Card) */}
        <section className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-orange-500 border border-orange-500/30 px-2 py-0.5 bg-orange-500/5">[ 05 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-orange-500 uppercase">OPERATOR LOG</h2>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group">
                {/* Avatar Placeholder */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="font-pixel text-2xl text-zinc-700 group-hover:text-white transition-colors">OP</span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-6 relative z-10">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl text-white font-bold tracking-tight uppercase">PRODUCT LEAD</h3>
                            <span className="font-mono text-xs text-orange-500 border border-orange-500/30 bg-orange-500/5 px-2 py-0.5">ADMIN_ACCESS</span>
                        </div>
                        <div className="h-px w-full bg-white/10 mb-4"></div>
                        <div className="text-lg text-zinc-300 font-light leading-relaxed max-w-2xl space-y-6">
                            <p>I've wanted to build something like this for almost five years. The idea was always there. The problem was I couldn't code, so it stayed an idea.</p>
                            <p>I'm a Product Manager by trade. I know how to define a problem, design a system, and know when the output is wrong. What I didn't have was the ability to build. AI changed that equation.</p>
                            <p>The Circuit is the result of finally being able to close the gap between the thing in my head and the thing on the screen. It's built out of a love for data, a love for design, and a love for consoles that goes back further than I'd like to admit.</p>
                            <p>It's not finished. It probably never fully will be. But it's real, it's live, and it's mine.</p>
                            <p className="text-zinc-300 italic">Your Captain, Daniel (iDarkcy)</p>
                        </div>
                    </div>

                    <div className="font-mono text-xs text-zinc-500 flex items-center gap-2">
                         <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                         CURRENT_OBJECTIVE: DATA_EXPANSION
                    </div>
                </div>
            </div>
        </section>

         {/* 6. ACTIONS (Relevant Links) */}
         <section className="lg:col-span-5">
             <div className="flex items-center gap-4 mb-8">
               <span className="font-mono text-xs text-orange-500 border border-orange-500/30 px-2 py-0.5 bg-orange-500/5">[ 06 ]</span>
               <h2 className="font-mono text-sm tracking-widest text-orange-500 uppercase">RELEVANT LINKS</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <EmailActionCard />
                 <ActionCard
                    href="https://www.linkedin.com/in/danielnmaghis/"
                    label="Connect"
                    sublabel="LinkedIn Profile"
                    icon={<Linkedin size={18} />}
                    external
                />
            </div>
        </section>

      </div>

    </div>
  );
}

// Renamed locally to avoid conflict if I decide to import Shield from lucide-react again later for other uses,
// though for now it is only used here as an icon in the list.
import { Shield as ShieldIcon } from 'lucide-react';

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
    const className = "group block border border-white/10 bg-white/[0.02] p-4 hover:bg-white/5 transition-all hover:border-orange-500/30 relative overflow-hidden";
    const content = (
        <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-orange-500/50 transition-colors">
                    {icon}
                </div>
                <div>
                    <div className="text-white font-medium text-sm group-hover:text-orange-400 transition-colors">{label}</div>
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
