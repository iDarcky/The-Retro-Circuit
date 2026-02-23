import { getSystemVersion } from '../../app/actions/roadmap';

export const metadata = {
  title: 'Privacy Protocol | The Retro Circuit',
  description: 'Privacy policy and data handling protocols.',
};

export default async function PrivacyPage() {
  const version = await getSystemVersion();
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-sky-500/30 selection:text-white pb-24 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

      {/* 1. HERO HEADER */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 border-b border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto w-full">

           {/* Metadata Pill - Sky Blue Variant */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-900/30 bg-sky-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-sky-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(56,189,248,0.1)]">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
               Secure Protocol // v{version} // Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
           </div>

           {/* Title */}
           <h1 className="text-4xl md:text-6xl font-pixel text-white leading-none tracking-tighter mb-8">
              PRIVACY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">PROTOCOL</span><span className="text-sky-500 animate-pulse">_</span>
           </h1>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-16 relative z-10">

          {/* Section 1: Overview */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
             <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-sky-500 border border-sky-500/30 px-2 py-0.5 bg-sky-500/5">[ 01 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Overview</h2>
            </div>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
              <p>
                At The Retro Circuit, we believe in transparency and data minimalism. We only collect data that is strictly necessary for the operation of our service or to improve the user experience, and only with your explicit consent.
              </p>
              <div className="pl-6 border-l-2 border-sky-500/50">
                  <p className="text-zinc-400 font-light italic">
                    This policy outlines our practices regarding data collection, storage, and your rights as a user. By using our services, you agree to the collection and use of information in accordance with this policy.
                  </p>
              </div>
            </div>
          </section>

          {/* Section 2: Cookies & Analytics */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 02 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Analytics</h2>
            </div>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
              <p>
                We use <strong className="text-white font-medium">Vercel Analytics</strong> to understand how users interact with our website. This helps us identify performance bottlenecks and improve content relevance.
              </p>
              <div className="bg-sky-500/5 border border-sky-500/20 p-6 md:p-8 relative overflow-hidden group">
                 {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <div className="w-16 h-16 border-2 border-sky-500 rounded-full border-dashed animate-spin-slow"></div>
                </div>

                <h3 className="text-sky-400 font-bold mb-2 uppercase text-xs tracking-widest font-mono">Strict Consent Policy</h3>
                <div className="h-px w-full bg-sky-500/20 mb-4"></div>
                <p className="text-sm text-gray-400 mb-4 font-mono leading-relaxed">
                  By default, all non-essential cookies and analytics scripts are <strong className="text-white">BLOCKED</strong>. We do not track your activity until you explicitly click &quot;Accept&quot; on our cookie banner.
                </p>
                <p className="text-sm text-gray-400 font-mono">
                  &gt; STATUS: USER_CONTROLLED
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Data Storage */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 03 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Storage</h2>
            </div>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
              <p>
                We utilize <strong className="text-white font-medium">Supabase</strong> as our primary database provider. All data is encrypted at rest and in transit. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
              </p>
            </div>
          </section>

          {/* Section 4: Your Rights */}
          <section className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            <div className="flex items-center gap-3 self-start pt-1">
               <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5">[ 04 ]</span>
               <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Your Rights</h2>
            </div>
            <div className="space-y-8 text-gray-300 leading-relaxed text-lg font-light">
              <p>
                Under GDPR and other privacy regulations, you have the right to access, rectify, or erase your personal data. You also have the right to withdraw consent for data processing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Card 1 */}
                 <div className="border border-white/10 bg-white/[0.02] p-6 hover:border-sky-500/30 transition-colors">
                    <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4 font-mono">Managing Consent</h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      Reset your preferences at any time via the footer.
                    </p>
                    <div className="text-xs font-mono text-sky-400">
                        ACTION: SCROLL_TO_FOOTER
                    </div>
                 </div>

                 {/* Card 2 */}
                 <a href="mailto:contact@theretrocircuit.com" className="border border-white/10 bg-white/[0.02] p-6 hover:border-sky-500/30 transition-colors block group">
                    <h3 className="text-white group-hover:text-sky-400 transition-colors font-bold uppercase text-xs tracking-widest mb-4 font-mono">Contact Us</h3>
                    <p className="text-sm text-zinc-400 mb-4 truncate">
                      contact@theretrocircuit.com
                    </p>
                     <div className="text-xs font-mono text-zinc-600 group-hover:text-sky-400 transition-colors">
                        &gt; SEND_MESSAGE
                    </div>
                 </a>
              </div>
            </div>
          </section>

      </div>
    </div>
  );
}
