import Link from 'next/link';

/* The finder's first question, asked on the homepage.
 *
 * /finder is driven entirely by search params (FinderFlow reads `step` and writes
 * `profile`, `budget_band`, …), so answering question one here is a plain link into
 * question two. That removes a whole click from the top of the funnel: the visitor
 * does not land on the quiz, they land one answer into it.
 *
 * Option ids must match QUESTIONS[0] in components/finder/FinderFlow.tsx.
 */
const PROFILES = [
    { id: 'nostalgia', label: 'Nostalgia hunter', note: 'Childhood classics' },
    { id: 'completionist', label: 'Completionist', note: 'One device, every era' },
    { id: 'performance', label: 'Performance chaser', note: 'The most powerful option' },
    { id: 'onthego', label: 'On the go', note: 'Commute and travel' },
    { id: 'gift', label: 'Buying a gift', note: 'For someone else' },
];

function href(id: string) {
    const params = new URLSearchParams({ step: 'q2', profile: id });
    // FinderFlow sets this itself on the gift branch; setting it here keeps the
    // deep-linked run identical to one started on /finder.
    if (id === 'gift') params.set('tone_mode', 'gift');
    return `/finder?${params.toString()}`;
}

export default function FinderStart() {
    return (
        <section className="border-b border-border-subtle px-6 py-12 md:px-12 md:py-16">
            <div className="mx-auto max-w-[1600px]">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <h2 className="font-mono text-2xl font-bold tracking-tight text-white md:text-3xl">
                        What best describes you?
                    </h2>
                    <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                        Question 1 of 8
                    </p>
                </div>

                <ul className="mt-6 grid grid-cols-1 gap-px bg-border-subtle sm:grid-cols-2 lg:grid-cols-5">
                    {PROFILES.map((profile) => (
                        <li key={profile.id}>
                            <Link
                                href={href(profile.id)}
                                className="group flex h-full flex-col justify-between gap-6 bg-bg-primary p-5 transition-colors hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500"
                            >
                                <span className="text-lg font-medium leading-snug text-white">
                                    {profile.label}
                                </span>
                                <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted transition-colors group-hover:text-white/80">
                                    {profile.note}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
