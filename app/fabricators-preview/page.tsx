import type { Metadata } from 'next';
import { fetchPublicManufacturers } from '../actions/manufacturers';
import { fetchVaultConsoles } from '../actions/consoles';
import type { ConsoleDetails, Manufacturer } from '../../lib/types';
import { PageTitle } from '../../components/layout/PageTitle';
import { brandColor, brandTagline } from '../../lib/brand/theme';
import BrandFolder from '../../components/fabricator/BrandFolder';

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
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-8">
                    {rows.map(({ b, list, n }) => (
                        <BrandFolder
                            key={b.id}
                            href={`/fabricators/${b.slug}`}
                            name={b.name}
                            meta={[b.country, b.founded_year ? `since ${b.founded_year}` : null].filter(Boolean).join(' · ')}
                            tagline={brandTagline(b.description)}
                            count={n}
                            color={brandColor(b.name, (b as any).brand_color)}
                            logo={b.image_url ?? null}
                            devices={list.slice(0, 3).map((c) => c.image_url!)}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
