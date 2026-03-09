import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CircuitPattern from './CircuitPattern';

export default function FinderSection() {
    return (
        <section className="px-6 md:px-12 py-8 md:py-14 border-b border-border-subtle bg-bg-secondary/10 relative overflow-hidden">
            {/* Circuit board background */}
            <CircuitPattern accentColor="cyan" className="absolute inset-0 w-full h-full opacity-60" />

            <div className="max-w-[1800px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-3 text-white uppercase text-left">
                            Don&apos;t Know Where to Start?
                        </h2>
                        <p className="text-text-secondary font-light max-w-xl text-sm md:text-base leading-relaxed">
                            Not sure which handheld to buy? Answer a few questions and we&apos;ll narrow it down!
                        </p>
                    </div>

                    <div className="flex justify-start md:justify-end w-full">
                        <div className="relative group w-full md:w-auto">
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-500 transition-[width,height,border-color] duration-500 group-hover:w-[calc(100%+12px)] group-hover:h-[calc(100%+12px)] group-hover:border-cyan-400/50"></div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-500 transition-[width,height,border-color] duration-500 group-hover:w-[calc(100%+12px)] group-hover:h-[calc(100%+12px)] group-hover:border-cyan-400/50"></div>
                            <Link
                                href="/finder"
                                className="relative z-10 inline-flex items-center gap-3 bg-cyan-600 text-white font-mono text-xs md:text-sm px-6 py-3 hover:brightness-110 transition-[filter] uppercase tracking-widest border border-cyan-500 shadow-lg shadow-cyan-500/20 w-full md:w-auto justify-center"
                            >
                                Start Quiz <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
