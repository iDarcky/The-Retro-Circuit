'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/* The page does not scroll on the window.
 *
 * MainLayout is `h-screen flex flex-col overflow-hidden` with a `flex-1 overflow-y-auto`
 * child holding the content, so the document never scrolls: window.scrollY is 0 forever
 * and window scroll events never fire. Anything that watched window.scrollY was dead
 * code, which is why the console tab bar never revealed the device name or price.
 *
 * Two consequences worth remembering:
 *   - Read scrollTop from the container, not the window.
 *   - `position: sticky; top: 0` inside that container already sits directly under the
 *     site header, because the container itself begins there. Offsetting by the header
 *     height pushes the element down and opens a gap.
 */

/** Nearest scrollable ancestor of `from`, or null when the window is the scroller. */
function findScrollRoot(from: HTMLElement | null): HTMLElement | null {
    const tagged = from?.closest<HTMLElement>('[data-scroll-root]');
    if (tagged) return tagged;
    let el = from?.parentElement ?? null;
    while (el) {
        const oy = getComputedStyle(el).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) return el;
        el = el.parentElement;
    }
    return null;
}

export interface ScrollRoot {
    /** Attach to an element inside the scrolling area so the root can be found. */
    ref: RefObject<HTMLDivElement | null>;
    /** True once the scroller has passed `threshold` pixels. */
    past: boolean;
    /** Scroll an element into view, accounting for whichever thing is scrolling. */
    scrollToEl: (el: HTMLElement, offset?: number) => void;
    /** The scrolling element, or null when it is the window. */
    root: HTMLElement | null;
}

export function useScrollRoot(threshold = 420): ScrollRoot {
    const ref = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<HTMLElement | null>(null);
    const [past, setPast] = useState(false);

    useEffect(() => {
        const root = findScrollRoot(ref.current);
        rootRef.current = root;

        const target: HTMLElement | Window = root ?? window;
        const read = () => (root ? root.scrollTop : window.scrollY);
        const onScroll = () => setPast(read() > threshold);

        onScroll();
        target.addEventListener('scroll', onScroll, { passive: true });
        return () => target.removeEventListener('scroll', onScroll);
    }, [threshold]);

    const scrollToEl = useCallback((el: HTMLElement, offset = 0) => {
        const root = rootRef.current;
        if (root) {
            const top = el.getBoundingClientRect().top
                - root.getBoundingClientRect().top
                + root.scrollTop
                - offset;
            root.scrollTo({ top, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
    }, []);

    return { ref, past, scrollToEl, root: rootRef.current };
}
