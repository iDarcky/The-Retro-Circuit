import Link from 'next/link';
import { Search } from 'lucide-react';
import QuickCompare from './QuickCompare';

interface AnalysisToolsProps {
    consoles: any[];
}

export default function AnalysisTools({ consoles }: AnalysisToolsProps) {
    return (
        <div className="bg-bg-card border border-border-subtle rounded-xl p-6 md:p-8 flex flex-col gap-8 h-full relative overflow-hidden group">
            {/* Header Style from d-pad image */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary shadow-[0_0_8px_rgba(0,217,255,0.5)]"></div>
                    <h2 className="text-xl font-pixel text-white tracking-wide uppercase">
                        ANALYSIS TOOLS
                    </h2>
                </div>
                <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-border-normal rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-border-normal rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                {/* LEFT: FINDER */}
                <div className="flex flex-col justify-between gap-6 relative">
                     <div className="space-y-4">
                        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest border-b border-border-subtle pb-2 mb-4">
                            Recommendation Engine
                        </h3>

                        <div className="space-y-4">
                             <div className="p-4 bg-black/20 border border-border-subtle rounded-lg">
                                 <p className="text-white font-bold text-lg md:text-xl mb-2">
                                     Unsure where to start?
                                 </p>
                                 <p className="text-text-muted text-sm leading-relaxed font-mono">
                                     Define your parameters (Price, Form Factor, Tech) and let the system identify optimal hardware matches.
                                 </p>
                             </div>

                             <div className="font-mono text-xs text-primary/80 flex items-center gap-2">
                                <span className="animate-pulse">_</span> AWAITING INPUT...
                             </div>
                        </div>
                     </div>

                     <Link
                        href="/finder"
                        className="group/btn relative w-full bg-black/40 border border-border-normal hover:border-primary p-5 flex items-center justify-between transition-all duration-300 hover:bg-primary/5"
                     >
                        <span className="font-tech text-lg text-white group-hover/btn:text-primary transition-colors uppercase tracking-widest font-bold">
                            Start Analysis
                        </span>
                        <Search size={20} className="text-text-muted group-hover/btn:text-primary transition-colors" />

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover/btn:border-primary transition-colors"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover/btn:border-primary transition-colors"></div>
                     </Link>
                </div>

                {/* RIGHT: COMPARE */}
                <div className="flex flex-col h-full relative md:border-l border-border-subtle md:pl-8 border-dashed">
                    <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest border-b border-border-subtle pb-2 mb-4">
                        Quick Compare
                    </h3>
                    <div className="flex-grow">
                        <QuickCompare consoles={consoles} />
                    </div>
                </div>
            </div>
        </div>
    );
}
