import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '../../config/site';
import { BEST_OF_COLLECTIONS } from '../../lib/bestof/collections';
import { getArticles, SERIES_LABELS } from '../../lib/articles';
import { fetchArticleConsoles } from '../../lib/articles/consoles';
import PageHeader from '../../components/articles/PageHeader';
import { ArticleCard, ArticleRow, FeaturedArticle } from '../../components/articles/ArticleCard';

export const revalidate = false;

export const metadata: Metadata = {
    title: { absolute: 'News & Buying Guides for Retro Handhelds | The Retro Circuit' },
    description:
        'Buying guides, gift guides and news on retro handhelds. Every pick links to full specs, prices and side-by-side comparisons.',
    alternates: { canonical: '/news' },
    openGraph: {
        title: 'News & Guides | The Retro Circuit',
        description: 'Buying guides, gift guides and news on retro handhelds.',
        type: 'website',
    },
};

/** The series shown first on the page. Change this when the next season's guides land. */
const HEADLINE_SERIES = 'holiday-2026';

const sectionTitle = 'font-pixel text-[13px] leading-relaxed text-[#ff7a1a] m-0 mb-5';

export default async function NewsPage() {
    const articles = getArticles();
    const series = articles.filter((a) => a.series === HEADLINE_SERIES);
    const featured = series.find((a) => a.featured) ?? series[0];
    const restOfSeries = series.filter((a) => a !== featured);
    const otherGuides = articles.filter((a) => a.category === 'guide' && a.series !== HEADLINE_SERIES);
    const latest = articles.filter((a) => a.category !== 'guide');

    const covers = await fetchArticleConsoles(articles.map((a) => a.cover || ''));
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

    const jumps = [
        series.length > 0 && { href: '#holiday', label: SERIES_LABELS[HEADLINE_SERIES] ?? 'Featured guides' },
        { href: '#rankings', label: 'Rankings' },
        otherGuides.length > 0 && { href: '#guides', label: 'More guides' },
        latest.length > 0 && { href: '#latest', label: 'News' },
    ].filter(Boolean) as { href: string; label: string }[];

    return (
        <div className="w-full bg-[#0a0a0c] min-h-screen text-white font-sans pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <PageHeader lead="News &" accent="Guides" sub="Buying guides, gift ideas and news on retro handhelds. Every pick links to full specs and prices.">
                <nav aria-label="On this page" className="flex flex-wrap gap-2 mt-6">
                    {jumps.map((j) => (
                        <a
                            key={j.href}
                            href={j.href}
                            className="font-mono text-[13px] border border-white/10 text-gray-400 px-3 min-h-[40px] inline-flex items-center hover:border-[#ff7a1a] hover:text-[#ff7a1a] transition-colors"
                        >
                            {j.label}
                        </a>
                    ))}
                </nav>
            </PageHeader>

            <div className="max-w-[1240px] mx-auto px-4 md:px-[4vw]">
                {featured && (
                    <section id="holiday" className="py-10 md:py-12 scroll-mt-20">
                        <h2 className={sectionTitle}>{SERIES_LABELS[HEADLINE_SERIES] ?? 'Featured guides'}</h2>
                        <FeaturedArticle article={featured} image={coverOf(featured.cover)} />
                        {restOfSeries.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {restOfSeries.map((a) => (
                                    <ArticleCard key={a.slug} article={a} image={coverOf(a.cover)} />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                <section id="rankings" className="py-10 md:py-12 border-t border-white/10 scroll-mt-20">
                    <h2 className={sectionTitle}>Always-updated rankings</h2>
                    <p className="text-gray-400 max-w-[62ch] -mt-2 mb-6">
                        Ranked straight from our spec and emulation data, so they change as new handhelds arrive.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                        {BEST_OF_COLLECTIONS.map((c) => (
                            <Link
                                key={c.slug}
                                href={`/best/${c.slug}`}
                                className="group bg-[#0a0a0c] p-5 flex flex-col gap-2 hover:bg-[#111114] transition-colors"
                            >
                                <span className="font-mono text-xs text-cyan-400">{c.shortLabel}</span>
                                <span className="font-semibold text-[17px] leading-snug group-hover:text-[#ff7a1a] transition-colors">{c.title}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {otherGuides.length > 0 && (
                    <section id="guides" className="py-10 md:py-12 border-t border-white/10 scroll-mt-20">
                        <h2 className={sectionTitle}>More guides</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {otherGuides.map((a) => (
                                <ArticleCard key={a.slug} article={a} image={coverOf(a.cover)} />
                            ))}
                        </div>
                    </section>
                )}

                {latest.length > 0 && (
                    <section id="latest" className="py-10 md:py-12 border-t border-white/10 scroll-mt-20">
                        <h2 className={sectionTitle}>News</h2>
                        <div className="border-t border-white/10">
                            {latest.map((a) => (
                                <ArticleRow key={a.slug} article={a} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
