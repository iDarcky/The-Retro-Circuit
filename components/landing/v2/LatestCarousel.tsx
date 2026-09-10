'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LandingDevice } from './types';

interface LatestCarouselProps {
    devices: LandingDevice[];
}

/* The five most recently catalogued devices, as a stage plus a filmstrip.
 *
 * Scroll-snap rather than a transform track: it gives swipe, momentum and keyboard
 * scrolling for free, and the active index is just a division of scrollLeft. There is
 * no autoplay — a homepage carousel that moves on its own gets clicked less, and the
 * filmstrip already shows all five at once, so nothing is hidden behind a timer.
 */
export default function LatestCarousel({ devices }: LatestCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const count = devices.length;

    // Read the active slide back off the scroll position, rAF-throttled.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                const width = track.clientWidth || 1;
                setIndex(Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / width))));
            });
        };

        track.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            track.removeEventListener('scroll', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [count]);

    const goTo = useCallback((next: number) => {
        const track = trackRef.current;
        if (!track) return;
        const clamped = Math.max(0, Math.min(count - 1, next));
        const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        track.scrollTo({ left: clamped * track.clientWidth, behavior: motionOk ? 'smooth' : 'auto' });
        setIndex(clamped);
    }, [count]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    };

    if (count === 0) return null;

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Latest devices added to the catalogue"
            onKeyDown={onKeyDown}
            className="border border-border-subtle bg-bg-secondary/40"
        >
            {/* Header strip: what this is, and where you are in it */}
            <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-4 py-3 md:px-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                    Latest additions
                </h2>
                <div className="flex items-center gap-3">
                    <span aria-live="polite" className="font-mono text-xs tabular-nums text-text-muted">
                        {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                    </span>
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => goTo(index - 1)}
                            disabled={index === 0}
                            aria-label="Previous device"
                            className="flex h-8 w-8 items-center justify-center border border-border-normal text-text-secondary transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(index + 1)}
                            disabled={index === count - 1}
                            aria-label="Next device"
                            className="-ml-px flex h-8 w-8 items-center justify-center border border-border-normal text-text-secondary transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stage */}
            <div
                ref={trackRef}
                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
            >
                {devices.map((device, i) => (
                    <div
                        key={device.slug}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} of ${count}: ${device.brand} ${device.name}`}
                        className="w-full shrink-0 snap-start"
                    >
                        <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2">
                            {/* Photo */}
                            <div className="relative flex aspect-[4/3] items-center justify-center border-b border-border-subtle bg-bg-primary p-6 sm:aspect-auto sm:min-h-[19rem] sm:border-b-0 sm:border-r">
                                {device.imageUrl ? (
                                    <Image
                                        src={device.imageUrl}
                                        alt={`${device.brand} ${device.name}`}
                                        fill
                                        className="object-contain p-6"
                                        sizes="(max-width: 640px) 100vw, 30vw"
                                        priority={i === 0}
                                    />
                                ) : (
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                                        No image
                                    </span>
                                )}
                            </div>

                            {/* Readout */}
                            <div className="flex min-w-0 flex-col justify-between gap-6 p-5 md:p-6">
                                <div>
                                    <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-500">
                                        {device.brand}
                                    </p>
                                    <h3 className="mt-1 font-mono text-2xl font-bold tracking-tight text-white md:text-3xl">
                                        {device.name}
                                    </h3>

                                    <dl className="mt-5 divide-y divide-border-subtle border-t border-border-subtle">
                                        {device.specs.map((spec) => (
                                            <div key={spec.label} className="flex items-baseline justify-between gap-4 py-2">
                                                <dt className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                                                    {spec.label}
                                                </dt>
                                                <dd className="text-right font-mono text-sm tabular-nums text-white">
                                                    {spec.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={`/consoles/${device.slug}`}
                                        className="border border-white bg-white px-4 py-2 font-mono text-xs uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                                    >
                                        Full specs
                                    </Link>
                                    <Link
                                        href={`/arena/${device.slug}`}
                                        className="border border-border-normal px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-cyan-500 hover:text-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                                    >
                                        Compare it
                                    </Link>
                                    {(device.status || device.released) && (
                                        <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-text-muted">
                                            {device.status ?? device.released}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filmstrip — all five stay visible, so nothing is hidden behind the control */}
            <div className="no-scrollbar flex gap-px overflow-x-auto border-t border-border-subtle bg-border-subtle">
                {devices.map((device, i) => (
                    <button
                        key={device.slug}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Show ${device.brand} ${device.name}`}
                        aria-current={i === index}
                        className={`flex min-w-[7.5rem] flex-1 flex-col gap-1 px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500 ${
                            i === index
                                ? 'bg-violet-600 text-white'
                                : 'bg-bg-primary text-text-secondary hover:bg-white/[0.04]'
                        }`}
                    >
                        <span className={`font-mono text-[10px] uppercase tracking-widest ${i === index ? 'text-white/70' : 'text-text-muted'}`}>
                            {device.brand}
                        </span>
                        <span className="truncate font-mono text-xs">{device.name}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
