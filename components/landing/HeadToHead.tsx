import Link from 'next/link';
import Image from 'next/image';
import { type HomeDevice, type HomePair } from './home-types';

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:-outline-offset-2';
const CARDS = 6;

function Thumb({ d }: { d: HomeDevice }) {
    return (
        <span className="relative w-16 h-12 shrink-0 group-hover:motion-safe:animate-[spriteBob_0.5s_steps(2,jump-none)_infinite]">
            {d.image && <Image src={d.image} alt="" fill sizes="64px" className="object-contain" />}
        </span>
    );
}

/**
 * The comparisons people look up most, as a compact grid of matchups. Each card is a plain
 * link to the full comparison, so crawlers reach them all; the rest sit in one line below.
 */
export default function HeadToHead({ pairs }: { pairs: HomePair[] }) {
    if (!pairs.length) return null;
    const more = pairs.slice(CARDS);

    return (
        <section className="px-5 md:px-12 pt-16 md:pt-28" aria-labelledby="vs-heading">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <h2 id="vs-heading" className="text-[28px] leading-tight sm:text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">Head to head.</h2>
                    <Link href="/arena" className="font-mono text-sm text-violet-400 hover:text-white">Pick any two →</Link>
                </div>
                <ul className="mt-6 md:mt-8 grid sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/10">
                    {pairs.slice(0, CARDS).map((p) => (
                        <li key={p.href} className="border-r border-b border-white/10">
                            <Link href={p.href} className={`group grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-4 h-full hover:bg-white/[0.04] transition-colors ${focus}`}>
                                <span className="flex flex-col items-start gap-2 min-w-0">
                                    <Thumb d={p.a} />
                                    <span className="text-sm font-semibold leading-snug group-hover:text-violet-300">{p.a.label}</span>
                                </span>
                                <span className="font-pixel text-[9px] text-text-secondary">VS</span>
                                <span className="flex flex-col items-end gap-2 min-w-0 text-right">
                                    <Thumb d={p.b} />
                                    <span className="text-sm font-semibold leading-snug group-hover:text-violet-300">{p.b.label}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
                {more.length > 0 && (
                    <p className="mt-5 text-sm leading-relaxed text-text-secondary">
                        Also compared often:{' '}
                        {more.map((p, i) => (
                            <span key={p.href}>
                                <Link href={p.href} className="text-zinc-300 hover:text-white underline-offset-4 hover:underline">{p.a.label} vs {p.b.label}</Link>
                                {i < more.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                )}
            </div>
        </section>
    );
}
