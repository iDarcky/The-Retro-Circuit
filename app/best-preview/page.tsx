import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { BEST_OF_COLLECTIONS, selectForCollection } from '../../lib/bestof/collections';
import { fetchAllConsoles } from '../actions/consoles';
import { DOT_GRID, GUIDE_COLORS } from '../../components/best-v2/shared';
import type { ConsoleDetails } from '../../lib/types';

// Beta mockup of the redesigned guide index. Served on /best in the beta branch through a rewrite.
export const revalidate = false;
export const metadata: Metadata = {
    title: { absolute: 'Best Retro Handhelds: Buying Guides | The Retro Circuit' },
    robots: { index: false, follow: false },
};

export default async function BestPreviewIndex() {
    let consoles: ConsoleDetails[] = [];
    try { consoles = await fetchAllConsoles(); } catch (e) { console.warn('Build Warning: guides preview', e); }

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-10">
                <div className="max-w-[1400px] mx-auto">
                    <h1 className="mt-4 text-4xl md:text-7xl font-extrabold tracking-[-0.045em] leading-[0.98]">The best handhelds,<br className="hidden md:block" /> by what you need.</h1>
                    <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-[52ch]">Every ranking comes from our own spec and emulation data. Nobody pays to be on these lists.</p>
                </div>
            </header>

            <section className="px-5 md:px-12">
                <div className="max-w-[1400px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {BEST_OF_COLLECTIONS.map((g, i) => {
                        const col = GUIDE_COLORS[i % 4];
                        const top = selectForCollection(g, consoles, 3);
                        return (
                            <Link
                                key={g.slug}
                                href={`/best/${g.slug}`}
                                className={`group ${col.bg} text-white p-5 flex flex-col min-h-[300px] hover:bg-white hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
                                style={DOT_GRID}
                            >
                                <span className="font-pixel text-[10px] opacity-80">{String(i + 1).padStart(2, '0')}</span>
                                <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] leading-tight">{g.shortLabel}</h2>
                                <div className="mt-auto pt-6 flex items-end gap-1 h-28">
                                    {top.map((c, k) => (
                                        <span key={c.id} className={`relative ${k === 0 ? 'w-1/2 h-full' : 'w-1/4 h-2/3'} ${k === 0 ? 'group-hover:motion-safe:animate-[spriteBob_0.5s_steps(2,jump-none)_infinite]' : ''}`}>
                                            {c.image_url && <Image src={c.image_url} alt="" fill sizes="140px" className="object-contain object-bottom" />}
                                        </span>
                                    ))}
                                </div>
                                <span className="mt-4 font-mono text-xs flex justify-between border-t border-black/20 pt-3">
                                    <span className="truncate">{top[0] ? `#1 ${top[0].name}` : 'Coming soon'}</span>
                                    <span aria-hidden>→</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="px-5 md:px-12 mt-16">
                <div className="max-w-[1400px] mx-auto border border-white/10 p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em]">Want a pick just for you?</h2>
                        <p className="mt-2 text-text-secondary">Eight quick questions, one answer.</p>
                    </div>
                    <Link href="/finder" className="bg-white text-black font-mono text-sm px-6 py-3 hover:bg-violet-500 hover:text-white transition-colors self-start md:self-auto">Ask the Finder</Link>
                </div>
            </section>
        </main>
    );
}
