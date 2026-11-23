import Link from 'next/link';
import SpecLedger, { type LedgerDevice } from './SpecLedger';
import QuickCompare from './QuickCompare';
import EmailCTA from './EmailCTA';

export interface Matchup {
    href: string;
    a: string;
    b: string;
}

export interface Guide {
    href: string;
    label: string;
    title: string;
    description: string;
}

export interface LandingViewProps {
    counts: { consoles: number; variants: number };
    devices: LedgerDevice[];
    matchups: Matchup[];
    guides: Guide[];
    searchableConsoles: { name: string; slug: string; manufacturerSlug?: string }[];
}

/* What the Finder asks, in order. Mirrors QUESTIONS in components/finder/FinderFlow.tsx. */
const FINDER_STEPS = [
    'What kind of player you are',
    'How you like to hold it',
    'What you want to play',
    'Your budget',
    'How portable it should be',
    'How much setup you will do',
    'Any must-have features',
    'The look you are after',
];

const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';

/** Presentational homepage. All data comes in as props so the page stays server-rendered. */
export default function LandingView({ counts, devices, matchups, guides, searchableConsoles }: LandingViewProps) {
    return (
        <div className="bg-bg-primary min-h-screen text-text-primary font-sans">
            {/* 1. Hero: the headline, then the ledger as the thing to touch */}
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-12 md:pb-20 border-b border-border-subtle">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 md:mb-14">
                        <h1 className="lg:col-span-8 font-pixel text-[1.6rem] leading-[1.35] sm:text-4xl sm:leading-[1.3] xl:text-[3.25rem] xl:leading-[1.25] text-white">
                            Retro handheld specs, side by side.
                        </h1>
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <p className="text-lg leading-relaxed text-text-secondary max-w-[44ch]">
                                {counts.consoles > 0
                                    ? `${counts.consoles} handhelds and ${counts.variants} configurations, measured the same way, so you can see what each one actually plays before you buy.`
                                    : 'Every handheld measured the same way, so you can see what each one actually plays before you buy.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/consoles"
                                    className={`inline-flex justify-center items-center bg-violet-600 border border-violet-500 text-white font-mono text-sm px-6 py-3.5 hover:bg-white hover:text-black hover:border-white transition-colors ${focusRing}`}
                                >
                                    Browse handhelds
                                </Link>
                                <Link
                                    href="/arena"
                                    className={`inline-flex justify-center items-center border border-border-normal text-white font-mono text-sm px-6 py-3.5 hover:bg-white hover:text-black hover:border-white transition-colors ${focusRing}`}
                                >
                                    Compare two
                                </Link>
                            </div>
                        </div>
                    </div>

                    <SpecLedger devices={devices} />
                </div>
            </header>

            {/* 2. Matchups: the comparisons people search for, plus a picker for any pair */}
            <section className="px-5 md:px-12 py-14 md:py-24 border-b border-border-subtle" aria-labelledby="matchups-heading">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
                    <div className="lg:col-span-7">
                        <h2 id="matchups-heading" className="font-pixel text-lg md:text-2xl leading-snug text-white mb-4">
                            Popular head-to-heads
                        </h2>
                        <p className="text-text-secondary leading-relaxed max-w-[56ch] mb-8">
                            The comparisons buyers look up most. Each one lines up chip, screen, battery and
                            what every system runs at.
                        </p>
                        {matchups.length > 0 && (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-subtle border border-border-subtle">
                                {matchups.map((m, i) => (
                                    <li key={m.href} className={`bg-bg-primary ${i >= 6 ? 'hidden sm:block' : ''}`}>
                                        <Link
                                            href={m.href}
                                            className={`group flex flex-col gap-0.5 h-full px-5 py-4 hover:bg-white hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500`}
                                        >
                                            <span className="font-semibold">{m.a}</span>
                                            <span className="font-mono text-xs text-violet-400 group-hover:text-violet-700">vs</span>
                                            <span className="font-semibold">{m.b}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Link
                            href="/arena"
                            className={`inline-block mt-6 font-mono text-sm text-violet-400 border-b border-violet-500 pb-0.5 hover:text-white hover:border-white transition-colors ${focusRing}`}
                        >
                            Open the Arena
                        </Link>
                    </div>

                    <div className="lg:col-span-5 lg:pt-16">
                        <div className="border border-border-normal p-5 md:p-8">
                            <h3 className="text-xl font-bold tracking-tight text-white mb-2">Pick any two</h3>
                            <p className="text-sm text-text-secondary mb-8">
                                Choose two handhelds and see every spec next to each other.
                            </p>
                            <QuickCompare consoles={searchableConsoles} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Finder: the eight questions are a real sequence, so they are numbered */}
            <section className="px-5 md:px-12 py-14 md:py-24 border-b border-border-subtle" aria-labelledby="finder-heading">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
                    <div className="lg:col-span-5">
                        <h2 id="finder-heading" className="font-pixel text-lg md:text-2xl leading-snug text-white mb-4">
                            Not sure where to start?
                        </h2>
                        <p className="text-text-secondary leading-relaxed max-w-[48ch] mb-8">
                            The Finder asks eight quick questions and gives you a ranked shortlist of handhelds
                            that fit. It takes about two minutes.
                        </p>
                        <Link
                            href="/finder"
                            className={`inline-flex items-center bg-cyan-600 border border-cyan-500 text-black font-mono text-sm px-6 py-3.5 hover:bg-white hover:border-white transition-colors ${focusRing}`}
                        >
                            Start the Finder
                        </Link>
                    </div>
                    <ol className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 border-t border-border-subtle">
                        {FINDER_STEPS.map((step, i) => (
                            <li
                                key={step}
                                className="flex items-baseline gap-4 py-4 border-b border-border-subtle sm:odd:pr-6 sm:even:pl-6 sm:even:border-l"
                            >
                                <span className="font-mono text-sm text-cyan-400 w-5 shrink-0">{i + 1}</span>
                                <span className="text-text-primary">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* 4. Buying guides */}
            {guides.length > 0 && (
                <section className="px-5 md:px-12 py-14 md:py-24 border-b border-border-subtle" aria-labelledby="guides-heading">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
                            <h2 id="guides-heading" className="font-pixel text-lg md:text-2xl leading-snug text-white">
                                Buying guides
                            </h2>
                            <Link
                                href="/best"
                                className={`font-mono text-sm text-violet-400 border-b border-violet-500 pb-0.5 hover:text-white hover:border-white transition-colors ${focusRing}`}
                            >
                                All guides
                            </Link>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-subtle border border-border-subtle">
                            {guides.map((g) => (
                                <li key={g.href} className="bg-bg-primary">
                                    <Link
                                        href={g.href}
                                        title={g.title}
                                        className="group flex flex-col gap-3 h-full p-5 hover:bg-white hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500"
                                    >
                                        <span className="text-2xl font-bold tracking-tight">{g.label}</span>
                                        <span className="text-sm leading-relaxed text-text-secondary group-hover:text-zinc-700 line-clamp-2">
                                            {g.description}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* 5. Newsletter */}
            <EmailCTA />
        </div>
    );
}
