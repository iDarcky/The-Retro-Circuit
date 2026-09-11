import { Metadata } from 'next';
import { FinderFlow } from '@/components/finder/FinderFlow';

export const metadata: Metadata = {
    title: { absolute: 'Find the Best Retro Handheld for You | The Retro Circuit Quiz' },
    description: "Not sure which retro handheld to buy? Answer a few quick questions about your budget and emulation needs, and we'll match you with the perfect device.",
    /* Every step of the quiz is the same page with different search params — ?step=q4,
     * ?profile=…&budget_band=… and so on. Without this each of those is a separate URL
     * competing with the others. */
    alternates: { canonical: '/finder' },
};

/* Question one is still the landing.
 *
 * The alternative — an introduction page that explains the quiz and then asks you to
 * start it — buys nothing and costs a click at the top of an eight-step funnel, which is
 * where drop-off is worst. What an introduction page would actually have told you now
 * sits above the first question instead: what it asks, how long it runs, and what you get
 * at the end. Reading it costs nothing; skipping it costs nothing either.
 */
const FACTS = [
    { label: 'Length', value: '8 questions' },
    { label: 'Time', value: 'About a minute' },
    { label: 'You get', value: 'One pick, plus runners-up' },
    { label: 'Email', value: 'Not required' },
];

export default function FinderPage() {
    return (
        <main className="min-h-screen bg-bg-primary pb-12 pt-24 text-text-primary">
            <div className="container mx-auto max-w-4xl px-4">

                <header className="mb-10 border-b border-border-subtle pb-8">
                    <h1 className="flex items-center gap-3 font-pixel text-3xl text-white md:text-4xl">
                        Finder<span className="text-violet-500">_</span>
                        <span className="border border-orange-500/30 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-widest text-orange-400">
                            Beta
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
                        Tell us what you played, what you want to spend and how you want to hold
                        it. We match that against every published device in the catalogue and come
                        back with one recommendation and the reasoning behind it.
                    </p>

                    <dl className="mt-7 grid grid-cols-2 gap-px border border-border-subtle bg-border-subtle sm:grid-cols-4">
                        {FACTS.map((fact) => (
                            <div key={fact.label} className="bg-bg-primary px-4 py-3">
                                <dt className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                                    {fact.label}
                                </dt>
                                <dd className="mt-1 font-mono text-sm text-white">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <p className="mt-5 font-mono text-xs text-text-muted">
                        Still early. If a match feels wrong, tell us — that is what the beta is for.
                    </p>
                </header>

                <FinderFlow />
            </div>
        </main>
    );
}
