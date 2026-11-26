import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { fetchPublicManufacturers } from '../actions/manufacturers';
import { fetchVaultConsoles } from '../actions/consoles';
import type { ConsoleDetails, Manufacturer } from '../../lib/types';

// Beta mockup of the redesigned brands index. Served on /fabricators in the beta branch through a rewrite.
export const revalidate = false;
export const metadata: Metadata = {
    title: { absolute: 'Retro Handheld Brands | The Retro Circuit' },
    robots: { index: false, follow: false },
};

const ACCENT = ['bg-violet-500', 'bg-cyan-500', 'bg-rose-500', 'bg-orange-500'];

export default async function BrandsPreview() {
    let brands: Manufacturer[] = [];
    let consoles: ConsoleDetails[] = [];
    try { [brands, consoles] = await Promise.all([fetchPublicManufacturers(), fetchVaultConsoles()]); } catch (e) { console.warn('Build Warning: brands preview', e); }

    const byBrand = new Map<string, ConsoleDetails[]>();
    for (const c of consoles) {
        const id = (c as any).manufacturer_id ?? c.manufacturer?.id;
        if (!id) continue;
        if (!byBrand.has(id)) byBrand.set(id, []);
        byBrand.get(id)!.push(c);
    }
    const rows = brands
        .map((b) => ({ b, list: (byBrand.get(b.id) ?? []).filter((c) => c.image_url) , n: byBrand.get(b.id)?.length ?? 0 }))
        .sort((x, y) => y.n - x.n || x.b.name.localeCompare(y.b.name));
    const big = rows.filter((r) => r.n >= 3);
    const small = rows.filter((r) => r.n < 3);

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-12 md:pb-16">
                <div className="max-w-[1400px] mx-auto">
                    <h1 className="mt-4 text-4xl md:text-7xl font-extrabold tracking-[-0.045em] leading-[0.98]">Who makes them.</h1>
                    <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-[52ch]">{brands.length} brands, from the big names to one-device makers. Biggest line-ups first.</p>
                </div>
            </header>

            <section className="px-5 md:px-12" aria-label="Brands with three or more handhelds">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {big.map(({ b, list, n }, i) => (
                        <Link key={b.id} href={`/fabricators/${b.slug}`} className="group relative flex flex-col border border-white/10 p-6 md:p-8 hover:bg-white/[0.04] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500">
                            <span className={`absolute left-0 top-0 h-1 w-16 ${ACCENT[i % 4]} transition-all group-hover:w-full`} aria-hidden />
                            <div className="flex items-center gap-4">
                                <span className="relative w-16 h-16 shrink-0 bg-white p-2.5">
                                    {b.image_url ? <span className="relative block w-full h-full"><Image src={b.image_url} alt="" fill sizes="64px" className="object-contain" /></span>
                                        : <span className="absolute inset-0 flex items-center justify-center font-pixel text-black">{b.name.charAt(0)}</span>}
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-2xl font-extrabold tracking-[-0.02em] truncate group-hover:text-violet-300 transition-colors">{b.name}</h2>
                                    <p className="mt-1 font-mono text-xs text-text-secondary">{[b.country, b.founded_year ? `since ${b.founded_year}` : null].filter(Boolean).join(' · ')}</p>
                                </div>
                                <span className="ml-auto text-right shrink-0"><span className="block font-pixel text-lg">{n}</span><span className="font-mono text-[10px] text-zinc-500">handhelds</span></span>
                            </div>
                            <div className="mt-8 flex items-end gap-4 h-28">
                                {list.slice(0, 3).map((c, k) => (
                                    <span key={c.id} className="relative flex-1 h-full group-hover:motion-safe:animate-[spriteBob_0.5s_steps(2,jump-none)_infinite]" style={{ animationDelay: `${k * 90}ms` }}>
                                        <Image src={c.image_url!} alt="" fill sizes="140px" className="object-contain object-bottom" />
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {small.length > 0 && (
                <section className="px-5 md:px-12 mt-20 md:mt-28" aria-labelledby="more-brands">
                    <div className="max-w-[1400px] mx-auto">
                        <h2 id="more-brands" className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em]">Smaller makers</h2>
                        <p className="mt-2 text-text-secondary">One or two handhelds each.</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {small.sort((x, y) => x.b.name.localeCompare(y.b.name)).map(({ b, n }) => (
                                <Link key={b.id} href={`/fabricators/${b.slug}`} className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500">
                                    {b.name}<span className="font-mono text-xs text-zinc-500">{n}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
