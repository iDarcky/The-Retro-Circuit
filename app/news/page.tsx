import Link from 'next/link';
import { siteConfig } from '../../config/site';
import { Metadata } from 'next';
import { fetchActiveSignals } from '../actions/signals';
import { fetchPublicReviews } from '../actions/reviews';
import { fetchPublicNews } from '../actions/news';
import { fetchVaultConsoles } from '../actions/consoles';
import DeviceCard from '../../components/browse-v2/DeviceCard';
import Bit from '../../components/brand/Bit';
import { PageTitle } from '../../components/layout/PageTitle';

// BETA BRANCH: redesigned in place. Notes from the editor lead, then reviews and news when
// there are any, then the newest handhelds in the catalogue so the page is never empty.
export const revalidate = false;

export const metadata: Metadata = {
    title: 'News and Updates | The Retro Circuit',
    description: 'Notes from the editor, reviews, and the newest retro handhelds added to the catalogue.',
    alternates: { canonical: '/news' },
};

const SIGNAL_COLOR: Record<string, string> = { status: 'bg-cyan-500', alert: 'bg-rose-500', update: 'bg-violet-500', thought: 'bg-orange-500' };
const SIGNAL_LABEL: Record<string, string> = { status: 'Status', alert: 'Heads up', update: 'Update', thought: 'Thought' };
const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function NewsPage() {
    const [signals, reviews, news, consoles] = await Promise.all([
        fetchActiveSignals().catch(() => []),
        fetchPublicReviews().catch(() => []),
        fetchPublicNews().catch(() => []),
        fetchVaultConsoles().catch(() => []),
    ]);

    const newest = consoles
        .map((c: any) => ({ c, s: c.specs || {} }))
        .filter(({ s }) => s.release_date)
        .sort((a, b) => new Date(b.s.release_date).getTime() - new Date(a.s.release_date).getTime())
        .slice(0, 6)
        .map(({ c, s }) => ({
            slug: c.slug, name: c.name, brand: c.manufacturer?.name, image: c.image_url, shape: c.form_factor,
            price: Number(s.price_launch_usd) >= 20 ? Math.round(Number(s.price_launch_usd)) : null,
            chip: s.soc_name, screen: s.screen_size_inch, os: s.os_family, year: String(s.release_date).slice(0, 4),
        }));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'News and Updates',
        url: `${siteConfig.url}/news`,
    };

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-12">
                <div className="max-w-[1100px] mx-auto">
                    <PageTitle lead="News &" accent="Signals" color="news" />
                    <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-[52ch]">New releases, notes from the editor, and what&apos;s worth knowing this week.</p>
                </div>
            </header>

            <div className="px-5 md:px-12">
                <div className="max-w-[1100px] mx-auto space-y-20 md:space-y-28">
                    {/* Editor's notes */}
                    <section aria-labelledby="notes">
                        <h2 id="notes" className="font-pixel text-base md:text-xl leading-snug text-orange-400">From the editor</h2>
                        {signals.length > 0 ? (
                            <ol className="mt-8 border-l border-white/10">
                                {signals.map((s: any) => (
                                    <li key={s.id} className="relative pl-8 pb-10 last:pb-0">
                                        <span className={`absolute -left-[5px] top-1.5 w-[9px] h-[9px] ${SIGNAL_COLOR[s.type] ?? 'bg-white'}`} aria-hidden />
                                        <p className="font-mono text-xs text-text-secondary">{fmt(s.created_at)} · {SIGNAL_LABEL[s.type] ?? s.type}</p>
                                        <p className="mt-2 text-lg md:text-xl leading-relaxed max-w-[62ch]">{s.content}</p>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="mt-6 text-text-secondary">Nothing yet.</p>
                        )}
                    </section>

                    {/* Reviews, only when there are any */}
                    {reviews.length > 0 && (
                        <section aria-labelledby="reviews">
                            <h2 id="reviews" className="font-pixel text-base md:text-xl leading-snug text-orange-400">Reviews</h2>
                            <div className="mt-8 grid md:grid-cols-2 gap-4">
                                {reviews.map((r: any) => (
                                    <Link key={r.id} href={`/consoles/${r.console_slug}`} className="group bg-cyan-600 p-6 md:p-8 flex flex-col hover:bg-white hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="font-mono text-xs opacity-80">{r.console_name} · {fmt(r.published_at)}</span>
                                            <span className="font-pixel text-2xl">{r.score}<span className="text-xs opacity-70">/10</span></span>
                                        </div>
                                        <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.02em] leading-tight">{r.title}</h3>
                                        {r.summary && <p className="mt-3 leading-relaxed opacity-90 line-clamp-3">{r.summary}</p>}
                                        <span className="mt-6 font-mono text-sm">Read it →</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* News posts, only when there are any */}
                    {news.length > 0 && (
                        <section aria-labelledby="posts">
                            <h2 id="posts" className="font-pixel text-base md:text-xl leading-snug text-orange-400">Posts</h2>
                            <ul className="mt-8 border-t border-white/10">
                                {news.map((n: any) => (
                                    <li key={n.id} className="border-b border-white/10 py-6 grid md:grid-cols-[140px_1fr] gap-2 md:gap-8">
                                        <span className="font-mono text-xs text-text-secondary">{fmt(n.published_at)}<br /><span className="text-violet-400">{n.category}</span></span>
                                        <div>
                                            <h3 className="text-xl font-bold">{n.title}</h3>
                                            {n.excerpt && <p className="mt-2 text-text-secondary leading-relaxed">{n.excerpt}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Newest handhelds */}
                    <section aria-labelledby="newest">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <h2 id="newest" className="font-pixel text-base md:text-xl leading-snug text-orange-400">Newest handhelds</h2>
                            <Link href="/consoles" className="font-mono text-sm text-violet-400 hover:text-white">See all →</Link>
                        </div>
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 border-l border-t border-white/10">
                            {newest.map((d, i) => <DeviceCard key={d.slug} d={d} priority={i < 3} />)}
                        </div>
                    </section>

                    {/* Bit sign-off */}
                    <section className="flex flex-col sm:flex-row items-center gap-6 border border-white/10 p-8 md:p-10">
                        <Bit size={110} />
                        <div>
                            <p className="font-pixel text-[11px] leading-relaxed">More stories are on the way.</p>
                            <p className="mt-2 text-text-secondary">Got a tip or a handheld we&apos;re missing? <a href="mailto:contact@theretrocircuit.com" className="text-violet-400 hover:text-white">contact@theretrocircuit.com</a></p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
