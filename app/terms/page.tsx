import { siteConfig } from '../../config/site';

export const metadata = {
  title: 'Terms of Use | The Retro Circuit',
  description: 'Terms of service and usage guidelines.',
};

export default function TermsPage() {
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-rose-500/30 selection:text-white pb-24 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

      {/* 1. HERO HEADER */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 border-b border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto w-full">

           {/* Metadata Pill - Rose Variant */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-900/30 bg-rose-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-rose-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(244,63,94,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
               System Online // Status: BINDING // Est: {siteConfig.est}
           </div>

           {/* Title */}
           <h1 className="text-4xl md:text-6xl font-pixel text-white leading-none tracking-tighter mb-8">
              TERMS OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">SERVICE</span><span className="text-rose-500 animate-pulse">_</span>
           </h1>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-16 relative z-10">

          {/* Section 1: Acceptance */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
             <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-rose-500 border border-rose-500/30 px-2 py-0.5 bg-rose-500/5">[ 01 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Acceptance</h2>
            </div>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
              <p>
                By accessing or using The Retro Circuit, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
              <div className="pl-6 border-l-2 border-rose-500/50">
                  <p className="text-zinc-400 font-light italic">
                    If you do not agree with any of these terms, you are prohibited from using or accessing this site. Access to this database is a privilege, not a right.
                  </p>
              </div>
            </div>
          </section>

          {/* Section 2: Prohibited */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 02 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Prohibited</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                To maintain the integrity of our data ecosystem, specific actions are strictly forbidden.
              </p>

              {/* Critical Alert Box */}
              <div className="bg-rose-500/5 border border-rose-500/30 p-6 md:p-8 relative overflow-hidden group">
                 {/* Decorative background element */}
                <div className="absolute -top-6 -right-6 opacity-10 rotate-12">
                     <svg className="w-32 h-32 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-rose-500 animate-pulse"></div>
                    <h3 className="text-rose-400 font-bold uppercase text-xs tracking-widest font-mono">CRITICAL WARNING</h3>
                </div>

                <div className="h-px w-full bg-rose-500/20 mb-4"></div>

                <p className="text-sm text-rose-200 mb-4 font-mono leading-relaxed relative z-10">
                   Automated scraping, data harvesting, bulk export, or unauthorized redistribution of this database structure is <strong className="text-rose-500 bg-rose-950/30 px-1 border border-rose-500/30">STRICTLY PROHIBITED</strong>.
                </p>
                <p className="text-xs text-rose-500/70 font-mono">
                  &gt; VIOLATION_RESPONSE: IP_BAN_IMMEDIATE
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Intellectual Property */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 05 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Ownership</h2>
            </div>

             <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden hover:bg-white/[0.04] transition-colors">
                {/* IP Icon */}
                <div className="w-20 h-20 bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="font-pixel text-xl text-zinc-700">IP</span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4 relative z-10">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg text-white font-bold tracking-tight uppercase">Content Rights</h3>
                            <span className="font-mono text-xs text-rose-500 border border-rose-500/30 bg-rose-500/5 px-2 py-0.5">PROTECTED</span>
                        </div>
                        <div className="h-px w-full bg-white/10 mb-4"></div>
                        <p className="font-light text-zinc-400 leading-relaxed text-sm">
                            The materials contained in this website are protected by applicable copyright and trademark law. The Retro Circuit architecture, code, design, and specific data aggregations are proprietary.
                        </p>
                    </div>

                    <div className="font-mono text-xs text-zinc-500 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                         STATUS: ALL_RIGHTS_RESERVED
                    </div>
                </div>
            </div>
          </section>

      </div>
    </div>
  );
}
