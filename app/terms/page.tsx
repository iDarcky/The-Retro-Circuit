import { siteConfig } from '../../config/site';

export const metadata = {
  title: 'Terms of Use | The Retro Circuit',
  description: 'Terms of service and usage guidelines.',
};

export default function TermsPage() {
  return (
    <div className="w-full">

      <div className="max-w-3xl mx-auto p-4 py-12 md:py-20 animate-fadeIn">

        {/* HEADER LOG */}
        <div className="mb-16 border-b-2 border-dashed border-gray-700 pb-8 relative">
          <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4 drop-shadow-[4px_4px_0_rgba(255,0,255,0.5)]">
            TERMS OF <br />
            <span className="text-secondary">SERVICE //</span>
          </h1>
          <div className="font-mono text-xs md:text-sm text-primary flex gap-4">
              <span>FIRMWARE: {siteConfig.version}</span>
              <span>{'//'}</span>
              <span>EST: {siteConfig.est}</span>
              <span>{'//'}</span>
              <span className="animate-pulse">STATUS: BINDING</span>
          </div>
        </div>

        {/* SECTION 1: ACCEPTANCE */}
      <section className="mb-16 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-purple-500 to-transparent"></div>
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-accent">[ 01 ]</span>
            ACCEPTANCE OF TERMS
        </h2>
        <div className="pl-6">
            <p className="font-mono text-lg text-gray-300 leading-relaxed mb-6">
                By accessing or using The Retro Circuit, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
            <p className="font-mono text-lg text-white leading-relaxed">
                If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
        </div>
      </section>

      {/* SECTION 2: PROHIBITED ACTIVITIES */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-primary">[ 02 ]</span>
            PROHIBITED ACTIVITIES
        </h2>

        <div className="bg-black border border-border-normal p-6 md:p-8 relative overflow-hidden">
             {/* Decoration */}
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <svg className="w-16 h-16 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>

            <div className="pl-6 relative z-10">
                <p className="font-mono text-lg text-gray-300 leading-relaxed mb-6">
                   To maintain the integrity of our data ecosystem, specific actions are strictly forbidden.
                </p>
                <div className="bg-red-500/10 border border-red-500/50 p-4 text-red-200 font-mono text-lg leading-relaxed">
                   <span className="text-red-500 font-bold mr-2">CRITICAL ALERT:</span>
                   Automated scraping, data harvesting, or redistribution of this database is strictly prohibited.
                </div>
            </div>
        </div>
      </section>

      {/* SECTION 3: INTELLECTUAL PROPERTY */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-gray-500">[ 03 ]</span>
            INTELLECTUAL PROPERTY
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-bg-primary/50 border border-dashed border-gray-700 p-8">
            <div className="w-24 h-24 bg-bg-secondary flex items-center justify-center border-2 border-white/20 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <span className="font-pixel text-3xl text-gray-500">IP</span>
            </div>
            <div>
                <div className="mb-2">
                    <span className="font-pixel text-lg text-white">CONTENT RIGHTS</span>
                    <span className="mx-2 text-gray-600">{'//'}</span>
                    <span className="font-mono text-xs text-accent border border-accent px-2 py-0.5">PROTECTED</span>
                </div>
                <p className="font-mono text-gray-400 leading-relaxed text-sm mb-4">
                    The materials contained in this website are protected by applicable copyright and trademark law. The Retro Circuit architecture, code, and design are proprietary.
                </p>
                <div className="font-mono text-xs text-gray-600">
                    &gt; STATUS: ALL_RIGHTS_RESERVED
                </div>
            </div>
        </div>
      </section>

      </div>
    </div>
  );
}
