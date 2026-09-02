import Link from 'next/link';
import { siteConfig } from '../../../config/site';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchAllConsoles } from '../../../app/actions/consoles';
import { BEST_OF_COLLECTIONS, getCollection, selectForCollection } from '../../../lib/bestof/collections';
import { getBuyUrl } from '../../../lib/affiliate';
import AffiliateLink from '../../../components/console/AffiliateLink';
import { formatReleaseDate } from '../../../lib/utils/date-formatter';

export const revalidate = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return BEST_OF_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { slug } = await props.params;
    const collection = getCollection(slug);
    if (!collection) return { title: 'Guide Not Found | The Retro Circuit' };

    return {
        title: { absolute: `${collection.title} (${new Date().getFullYear()}) | The Retro Circuit` },
        description: collection.description,
        alternates: { canonical: `/best/${collection.slug}` },
        openGraph: {
            title: collection.title,
            description: collection.description,
            type: 'article',
        },
    };
}

export default async function BestOfPage(props: Props) {
    const { slug } = await props.params;
    const collection = getCollection(slug);
    if (!collection) notFound();

    let consoles: any[] = [];
    try {
        consoles = await fetchAllConsoles();
    } catch (error) {
        console.warn('Build Warning: best-of page could not load consoles.', error);
    }

    const picks = selectForCollection(collection, consoles, 10);

    // ItemList structured data helps this page win rich results for "best X" queries.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: collection.title,
        description: collection.description,
        url: `${siteConfig.url}/best/${collection.slug}`,
        numberOfItems: picks.length,
        itemListElement: picks.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: [c.manufacturer?.name, c.name].filter(Boolean).join(' '),
            url: `${siteConfig.url}/consoles/${c.slug}`,
        })),
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <nav className="mb-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                <Link href="/best" className="hover:text-white transition-colors">Buying Guides</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-300">{collection.shortLabel}</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-10">
                <h1 className="font-pixel text-2xl md:text-4xl text-white leading-tight mb-6">
                    {collection.title}
                </h1>
                <p className="font-sans text-gray-400 max-w-2xl leading-relaxed mb-4">
                    {collection.description}
                </p>
                <p className="font-mono text-[10px] text-gray-600 uppercase tracking-wider">
                    Ranked from our spec database · {picks.length} device{picks.length === 1 ? '' : 's'}
                </p>
            </header>

            {picks.length === 0 ? (
                <p className="font-mono text-sm text-gray-500 py-12 text-center border border-white/10">
                    No devices match this guide yet — check back as the database grows.
                </p>
            ) : (
                <ol className="space-y-px bg-white/10 border border-white/10">
                    {picks.map((c, index) => {
                        const spec = (c as any).specs || {};
                        const buyUrl = getBuyUrl({
                            asin: spec.amazon_asin,
                            name: c.name,
                            manufacturer: c.manufacturer?.name,
                        });
                        const released = formatReleaseDate(spec.release_date, spec.release_date_precision);

                        return (
                            <li key={c.id} className="bg-bg-primary p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                    <div className="flex items-start gap-4 md:gap-6">
                                        <span className="font-pixel text-2xl md:text-3xl text-violet-500 shrink-0 w-10">
                                            {index + 1}
                                        </span>
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-white/[0.02] border border-white/5">
                                            {c.image_url ? (
                                                <Image
                                                    src={c.image_url}
                                                    alt={`${c.manufacturer?.name || ''} ${c.name}`.trim()}
                                                    fill
                                                    sizes="128px"
                                                    className="object-contain p-2"
                                                />
                                            ) : (
                                                <span className="absolute inset-0 flex items-center justify-center font-pixel text-gray-700">?</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                                            {c.manufacturer?.name || 'UNKNOWN'}
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                                            {c.name}
                                        </h2>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-gray-400 mb-5">
                                            {spec.price_launch_usd ? (
                                                <span><span className="text-gray-600">PRICE</span> ${spec.price_launch_usd}</span>
                                            ) : null}
                                            {c.form_factor ? (
                                                <span><span className="text-gray-600">FORM</span> {c.form_factor.toUpperCase()}</span>
                                            ) : null}
                                            {spec.screen_size_inch ? (
                                                <span><span className="text-gray-600">SCREEN</span> {spec.screen_size_inch}&quot;</span>
                                            ) : null}
                                            {released ? (
                                                <span><span className="text-gray-600">RELEASED</span> {released}</span>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <Link
                                                href={`/consoles/${c.slug}`}
                                                className="px-5 py-2 border border-white/20 font-mono text-[11px] uppercase tracking-widest text-gray-300 hover:bg-white hover:text-black hover:border-white transition-colors"
                                            >
                                                Full specs
                                            </Link>
                                            {buyUrl && (
                                                <AffiliateLink
                                                    href={buyUrl}
                                                    productName={c.name}
                                                    linkType={spec.amazon_asin ? 'product' : 'search'}
                                                    placement="best_of"
                                                    className="px-5 py-2 bg-white text-black font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                                                >
                                                    {spec.amazon_asin ? 'Buy on Amazon' : 'Find on Amazon'}
                                                </AffiliateLink>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}

            <p className="text-center text-[10px] font-mono text-zinc-600 mt-10">
                As an Amazon Associate I earn from qualifying purchases.
            </p>

            <div className="mt-16 border-t border-white/10 pt-10 text-center">
                <p className="font-sans text-sm text-gray-400 mb-6">
                    Not sure which of these fits you? Answer eight quick questions.
                </p>
                <Link
                    href="/finder"
                    className="inline-block px-8 py-3 border border-violet-500/50 text-violet-300 font-mono text-xs uppercase tracking-widest hover:bg-violet-500 hover:text-black transition-colors"
                >
                    Run the Finder
                </Link>
            </div>
        </div>
    );
}
