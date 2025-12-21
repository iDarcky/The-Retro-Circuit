
import { siteConfig } from '../../config/site';
import Button from '../../components/ui/Button';

export const metadata = {
  title: 'System Manifesto | The Retro Circuit',
  description: 'Operational manual, system specifications, and operator data.',
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 py-12 md:py-20 animate-fadeIn">
      
      {/* HEADER LOG */}
      <div className="mb-16 border-b-2 border-dashed border-gray-700 pb-8 relative">
        <div className="absolute top-0 right-0 font-mono text-[10px] text-gray-600 border border-gray-700 px-2 py-1">
          DOC_ID: MANIFESTO_V1
        </div>
        <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4 drop-shadow-[4px_4px_0_rgba(255,0,255,0.5)]">
          THE RETRO <br />
          <span className="text-secondary">CIRCUIT //</span>
        </h1>
        <div className="font-mono text-xs md:text-sm text-primary flex gap-4">
            <span>FIRMWARE: {siteConfig.version}</span>
            <span>//</span>
            <span>EST: {siteConfig.est}</span>
            <span>//</span>
            <span className="animate-pulse">STATUS: OPERATIONAL</span>
        </div>
      </div>

      {/* SECTION 1: THE MISSION */}
      <section className="mb-16 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-purple-500 to-transparent"></div>
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-accent">[ 01 ]</span>
            SIGNAL NOISE RATIO
        </h2>
        <div className="pl-6">
            <p className="font-mono text-lg text-gray-300 leading-relaxed mb-6">
                The retro handheld market is a labyrinth of fragmented data. Variants, revisions, and silent upgrades create static in the signal.
            </p>
            <p className="font-mono text-lg text-white leading-relaxed">
                In a sea of subjective noise, we provide the raw signal. <br />
                <span className="text-secondary bg-secondary/10 px-1">No feelings. Just data.</span>
            </p>
        </div>
      </section>

      {/* SECTION 2: CREDITS */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-secondary">[ 02 ]</span>
            CREDITS & ACKNOWLEDGEMENTS
        </h2>
        <div className="pl-6">
            <p className="font-mono text-lg text-gray-300 leading-relaxed">
                This project wouldn’t exist without a wider retro-gaming community. The Retro Circuit doesn’t aim to replace existing work — it connects it, structures it, and makes it easier to explore.
            </p>
        </div>
      </section>

      {/* SECTION 3: SYSTEM ARCHITECTURE */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-primary">[ 03 ]</span>
            SYSTEM ARCHITECTURE
        </h2>
        
        <div className="bg-black border border-border-normal p-6 md:p-8 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <svg className="w-16 h-16 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 font-mono text-sm relative z-10">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">CORE_FRAMEWORK</span>
                    <span className="text-secondary">NEXT.JS 16 (APP ROUTER)</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">DATA_LAYER</span>
                    <span className="text-secondary">SUPABASE (POSTGRESQL)</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">UI_ENGINE</span>
                    <span className="text-secondary">TAILWIND CSS</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">DEPLOYMENT</span>
                    <span className="text-secondary">VERCEL EDGE</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">SECURITY</span>
                    <span className="text-secondary">ROW LEVEL SECURITY</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">TYPE_SAFETY</span>
                    <span className="text-secondary">TYPESCRIPT (STRICT)</span>
                </div>
            </div>
        </div>
      </section>

      {/* SECTION 4: OPERATOR */}
      <section className="mb-16">
        <h2 className="font-pixel text-xl text-white mb-6 flex items-center gap-3">
            <span className="text-gray-500">[ 04 ]</span>
            OPERATOR LOG
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-bg-primary/50 border border-dashed border-gray-700 p-8">
            <div className="w-24 h-24 bg-bg-secondary flex items-center justify-center border-2 border-white/20 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <span className="font-pixel text-3xl text-gray-500">OP</span>
            </div>
            <div>
                <div className="mb-2">
                    <span className="font-pixel text-lg text-white">PRODUCT LEAD</span>
                    <span className="mx-2 text-gray-600">//</span>
                    <span className="font-mono text-xs text-accent border border-accent px-2 py-0.5">ADMIN_ACCESS</span>
                </div>
                <p className="font-mono text-gray-400 leading-relaxed text-sm mb-4">
                    Built to solve the chaos of handheld specifications. This project serves as both a public utility for the retro gaming community and a demonstration of modern full-stack architecture.
                </p>
                <div className="font-mono text-xs text-gray-600">
                    &gt; CURRENT_OBJECTIVE: DATA_EXPANSION
                </div>
            </div>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-border-normal pt-12">
        <a href={siteConfig.links.email} className="w-full">
            <Button variant="secondary" className="w-full flex justify-center border-secondary text-secondary hover:bg-secondary hover:text-black">
                [ OPEN COMMS ]
            </Button>
        </a>
        <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="secondary" className="w-full flex justify-center border-gray-500 text-gray-400 hover:bg-white hover:text-black hover:border-white">
                VIEW SOURCE
            </Button>
        </a>
        <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="secondary" className="w-full flex justify-center border-primary text-primary hover:bg-primary hover:text-black">
                LINKEDIN LINK
            </Button>
        </a>
      </div>

    </div>
  );
}
