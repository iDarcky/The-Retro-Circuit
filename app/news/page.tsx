import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '../../config/site';
import { BEST_OF_COLLECTIONS } from '../../lib/bestof/collections';
import { getArticles } from '../../lib/articles';
import { fetchArticleConsoles } from '../../lib/articles/consoles';
import PageHeader from '../../components/articles/PageHeader';
import { ArticleListItem, FeaturedArticle } from '../../components/articles/ArticleCard';
import SignalsFeed from '../../components/articles/SignalsFeed';
import { fetchActiveSignals } from '../actions/signals';

// Rebuilt once a day so expired Signals drop off on their own (see SIGNAL_DAYS). One
// regeneration a day for one page; posting a Signal also revalidates it straight away.
export const revalidate = 86400;

/** A Signal is shown for this many days after it is posted, then hides itself. */
const SIGNAL_DAYS = 14;

export const metadata: Metadata = {
    title: { absolute: 'News & Buying Guides for Retro Handhelds | The Retro Circuit' },
    description:
        'Quick news, buying guides and always-updated rankings for retro handhelds. Every pick links to full specs, prices and comparisons.',
    alternates: { canonical: '/news' },
    openGraph: {
        title: 'News & Guides | The Retro Circuit',
        description: 'Buying guides, gift guides and news on retro handhelds.',
        type: 'website',
    },
};


const sectionTitle = 'font-pixel text-[13px] leading-relaxed text-[#ff7a1a] m-0 mb-5';

export default async function NewsPage() {
    const articles = getArticles();
    // Newest first. The article marked `featured` gets the big card; everything else follows.
    const featured = articles.find((a) => a.featured) ?? articles[0];
    const rest = articles.filter((a) => a !== featured);

    const [covers, allSignals] = await Promise.all([
        fetchArticleConsoles(articles.map((a) => a.cover || '')),
        fetchActiveSignals(),
    ]);
    const cutoff = Date.now() - SIGNAL_DAYS * 24 * 60 * 60 * 1000;
    const signals = allSignals.filter((sg) => new Date(sg.created_at).getTime() >= cutoff);
    const coverOf = (slug?: string) => (slug ? covers.get(slug)?.image_url : undefined);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'News & Guides',
        description: 'Buying guides, gift guides and news on retro handhelds.',
        url: `${siteConfig.url}/news`,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
                ...articles.filter((a) => !a.draft).map((a) => `/news/${a.slug}`),
                ...BEST_OF_COLLECTIONS.map((c) => `/best/${c.slug}`),
            ].map((path, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteConfig.url}${path}` })),
        },
    };

    return (
        <div className="w-full bg-[#0a0a0c] min-h-screen text-white font-sans pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <PageHeader lead="News &" accent="Guides" sub="Quick signals, buying guides and rankings for retro handhelds." />

            {/* Desktop: guides left, Signals + Rankings in a sticky sidebar on the right.
                Phone: Signals first as a swipe row, then guides, then Rankings. */}
            <div className="max-w-[1240px] mx-auto px-4 md:px-[4vw] pt-8 md:pt-10 flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start gap-8">
                <div className="min-w-0 flex flex-col gap-12 order-2 lg:order-none">
                    {featured ? (
                        <section id="latest" className="scroll-mt-20">
                            <h2 className={sectionTitle}>Latest</h2>
                            <FeaturedArticle article={featured} image={coverOf(featured.cover)} />
                            {rest.length > 0 && (
                                <div className="flex flex-col gap-3 mt-3">
                                    {rest.map((a) => (
                                        <ArticleListItem key={a.slug} article={a} image={coverOf(a.cover)} />
                                    ))}
                                </div>
                            )}
                        </section>
                    ) : (
                        <p className="text-gray-500 font-mono text-sm">Nothing here yet.</p>
                    )}
                </div>

                <aside className="contents lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-24">
                    <div className="order-1 lg:order-none min-w-0">
                        <SignalsFeed signals={signals} />
                    </div>
                    <section id="rankings" aria-labelledby="rankings-title" className="order-3 lg:order-none border border-white/10 bg-[#111114] scroll-mt-20">
                        <h2 id="rankings-title" className="m-0 px-4 py-3 border-b border-white/10 font-pixel text-[12px] leading-relaxed text-[#ff7a1a]">
                            Rankings
                        </h2>
                        <p className="m-0 px-4 pt-3 text-[13px] text-gray-500">Update automatically as new handhelds arrive.</p>
                        <ul className="m-0 p-0 list-none">
                            {BEST_OF_COLLECTIONS.map((c) => (
                                <li key={c.slug} className="border-b border-white/10 last:border-0">
                                    <Link href={`/best/${c.slug}`} className="block px-4 py-2.5 text-[15px] hover:text-[#ff7a1a] transition-colors">
                                        {c.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    );
}
