import Link from 'next/link';
import type { Signal } from '../../lib/types/news';
import { formatArticleDate } from './date';

const SIGNAL_GREEN = '#7fb800';

/**
 * Pull the first Markdown link out of a signal, so the admin can write
 * "Anbernic announces a new clamshell [See Anbernic](/fabricators/anbernic)"
 * and get a sentence plus a separate link line. No database change needed.
 */
function splitLink(content: string): { text: string; link?: { label: string; href: string } } {
    const m = content.match(/\[([^\]]+)\]\(([^)\s]+)\)/);
    if (!m) return { text: content.trim() };
    const text = content.replace(m[0], '').replace(/\s{2,}/g, ' ').trim();
    return { text, link: { label: m[1], href: m[2] } };
}

/**
 * Signals: one-sentence news ("Anbernic announces..."), posted from /admin/signals.
 * A vertical list on desktop; on a phone, a row of cards you swipe sideways.
 */
export default function SignalsFeed({ signals }: { signals: Signal[] }) {
    if (signals.length === 0) return null;
    return (
        <section aria-labelledby="signals-title" className="border border-white/10 bg-[#111114] w-full">
            <h2
                id="signals-title"
                className="m-0 px-4 py-3 border-b border-white/10 font-pixel text-[12px] leading-relaxed flex items-center gap-2.5"
                style={{ color: SIGNAL_GREEN }}
            >
                <span aria-hidden="true" className="w-2 h-2 inline-block animate-pulse motion-reduce:animate-none" style={{ background: SIGNAL_GREEN }} />
                Signals
                <span className="ml-auto font-mono text-xs text-gray-500 lg:hidden">Swipe →</span>
            </h2>
            <ul className="m-0 p-0 list-none flex lg:block overflow-x-auto snap-x snap-mandatory lg:overflow-visible">
                {signals.map((s) => {
                    const { text, link } = splitLink(s.content);
                    const external = link && !link.href.startsWith('/');
                    return (
                        <li
                            key={s.id}
                            className="snap-start shrink-0 basis-[80%] sm:basis-[45%] lg:basis-auto grid grid-cols-[64px_minmax(0,1fr)] gap-3 px-4 py-3 border-r lg:border-r-0 lg:border-b last:border-0 border-white/10 text-[15px]"
                        >
                            <time dateTime={s.created_at} className="font-mono text-xs text-gray-500 pt-0.5">
                                {formatArticleDate(s.created_at).replace(/ \d{4}$/, '')}
                            </time>
                            <div className="text-gray-200">
                                {text}
                                {link &&
                                    (external ? (
                                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="block mt-0.5 font-mono text-[13px] hover:underline" style={{ color: SIGNAL_GREEN }}>
                                            {link.label} →
                                        </a>
                                    ) : (
                                        <Link href={link.href} className="block mt-0.5 font-mono text-[13px] hover:underline" style={{ color: SIGNAL_GREEN }}>
                                            {link.label} →
                                        </Link>
                                    ))}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
