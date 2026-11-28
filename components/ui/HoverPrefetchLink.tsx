'use client';

import Link from 'next/link';
import { useState, type ComponentProps } from 'react';

/* A Link that prefetches on intent (hover, focus, touch) instead of on sight.
 *
 * By default Next.js prefetches every link that scrolls into view. On a grid of 80 console
 * cards that is 80+ background page fetches per visit, and each one that misses Vercel's
 * CDN is an ISR read. Automated browsers trigger the same fan-out, which put the site at
 * 800k+ ISR reads a month against roughly 700 real page views. Prefetching on intent keeps
 * clicks fast for people and costs nothing for a page that is only looked at. */
export default function HoverPrefetchLink({
    onMouseEnter,
    onFocus,
    onTouchStart,
    ...props
}: ComponentProps<typeof Link>) {
    const [active, setActive] = useState(false);
    return (
        <Link
            {...props}
            prefetch={active ? null : false}
            onMouseEnter={(e) => { setActive(true); onMouseEnter?.(e); }}
            onFocus={(e) => { setActive(true); onFocus?.(e); }}
            onTouchStart={(e) => { setActive(true); onTouchStart?.(e); }}
        />
    );
}
