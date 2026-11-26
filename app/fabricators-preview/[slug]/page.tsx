import { cache } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteConfig } from '../../../config/site';
import { supabaseAnon } from '../../../lib/supabase/anon';
import { fetchPublicManufacturers } from '../../actions/manufacturers';
import { defaultVariantOf } from '../../../lib/normalize';
import { pairKey } from '../../../lib/arena/indexable';
import DeviceCard from '../../../components/browse-v2/DeviceCard';

// Beta mockup of a redesigned brand page. Served on /fabricators/[slug] in the beta branch through a rewrite.
export const revalidate = false;
type Props = { params: Promise<{ slug: string }> };

const resolveBrand = cache(async (slug: string) => {
    const { data } = await supabaseAnon.from('manufacturer').select('*').eq('slug', slug).maybeSingle();
    return data;
});

export async function generateStaticParams() {
    return (await fetchPublicManufacturers()).map((f) => ({ slug: f.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const b = await resolveBrand((await props.params).slug);
    return { title: { absolute: `${b?.name ?? 'Brand'} Handhelds | The Retro Circuit` }, robots: { index: false, follow: false } };
}

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';

export default async function BrandPreview(props: Props) {
    const { slug } = await props.params;
    const b = await resolveBrand(slug);
    if (!b) notFound();

    const { data } = await supabaseAnon
        .from('consoles')
        .select(`id, name, slug, image_url, form_factor,
            variants:console_variants(id, is_default, image_url, price_launch_usd, price_avg_usd, release_date, soc_name, os_family, screen_size_inch)`)
        .eq('manufacturer_id', b.id)
        .eq('status', 'published');

    const devices = ((data as any[]) || []).map((c) => {
        const v: any = defaultVariantOf<any>(c.variants) || {};
        const price = Number(v.price_launch_usd || v.price_avg_usd) || 0;
        return {
            slug: c.slug, name: c.name, brand: b.name, image: c.image_url || v.image_url || null, shape: c.form_factor,
            price: price >= 20 ? Math.round(price) : null, chip: v.soc_name ?? null, screen: v.screen_size_inch ?? null,
            os: v.os_family ?? null, year: v.release_date ? String(v.release_date).slice(0, 4) : null,
            t: v.release_date ? new Date(v.release_date).getTime() : Infinity,
        };
    }).sort((x, y) => y.t - x.t);

    const others = (await fetchPublicManufacturers()).filter((m) => m.id !== b.id).slice(0, 40);
    const knownFor: string[] = Array.isArray(b.known_for) ? b.known_for : [];
    const [first, second] = devices.filter((d) => d.t !== Infinity);
    const sentences = (b.description || '').trim();
    const facts = [
        b.country && { k: 'From', v: b.country },
        b.founded_year && { k: 'Since', v: String(b.founded_year) },
        { k: 'Handhelds', v: String(devices.length) },
    ].filter(Boolean) as { k: string; v: string }[];

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Brand', name: b.name, url: `${siteConfig.url}/fabricators/${b.slug}`, logo: b.image_url }) }} />
            <header className="px-5 md:px-12 pt-10 md:pt-16 pb-14 md:pb-20">
                <div className="max-w-[1400px] mx-auto">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                            <li><Link href="/fabricators" className="hover:text-white">Brands</Link></li>
                            <li aria-hidden>/</li>
                            <li aria-current="page" className="text-white">{b.name}</li>
                        </ol>
                    </nav>
                    <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
                        <span className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-white p-3">
                            {b.image_url ? <span className="relative block w-full h-full"><Image src={b.image_url} alt={`${b.name} logo`} fill sizes="128px" className="object-contain" priority /></span>
                                : <span className="absolute inset-0 flex items-center justify-center font-pixel text-3xl text-black">{b.name.charAt(0)}</span>}
                        </span>
                        <div className="min-w-0">
                            <p className="font-pixel text-[10px] text-violet-400">BRAND</p>
                            <h1 className="mt-3 text-5xl md:text-7xl font-extrabold tracking-[-0.045em] leading-[0.98]">{b.name}</h1>
                        </div>
                        <dl className="md:ml-auto flex gap-px bg-white/10 border border-white/10 self-start md:self-end">
                            {facts.map((f) => (
                                <div key={f.k} className="bg-bg-primary px-5 py-4">
                                    <dt className="font-mono text-[10px] text-zinc-500">{f.k}</dt>
                                    <dd className="font-pixel text-sm mt-1">{f.v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    {sentences && <p className="mt-10 md:mt-14 text-lg md:text-xl text-zinc-300 leading-relaxed max-w-[65ch]">{sentences}</p>}
                    {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" className={`mt-6 inline-block font-mono text-sm text-violet-400 hover:text-white ${focus}`}>Official site ↗</a>}
                </div>
            </header>

            {(knownFor.length > 0 || b.who_its_for) && (
                <section className="px-5 md:px-12">
                    <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
                        {knownFor.length > 0 && (
                            <div className="bg-violet-600 p-8 md:p-10">
                                <h2 className="font-pixel text-[11px]">KNOWN FOR</h2>
                                <ul className="mt-5 space-y-3">
                                    {knownFor.map((k) => <li key={k} className="flex gap-3 leading-relaxed"><span className="mt-2 w-2 h-2 bg-white shrink-0" aria-hidden />{k}</li>)}
                                </ul>
                            </div>
                        )}
                        {b.who_its_for && (
                            <div className="bg-cyan-600 p-8 md:p-10">
                                <h2 className="font-pixel text-[11px]">WHO IT&apos;S FOR</h2>
                                <p className="mt-5 text-lg leading-relaxed">{b.who_its_for}</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="px-5 md:px-12 mt-20 md:mt-28" aria-labelledby="lineup">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <h2 id="lineup" className="font-pixel text-base md:text-xl leading-snug text-emerald-400">The line-up</h2>
                        {first && second && (
                            <Link href={`/arena/${pairKey(first.slug, second.slug)}`} className={`font-mono text-sm text-violet-400 hover:text-white ${focus}`}>Compare {first.name} vs {second.name} →</Link>
                        )}
                    </div>
                    <p className="mt-2 text-text-secondary">Newest first.</p>
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-l border-t border-white/10">
                        {devices.map((d, i) => <DeviceCard key={d.slug} d={d} priority={i < 6} />)}
                    </div>
                </div>
            </section>

            <section className="px-5 md:px-12 mt-20 md:mt-28">
                <div className="max-w-[1400px] mx-auto">
                    <h2 className="font-pixel text-base md:text-xl leading-snug text-emerald-400">Other brands</h2>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {others.map((m) => (
                            <Link key={m.id} href={`/fabricators/${m.slug}`} className={`border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white hover:text-black transition-colors ${focus}`}>{m.name}</Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
