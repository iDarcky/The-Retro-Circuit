import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const revalidate = false;

/* The homepage had no metadata of its own, so it inherited the layout defaults and, more
 * to the point, shipped without a canonical — the only page type on the site that did.
 * It is also the page that can least afford it: 132 clicks in August at position 5.5,
 * more than every other page on the site combined, which makes any duplicate of it
 * (trailing slash, a utm-tagged share, an index.html variant) a split of the one bit of
 * authority the site has.
 *
 * The title is written for the result line rather than for the page. "Welcome to the
 * Circuit" is the brand moment in the H1 and belongs there; nobody searches for it.
 */
export const metadata: Metadata = {
    title: {
        absolute: 'Retro Handheld Specs, Compared | The Retro Circuit',
    },
    description:
        'Every retro handheld in one comparable spec table. Put two devices side by side, check emulation performance system by system, or answer eight questions and get a recommendation.',
    alternates: { canonical: '/' },
    openGraph: {
        title: 'Retro Handheld Specs, Compared | The Retro Circuit',
        description:
            'Every retro handheld in one comparable spec table. Compare two devices side by side or find the one that fits.',
        url: '/',
    },
};

export default function HomePage() {
    return (
        <div className="w-full">
            <LandingPage />
        </div>
    );
}
