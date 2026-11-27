import type { Metadata } from 'next';
import { fetchPublicManufacturers } from '../../actions/manufacturers';
import { fetchVaultConsoles } from '../../actions/consoles';
import type { ConsoleDetails, Manufacturer } from '../../../lib/types';
import { PageTitle } from '../../../components/layout/PageTitle';
import { brandColor } from '../../../lib/brand/theme';
import BrandFolderIcon from '../../../components/fabricator/BrandFolderIcon';

// Beta mockup of the redesigned brands index. Served on /fabricators in the beta branch through a rewrite.
export const revalidate = false;
export const metadata: Metadata = {
    title: { absolute: 'Brand folder drafts | The Retro Circuit' },
    robots: { index: false, follow: false },
};

export default async function BrandFolderDrafts() {
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
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-10 md:pb-12">
                <div className="max-w-[1400px] mx-auto">
                    <PageTitle accent="Fabricators" color="fabricators" />
                    <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-[52ch]">Every brand behind the handhelds, from big names to garage makers. Open a folder to see what they make.</p>
                </div>
            </header>

            <section className="px-5 md:px-12" aria-label="All brands">
                <div className="max-w-[1400px] mx-auto rounded-2xl border border-white/10 bg-white/[0.015] overflow-hidden">
                    {/* Window bar, like a file browser on an old desktop */}
                    <div className="flex items-center gap-4 px-4 md:px-5 h-12 border-b border-white/10 bg-white/[0.03]">
                        <span aria-hidden className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                            <span className="w-3 h-3 rounded-full bg-orange-400/80" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </span>
                        <span className="font-mono text-xs text-white/70 truncate"><span className="text-white/40">C:\CIRCUIT\</span>FABRICATORS</span>
                        <span className="ml-auto font-mono text-[11px] text-white/40 hidden sm:block">sorted by line-up</span>
                    </div>
                    {/* Desktop with a faint dot grid */}
                    <div className="p-4 md:p-6 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px]">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-10 gap-x-1 gap-y-3">
                            {rows.map(({ b, n }) => (
                                <BrandFolderIcon
                                    key={b.id}
                                    href={`/fabricators/${b.slug}`}
                                    name={b.name}
                                    count={n}
                                    color={brandColor(b.name, (b as any).brand_color)}
                                    logo={b.image_url ?? null}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-4 md:px-5 h-9 border-t border-white/10 font-mono text-[11px] text-white/40">
                        <span>{brands.length} folders</span>
                        <span>{rows.reduce((s, r) => s + r.n, 0)} handhelds inside</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
