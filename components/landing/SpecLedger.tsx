'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/** One handheld as the homepage ledger shows it. Plain data, so it serializes cheaply. */
export interface LedgerDevice {
    slug: string;
    name: string;
    brand: string;
    image: string | null;
    chip: string | null;
    screen: string | null;
    resolution: string | null;
    price: number | null;
}

const dash = (v: string | null) => v ?? 'Not listed';

/**
 * The homepage hero's spec ledger: a list of the newest handhelds beside a "screen"
 * that reads out whichever row is pointed at or focused. Every row is a plain link to
 * the console page, so the server HTML carries all the internal links and the panel
 * starts on the first device without waiting for JavaScript.
 */
export default function SpecLedger({ devices }: { devices: LedgerDevice[] }) {
    const [active, setActive] = useState(0);
    // The draw-in only plays after the visitor picks a row, so the first paint (and LCP)
    // is never held back by an animation.
    const [touched, setTouched] = useState(false);
    const pick = (i: number) => {
        if (i === active) return;
        setTouched(true);
        setActive(i);
    };
    if (devices.length === 0) return null;
    const d = devices[Math.min(active, devices.length - 1)];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-border-subtle border border-border-subtle">
            {/* The screen */}
            <div className="lg:col-span-7 bg-bg-primary flex flex-col">
                <div
                    key={d.slug}
                    className={`${touched ? 'ledger-screen' : ''} relative aspect-[4/3] sm:aspect-[16/10] bg-[#101014] border-b border-border-subtle overflow-hidden`}
                >
                    {d.image ? (
                        <Image
                            src={d.image}
                            alt={d.name}
                            fill
                            priority={active === 0}
                            sizes="(max-width: 1024px) 100vw, 55vw"
                            className="object-contain p-8 md:p-12"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-text-muted">
                            No photo yet
                        </div>
                    )}
                    {touched && <div aria-hidden className="ledger-scan absolute inset-0 pointer-events-none" />}
                </div>

                <div className="p-5 md:p-8 flex flex-col gap-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <p className="text-2xl md:text-3xl font-bold tracking-tight text-white">{d.name}</p>
                        <p className="text-sm text-text-secondary">{d.brand}</p>
                    </div>
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 font-mono text-sm">
                        <div>
                            <dt className="text-text-secondary text-xs mb-1">Chip</dt>
                            <dd className="text-cyan-400">{dash(d.chip)}</dd>
                        </div>
                        <div>
                            <dt className="text-text-secondary text-xs mb-1">Screen</dt>
                            <dd className="text-cyan-400">{dash(d.screen)}</dd>
                        </div>
                        <div>
                            <dt className="text-text-secondary text-xs mb-1">Resolution</dt>
                            <dd className="text-cyan-400">{dash(d.resolution)}</dd>
                        </div>
                        <div>
                            <dt className="text-text-secondary text-xs mb-1">Launch price</dt>
                            <dd className="text-cyan-400">{d.price ? `$${d.price}` : 'Not listed'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* The rows */}
            <div className="lg:col-span-5 bg-bg-primary flex flex-col">
                <h2 className="px-5 md:px-6 py-4 text-sm text-text-secondary border-b border-border-subtle">
                    Newest in the archive
                </h2>
                <ul className="flex-1 flex flex-col">
                    {devices.map((dev, i) => {
                        const isActive = i === active;
                        return (
                            <li key={dev.slug} className="flex-1 border-b border-border-subtle last:border-b-0">
                                <Link
                                    href={`/consoles/${dev.slug}`}
                                    onMouseEnter={() => pick(i)}
                                    onFocus={() => pick(i)}
                                    aria-current={isActive ? 'true' : undefined}
                                    className={`group h-full min-h-[3.25rem] grid grid-cols-[0.5rem_1fr_auto] items-center gap-4 px-5 md:px-6 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500 hover:bg-white hover:text-black ${isActive ? 'bg-white/[0.04]' : ''}`}
                                >
                                    <span
                                        aria-hidden
                                        className={`w-2 h-2 ${isActive ? 'bg-violet-500' : 'bg-transparent'} group-hover:bg-black`}
                                    />
                                    <span className="min-w-0">
                                        <span className="block font-semibold truncate">{dev.name}</span>
                                        <span className="block text-xs text-text-secondary group-hover:text-zinc-600 truncate">
                                            {dev.brand}
                                        </span>
                                    </span>
                                    <span className="font-mono text-xs text-right text-text-secondary group-hover:text-black whitespace-nowrap">
                                        {dev.screen ?? ''}
                                        {dev.price ? <span className="block">${dev.price}</span> : null}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <Link
                    href="/consoles"
                    className="px-5 md:px-6 py-4 border-t border-border-subtle font-mono text-sm text-violet-400 hover:bg-white hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500"
                >
                    See all handhelds
                </Link>
            </div>
        </div>
    );
}
