import { siteConfig } from '../../config/site';

export const metadata = {
  title: 'Privacy Protocol | The Retro Circuit',
  description: 'Privacy policy and data handling protocols.',
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 py-12 md:py-20 animate-fadeIn">

      {/* HEADER LOG */}
      <div className="mb-16 border-b-2 border-dashed border-gray-700 pb-8 relative">
        <div className="absolute top-0 right-0 font-mono text-[10px] text-gray-600 border border-gray-700 px-2 py-1">
          DOC_ID: PRIVACY_PROTOCOL_V1
        </div>
        <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4 drop-shadow-[4px_4px_0_rgba(255,0,255,0.5)]">
          PRIVACY <br />
          <span className="text-secondary">PROTOCOL //</span>
        </h1>
        <div className="font-mono text-xs md:text-sm text-primary flex gap-4">
            <span>FIRMWARE: {siteConfig.version}</span>
            <span>{'//'}</span>
            <span>EST: {siteConfig.est}</span>
            <span>{'//'}</span>
            <span className="animate-pulse">STATUS: ACTIVE</span>
        </div>
      </div>

      {/* SECTION 1: DATA COLLECTION & STORAGE */}
      <section className="mb-16 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-purple-500 to-transparent"></div>
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-accent">[ 01 ]</span>
            DATA COLLECTION & STORAGE
        </h2>
        <div className="pl-6">
            <p className="font-mono text-lg text-gray-300 leading-relaxed mb-6">
                We utilize <span className="text-secondary">Supabase</span> as our primary data storage solution. All data is handled with strict security protocols.
            </p>
            <p className="font-mono text-lg text-white leading-relaxed">
                Your data resides in secure, encrypted environments. We prioritize data integrity and security above all else.
            </p>
        </div>
      </section>

      {/* SECTION 2: ANALYTICS */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-primary">[ 02 ]</span>
            ANALYTICS
        </h2>

        <div className="bg-black border border-border-normal p-6 md:p-8 relative overflow-hidden">
             {/* Decoration */}
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <svg className="w-16 h-16 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            </div>

            <div className="pl-6 relative z-10">
                <p className="font-mono text-lg text-gray-300 leading-relaxed mb-6">
                    We employ <span className="text-secondary">Vercel Analytics</span> for anonymous usage tracking. This helps us understand system performance and user interaction patterns.
                </p>
                <p className="font-mono text-lg text-white leading-relaxed">
                   No personally identifiable information (PII) is collected through these analytics. We track signals, not individuals.
                </p>
            </div>
        </div>
      </section>

      {/* SECTION 3: DATA USAGE */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-gray-500">[ 03 ]</span>
            DATA USAGE
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-bg-primary/50 border border-dashed border-gray-700 p-8">
            <div className="w-24 h-24 bg-bg-secondary flex items-center justify-center border-2 border-white/20 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <span className="font-pixel text-3xl text-gray-500">SEC</span>
            </div>
            <div>
                <div className="mb-2">
                    <span className="font-pixel text-lg text-white">USER PRIVACY</span>
                    <span className="mx-2 text-gray-600">{'//'}</span>
                    <span className="font-mono text-xs text-accent border border-accent px-2 py-0.5">PRIORITY_HIGH</span>
                </div>
                <p className="font-mono text-gray-400 leading-relaxed text-sm mb-4">
                    We respect your privacy. We do not sell, trade, or otherwise transfer your personal data to outside parties. Your trust is the core of our operation.
                </p>
            </div>
        </div>
      </section>

    </div>
  );
}
