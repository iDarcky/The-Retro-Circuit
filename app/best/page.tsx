import Link from 'next/link';
import type { Metadata } from 'next';
import { BEST_OF_COLLECTIONS } from '../../lib/bestof/collections';

export const revalidate = false;

export const metadata: Metadata = {
    title: { absolute: 'Best Retro Handhelds — Buying Guides | The Retro Circuit' },
    description:
        'Curated buying guides for retro handhelds: the best devices by budget, by the systems they emulate, and by form factor. Ranked from real spec and emulation data.',
    alternates: { canonical: '/best' },
};

export default function BestOfIndexPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
            <header className="mb-16">
                <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-4">
                    Buying Guides
                </div>
                <h1 className="font-pixel text-3xl md:text-5xl text-white leading-tight mb-6">
                    BEST RETRO<br />HANDHELDS_
                </h1>
                <p className="font-sans text-gray-400 max-w-2xl leading-relaxed">
                    Every guide below is generated from our own spec and emulation database — not
                    sponsored placements. Rankings update as new hardware is added.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                {BEST_OF_COLLECTIONS.map((collection) => (
                    <Link
                        key={collection.slug}
                        href={`/best/${collection.slug}`}
                        className="group bg-bg-primary p-6 md:p-8 hover:bg-white/[0.04] transition-colors flex flex-col"
                    >
                        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 mb-3">
                            {collection.shortLabel}
                        </span>
                        <h2 className="font-bold text-lg md:text-xl text-white mb-3 group-hover:text-violet-300 transition-colors">
                            {collection.title}
                        </h2>
                        <p className="font-sans text-sm text-gray-500 leading-relaxed flex-1">
                            {collection.description}
                        </p>
                        <span className="mt-6 font-mono text-xs uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                            Read guide →
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
