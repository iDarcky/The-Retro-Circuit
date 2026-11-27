import type { Metadata } from 'next';
import { fetchPublicManufacturers } from '../../actions/manufacturers';
import { fetchVaultConsoles } from '../../actions/consoles';
import type { ConsoleDetails, Manufacturer } from '../../../lib/types';
import { PageTitle } from '../../../components/layout/PageTitle';
import { brandColor, brandTagline } from '../../../lib/brand/theme';
import BrandFolder from '../../../components/fabricator/BrandFolder';

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
            <header className="px-5 md:px-12 pt-12 md:pt-16 pb-10">
                <div className="max-w-[1400px] mx-auto">
                    <PageTitle lead="Folder" accent="drafts" color="fabricators" />
                    <p className="mt-5 text-lg text-text-secondary max-w-[60ch]">Four of your folders, same top brands. In each row the first two hold the logo, huge and tossed in; the other two hold three of the brand&apos;s handhelds.</p>
                </div>
            </header>
            {([
                ['sheet', 'Folder 4: sheet inside, glass front'],
                ['tab', 'Folder 3: dark, the name on the front tab'],
                ['tilt', 'Folder 10: tilted glass, name on a label'],
                ['wave', 'Folder 11: dipped glass edge, + pill'],
            ] as const).map(([shape, label]) => (
                <section key={shape} className="px-5 md:px-12 mb-14" aria-label={label}>
                    <div className="max-w-[1400px] mx-auto">
                        <h2 className="font-pixel text-sm md:text-base text-emerald-400 mb-5">{label}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                            {rows.slice(0, 4).map(({ b, list, n }, i) => (
                                <BrandFolder
                                    key={b.id}
                                    shape={shape}
                                    fill={i < 2 ? 'logo' : 'handhelds'}
                                    href={`/fabricators/${b.slug}`}
                                    name={b.name}
                                    tagline={brandTagline(b.description)}
                                    count={n}
                                    color={brandColor(b.name, (b as any).brand_color)}
                                    logo={b.image_url ?? null}
                                    devices={list.slice(0, 3).map((c) => c.image_url!)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </main>
    );
}
