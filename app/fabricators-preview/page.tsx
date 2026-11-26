import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { fetchPublicManufacturers } from '../actions/manufacturers';
import { fetchVaultConsoles } from '../actions/consoles';
import type { ConsoleDetails, Manufacturer } from '../../lib/types';
import { PageTitle } from '../../components/layout/PageTitle';
import { brandFill, brandTagline } from '../../lib/brand/theme';

// Beta mockup of the redesigned brands index. Served on /fabricators in the beta branch through a rewrite.
export const revalidate = false;
export const metadata: Metadata = {
    title: { absolute: 'Retro Handheld Brands | The Retro Circuit' },
    robots: { index: false, follow: false },
};

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

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-12 md:pb-16">
                <div className="max-w-[1400px] mx-auto">
                    <PageTitle accent="Fabricators" color="fabricators" />
                    <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-[52ch]">Every brand behind the handhelds, from big names to garage makers. {brands.length} of them, biggest line-ups first.</p>
                </div>
            </header>

            <section className="px-5 md:px-12" aria-label="All brands">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-5">
                    {rows.map(({ b, n }) => {
                        const fill = brandFill(b.name, (b as any).brand_color);
                        const tagline = brandTagline(b.description);
                        return (
                            /* A folder: a tab on top, the body below, both in the brand's own colour */
                            <Link key={b.id} href={`/fabricators/${b.slug}`} className="group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500 rounded-[22px]" style={{ color: fill.fg }}>
                                <span className="relative z-10 -mb-[2px] self-start w-[42%] h-7 rounded-t-2xl border-2 border-b-0 border-black transition-[width] duration-300 group-hover:w-[55%]" style={{ background: fill.bg }} aria-hidden />
                                <span className="relative flex-1 flex flex-col rounded-[22px] rounded-tl-none border-2 border-black p-5 md:p-6 min-h-[200px] transition-transform duration-300 group-hover:motion-safe:-translate-y-1" style={{ background: fill.bg }}>
                                    <span className="flex items-center gap-3">
                                        <span className="relative w-11 h-11 shrink-0 rounded-xl bg-white border-2 border-black p-1.5">
                                            {b.image_url ? <span className="relative block w-full h-full"><Image src={b.image_url} alt="" fill sizes="44px" className="object-contain" /></span>
                                                : <span className="absolute inset-0 flex items-center justify-center font-pixel text-xs text-black">{b.name.charAt(0)}</span>}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-xl font-semibold tracking-[-0.02em] truncate">{b.name}</span>
                                            <span className="block font-mono text-[11px]" style={{ color: fill.muted }}>{[b.country, b.founded_year ? `since ${b.founded_year}` : null].filter(Boolean).join(' · ')}</span>
                                        </span>
                                    </span>
                                    {tagline && <span className="mt-5 font-pixel text-[10px] leading-relaxed">{tagline}</span>}
                                    <span className="mt-auto pt-6 flex items-end justify-between">
                                        <span className="text-5xl font-semibold tracking-[-0.04em] tabular-nums leading-none">{n}</span>
                                        <span className="font-mono text-xs" style={{ color: fill.muted }}>{n === 1 ? 'handheld' : 'handhelds'} →</span>
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
