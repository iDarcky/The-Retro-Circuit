'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConsoleSearch } from '../arena/ConsoleSearch';
import { buildArenaPath } from '../../lib/arena/resolve';
import CircuitPattern from './CircuitPattern';

interface Matchup {
    path: string;
    left: string;
    right: string;
}

interface ArenaBarProps {
    consoles: { name: string; slug: string }[];
    matchups: Matchup[];
    deviceCount: number;
}

/* Arena, on the homepage, as the tool rather than a link to the tool.
 *
 * Note the URL: buildArenaPath takes console slugs straight. Console slugs already
 * carry the brand (`anbernic-rg-sp`), so prefixing the manufacturer slug again — as
 * the old QuickCompare did — produced `anbernic-anbernic-rg-sp`, which resolves to
 * nothing.
 */
export default function ArenaBar({ consoles, matchups, deviceCount }: ArenaBarProps) {
    const router = useRouter();
    const [left, setLeft] = useState<{ slug: string; name: string } | null>(null);
    const [right, setRight] = useState<{ slug: string; name: string } | null>(null);

    const ready = !!left && !!right;

    const compare = () => {
        if (!left || !right) return;
        router.push(buildArenaPath(left.slug, right.slug));
    };

    return (
        <section className="relative overflow-hidden border-b border-border-subtle bg-bg-secondary/30 px-6 py-12 md:px-12 md:py-16">
            {/* Cyan here rather than violet: this band is the data tool, and cyan is what
              * the system reserves for specs. */}
            <CircuitPattern accentColor="cyan" className="absolute inset-0 h-full w-full" />
            <div className="relative z-10 mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="min-w-0 lg:col-span-4">
                    <h2 className="text-balance font-mono text-2xl font-bold tracking-tight text-white md:text-3xl">
                        Head to head
                    </h2>
                    <p className="mt-3 max-w-md text-text-secondary">
                        Every spec in one table, down to the SoC generation and the emulation
                        grade per system.
                    </p>
                </div>

                <div className="min-w-0 lg:col-span-8">
                    <div className="border border-border-subtle bg-bg-primary p-5 md:p-6">
                        {/* Player 1 / Player 2 in blue and red is the one place the interface
                          * speaks the subject's own language rather than the catalogue's, and
                          * it reads instantly. Kept from the old QuickCompare; the shadow, the
                          * rounded VS token and the corner brackets that grew on hover are not,
                          * since DESIGN.md prohibits all three. */}
                        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                            <div className="flex min-w-0 flex-col gap-2">
                                <label htmlFor="arena-player-1" className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-400">
                                    Player 1
                                </label>
                                <ConsoleSearch
                                    consoles={consoles}
                                    onSelect={(slug, name) => setLeft({ slug, name })}
                                    id="arena-player-1"
                                    placeholder={`Search ${deviceCount} devices…`}
                                    themeColor="blue"
                                    currentSelection={left?.name}
                                    textColor="white"
                                    highlightSelection
                                />
                            </div>

                            <span
                                aria-hidden
                                className="hidden h-9 w-9 items-center justify-center border border-border-normal font-mono text-[11px] uppercase tracking-widest text-text-muted md:flex"
                            >
                                vs
                            </span>

                            <div className="flex min-w-0 flex-col gap-2">
                                <label htmlFor="arena-player-2" className="font-mono text-[11px] font-bold uppercase tracking-widest text-red-400">
                                    Player 2
                                </label>
                                <ConsoleSearch
                                    consoles={consoles}
                                    onSelect={(slug, name) => setRight({ slug, name })}
                                    id="arena-player-2"
                                    placeholder={`Search ${deviceCount} devices…`}
                                    themeColor="red"
                                    currentSelection={right?.name}
                                    textColor="white"
                                    highlightSelection
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={compare}
                            disabled={!ready}
                            aria-describedby={ready ? undefined : 'arena-compare-hint'}
                            className="mt-5 w-full touch-manipulation border border-white bg-white px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:border-border-normal disabled:bg-transparent disabled:text-text-muted"
                        >
                            {ready ? 'Compare these two' : 'Pick two devices'}
                        </button>
                        {!ready && (
                            <p id="arena-compare-hint" className="sr-only">
                                Choose a device for Player 1 and Player 2 to enable the comparison.
                            </p>
                        )}
                    </div>

                    {/* The escape hatch for anyone who does not have two names in mind */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                            Most compared
                        </span>
                        {matchups.map((matchup) => (
                            <Link
                                key={matchup.path}
                                href={matchup.path}
                                className="border border-border-subtle px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-cyan-500 hover:text-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                            >
                                {matchup.left} <span className="text-text-muted">vs</span> {matchup.right}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
