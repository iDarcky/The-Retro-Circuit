import Link from 'next/link';
import { fetchLatestConsoles } from '../../app/actions/latest';
import { fetchConsoleList, fetchConsoleAndVariantCounts } from '../../app/actions/consoles';
import { buildArenaPath } from '../../lib/arena/resolve';
import { toLandingDevice } from './toDevice';
import LatestCarousel from './LatestCarousel';
import ArenaBar from './ArenaBar';
import NewsletterPanel from './NewsletterPanel';
import CircuitPattern from './CircuitPattern';

/* Comparisons the search data already shows people looking for. Kept short on
 * purpose: three is a prompt, ten is a directory. Mirrors SEARCHED_PAIRS in
 * lib/arena/pairs.ts, so these paths are prebuilt rather than rendered on demand. */
const MATCHUPS: [string, string][] = [
    ['ayn-odin-2-mini', 'ayn-odin-3'],
    ['retroid-pocket-mini', 'retroid-pocket-mini-v2'],
    ['ayaneo-pocket-s2', 'ayn-odin-3'],
];

/* Shortlists for the reader who wants a page, not a quiz. */
const SHORTLISTS = [
    { slug: 'best-retro-handhelds-under-100', label: 'Under $100' },
    { slug: 'best-handhelds-for-ps2-emulation', label: 'PS2 emulation' },
    { slug: 'best-clamshell-handhelds', label: 'Clamshells' },
    { slug: 'best-premium-handhelds', label: 'Premium' },
];

export default async function LandingPage() {
    const [latest, allConsoles, counts] = await Promise.all([
        fetchLatestConsoles(5),
        fetchConsoleList(),
        fetchConsoleAndVariantCounts(),
    ]);

    const devices = latest.map(toLandingDevice);
    const searchable = allConsoles.map((c) => ({ name: c.name, slug: c.slug }));

    // Only offer a matchup when both sides are actually published, so the row never
    // links at a device that has been unpublished since this list was written.
    const bySlug = new Map(allConsoles.map((c) => [c.slug, c]));
    const matchups = MATCHUPS
        .filter(([a, b]) => bySlug.has(a) && bySlug.has(b))
        .map(([a, b]) => ({
            path: buildArenaPath(a, b),
            left: bySlug.get(a)!.name,
            right: bySlug.get(b)!.name,
        }));

    return (
        <div className="min-h-screen bg-bg-primary font-sans text-text-primary">

            {/* HERO — the statement on the left, the newest hardware on the right.
              *
              * The traces are the reason the background is not flat black. They are the
              * site's own metaphor rather than decoration borrowed from somewhere else,
              * and they sit at 0.15 alpha with no glow, so they read as substrate and
              * never compete with the headline. Violet here, cyan at the compare tool;
              * nowhere else, because a texture on every section stops being a texture. */}
            <header className="relative overflow-hidden border-b border-border-subtle px-6 pb-10 pt-10 md:px-12 md:pb-14 md:pt-16">
                <CircuitPattern
                    accentColor="violet"
                    className="absolute inset-0 h-full w-full"
                />
                <div className="relative z-10 mx-auto grid max-w-[1600px] items-center gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="min-w-0 lg:col-span-5">
                        <h1 className="text-balance font-pixel text-[8vw] uppercase leading-[1.35] tracking-tight text-white sm:text-[30px] lg:text-[34px] xl:text-[38px]">
                            Welcome to<br /><span className="text-violet-500">the Circuit_</span>
                        </h1>

                        <p className="mt-6 max-w-md text-lg leading-relaxed text-text-secondary">
                            {counts.consoles} devices and {counts.variants} configurations in one
                            comparable spec table. Eight questions gets you a pick and the runners-up.
                        </p>

                        {/* Browse leads, the finder follows. The finder is still Beta and
                          * drew 12 impressions in August, so it gets a button rather than
                          * the primary action — enough to be findable, since search never
                          * sends anyone to it. */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/consoles"
                                className="inline-flex touch-manipulation items-center justify-center border border-violet-500 bg-violet-600 px-7 py-4 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                            >
                                Browse all {counts.consoles}
                            </Link>
                            <Link
                                href="/finder"
                                className="inline-flex touch-manipulation items-center justify-center border border-border-normal px-7 py-4 font-mono text-sm uppercase tracking-widest text-text-secondary transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Help me choose
                            </Link>
                        </div>
                    </div>

                    <div className="min-w-0 lg:col-span-7">
                        <LatestCarousel devices={devices} />
                    </div>
                </div>
            </header>

            {/* Arena, as the tool itself, in the slot under the hero.
              *
              * The August export puts comparison pages ahead of everything else — they
              * out-rank console pages 13.5 to 18.2 and convert nine times better — and
              * the homepage is the only page on the site with clicks to spend (132 of
              * them, against 11 everywhere else combined). So the best section goes to
              * the strongest asset, and the matchup links below the picker feed the
              * comparison URLs the index is not growing fast enough to reach. */}
            <ArenaBar consoles={searchable} matchups={matchups} deviceCount={counts.consoles} />

            {/* Shortlists — the self-serve lane, kept to one line */}
            <section className="border-b border-border-subtle px-6 py-8 md:px-12">
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-3">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                        Or start from a shortlist
                    </span>
                    {SHORTLISTS.map((list) => (
                        <Link
                            key={list.slug}
                            href={`/best/${list.slug}`}
                            className="border-b border-border-normal pb-0.5 font-mono text-sm text-text-secondary transition-colors hover:border-violet-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                        >
                            {list.label}
                        </Link>
                    ))}
                </div>
            </section>

            <NewsletterPanel deviceCount={counts.consoles} />
        </div>
    );
}
