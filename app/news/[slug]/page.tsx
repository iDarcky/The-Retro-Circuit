import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteConfig } from '../../../config/site';
import { getArticle, getArticles, SERIES_LABELS, CATEGORY_LABELS } from '../../../lib/articles';
import { fetchArticleConsoles } from '../../../lib/articles/consoles';
import PageHeader from '../../../components/articles/PageHeader';
import ArticleBody, { hasQuickPicks } from '../../../components/articles/ArticleBody';
import { formatArticleDate } from '../../../components/articles/date';
import AffiliateDisclosure from '../../../components/console/swiss/AffiliateDisclosure';

export const revalidate = false;
// Articles are files in the repo, so every one is known at build time.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return getArticles().map((a) => ({ slug: a.slug }));
}

async function coverImage(slug: string, explicit?: string): Promise<string | undefined> {
    if (explicit) return explicit;
    const map = await fetchArticleConsoles([slug]);
    return map.get(slug)?.image_url || undefined;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { slug } = await props.params;
    const article = getArticle(slug);
    if (!article) return { title: 'Article not found' };
    const image = article.cover ? await coverImage(article.cover, article.image) : article.image;

    return {
        title: { absolute: `${article.title} | The Retro Circuit` },
        description: article.description,
        alternates: { canonical: `/news/${article.slug}` },
        robots: article.draft ? { index: false, follow: false } : undefined,
        openGraph: {
            title: article.title,
            description: article.description,
            type: 'article',
            url: `${siteConfig.url}/news/${article.slug}`,
            publishedTime: article.date,
            modifiedTime: article.updated || article.date,
            images: image ? [{ url: image }] : undefined,
        },
        twitter: {
            card: image ? 'summary_large_image' : 'summary',
            title: article.title,
            description: article.description,
            images: image ? [image] : undefined,
        },
    };
}

export default async function ArticlePage(props: Props) {
    const { slug } = await props.params;
    const article = getArticle(slug);
    if (!article) notFound();

    const consoles = await fetchArticleConsoles(article.consoles);
    const url = `${siteConfig.url}/news/${article.slug}`;
    const cover = article.image || (article.cover ? consoles.get(article.cover)?.image_url : undefined);
    const quick = hasQuickPicks(article, consoles);
    const toc = [...(quick ? [{ id: 'quick-picks', text: 'Quick picks' }] : []), ...article.headings];

    const others = getArticles().filter((a) => a.slug !== article.slug);
    const more = [
        ...others.filter((a) => article.series && a.series === article.series),
        ...others.filter((a) => !article.series || a.series !== article.series),
    ].slice(0, 3);

    const listed = article.consoles.map((s) => consoles.get(s)).filter(Boolean);
    // "Best retro gifts | under $100": the part after the bar gets the page colour.
    const [headLead, headAccent] = article.headline.includes('|')
        ? article.headline.split('|').map((s) => s.trim())
        : ['', article.headline];
    const seriesLabel = article.series ? SERIES_LABELS[article.series] : undefined;

    const jsonLd: any[] = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            dateModified: article.updated || article.date,
            mainEntityOfPage: url,
            url,
            image: cover ? [cover] : undefined,
            author: { '@type': 'Organization', name: article.author, url: siteConfig.url },
            publisher: { '@type': 'Organization', name: 'The Retro Circuit', url: siteConfig.url },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'News & Guides', item: `${siteConfig.url}/news` },
                { '@type': 'ListItem', position: 2, name: article.title, item: url },
            ],
        },
    ];
    if (article.category === 'guide' && listed.length > 0) {
        jsonLd.push({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: article.title,
            numberOfItems: listed.length,
            itemListElement: listed.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: [c!.manufacturer?.name, c!.name].filter(Boolean).join(' '),
                url: `${siteConfig.url}/consoles/${c!.slug}`,
            })),
        });
    }
    if (article.faq.length > 0) {
        jsonLd.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faq.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        });
    }

    return (
        <div className="w-full bg-[#0a0a0c] min-h-screen text-white font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {article.draft && (
                <div className="bg-[#ff7a1a] text-black font-mono text-sm text-center py-2 px-4">
                    Draft: only visible on preview links, not on the live site.
                </div>
            )}

            <PageHeader
                lead={headLead}
                accent={headAccent}
                sub={article.description}
                above={
                    <nav aria-label="Breadcrumb" className="mb-5 font-mono text-[13px] text-gray-500">
                        <Link href="/news" className="hover:text-[#ff7a1a] transition-colors">News &amp; Guides</Link>
                        <span className="mx-2">/</span>
                        <span>{seriesLabel || CATEGORY_LABELS[article.category]}</span>
                    </nav>
                }
            >
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5 font-mono text-[13px] text-gray-500">
                    <span>By {article.author}</span>
                    <span>
                        {article.updated ? `Updated ${formatArticleDate(article.updated)}` : formatArticleDate(article.date)}
                    </span>
                    <span>{article.readMinutes} min read</span>
                </div>
            </PageHeader>

            <div className="max-w-[1240px] mx-auto px-4 md:px-[4vw] grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6 lg:gap-12 pt-8 lg:pt-10 pb-20">
                {toc.length > 1 ? (
                    <nav aria-label="Contents" className="lg:sticky lg:top-24 self-start flex flex-row flex-wrap lg:flex-col gap-1.5 lg:gap-0.5 lg:border-l border-white/10">
                        <span className="w-full font-mono text-[13px] text-gray-500 lg:pl-3.5 pb-1.5">Contents</span>
                        {toc.map((h) => (
                            <a
                                key={h.id}
                                href={`#${h.id}`}
                                className="text-[15px] text-gray-400 hover:text-white border border-white/10 lg:border-0 lg:border-l lg:border-transparent lg:-ml-px px-2.5 py-1.5 lg:pl-3.5 lg:hover:border-[#ff7a1a] transition-colors"
                            >
                                {h.text}
                            </a>
                        ))}
                    </nav>
                ) : (
                    <div className="hidden lg:block" />
                )}

                <article className="max-w-[720px] min-w-0">
                    <ArticleBody article={article} consoles={consoles} />

                    {listed.length > 0 && <AffiliateDisclosure className="mt-10" />}

                    {more.length > 0 && (
                        <section className="mt-14">
                            <h2 className="font-sans font-bold text-[26px] text-white mb-4">
                                {article.series && more.some((a) => a.series === article.series) ? 'More holiday guides' : 'Keep reading'}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {more.map((a) => (
                                    <Link
                                        key={a.slug}
                                        href={`/news/${a.slug}`}
                                        className="border border-white/10 bg-[#111114] p-4 font-semibold text-[15px] hover:border-[#ff7a1a] transition-colors"
                                    >
                                        <span className="block font-mono text-xs font-normal text-gray-500 mb-1.5">{CATEGORY_LABELS[a.category]}</span>
                                        {a.title}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </div>
        </div>
    );
}
