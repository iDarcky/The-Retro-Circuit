import { Metadata } from 'next';
import { fetchRoadmapItems, getSystemVersion, fetchReleases } from '../../app/actions/roadmap';
import type { RoadmapFeature } from '../../lib/types';

// BETA BRANCH: redesigned in place. The admin view still uses components/roadmap/RoadmapView.
export const metadata: Metadata = {
    title: 'Project Roadmap | The Retro Circuit',
    description: 'Track our progress as we build the ultimate handheld gaming database. See what features are coming next.',
    alternates: { canonical: '/roadmap' },
};

const PRIORITY: Record<string, { label: string; cls: string }> = {
    critical: { label: 'Critical', cls: 'bg-rose-500 text-black' },
    'must-have': { label: 'Must-have', cls: 'bg-orange-500 text-black' },
    'nice-to-have': { label: 'Nice to have', cls: 'border border-white/20 text-zinc-400' },
};
const ORDER: Record<string, number> = { critical: 0, 'must-have': 1, 'nice-to-have': 2 };
const fmt = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

function Item({ f }: { f: RoadmapFeature }) {
    const p = PRIORITY[f.priority];
    return (
        <li className="border-b border-white/10 py-5">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                {p && <span className={`px-1.5 py-0.5 ${p.cls}`}>{p.label}</span>}
                {f.category && <span className="text-zinc-500">{f.category}</span>}
                {f.target_date && <span className="ml-auto text-zinc-500">{fmt(f.target_date)}</span>}
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug">{f.title}</h3>
            {f.description && <p className="mt-1 text-sm text-text-secondary leading-relaxed">{f.description}</p>}
        </li>
    );
}

export default async function RoadmapPage() {
    const [items, releases, version] = await Promise.all([fetchRoadmapItems(), fetchReleases(), getSystemVersion()]);
    const sort = (a: RoadmapFeature, b: RoadmapFeature) => (ORDER[a.priority] ?? 3) - (ORDER[b.priority] ?? 3);
    const now = items.filter((i) => i.status === 'in-progress').sort(sort);
    const next = items.filter((i) => i.status === 'planned').sort(sort);

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-14">
                <div className="max-w-[1200px] mx-auto">
                    <p className="font-pixel text-[10px] text-violet-400"><span className="text-text-secondary">01</span>&nbsp;&nbsp;ROADMAP</p>
                    <h1 className="mt-4 text-4xl md:text-7xl font-extrabold tracking-[-0.045em] leading-[0.98]">What we&apos;re building.</h1>
                    <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-[56ch]">Everything being built, fixed and shipped, in the open. We&apos;re on <span className="font-pixel text-white text-base">v{version}</span> and heading for 1.0.</p>
                </div>
            </header>

            <div className="px-5 md:px-12">
                <div className="max-w-[1200px] mx-auto space-y-20 md:space-y-28">
                    <section className="grid md:grid-cols-2 gap-10 md:gap-12">
                        <div>
                            <div className="bg-violet-600 px-5 py-4 flex items-center justify-between">
                                <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Building now</h2>
                                <span className="font-pixel text-sm">{now.length}</span>
                            </div>
                            {now.length ? <ul>{now.map((f) => <Item key={f.id} f={f} />)}</ul> : <p className="py-6 text-text-secondary">Nothing in progress right now.</p>}
                        </div>
                        <div>
                            <div className="bg-cyan-600 px-5 py-4 flex items-center justify-between">
                                <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Up next</h2>
                                <span className="font-pixel text-sm">{next.length}</span>
                            </div>
                            {next.length ? <ul>{next.map((f) => <Item key={f.id} f={f} />)}</ul> : <p className="py-6 text-text-secondary">Nothing planned yet.</p>}
                        </div>
                    </section>

                    <section aria-labelledby="shipped">
                        <h2 id="shipped" className="text-3xl md:text-4xl font-extrabold tracking-[-0.03em]">Shipped</h2>
                        <ol className="mt-8 border-l border-white/10">
                            {releases.map((r: any, i: number) => (
                                <li key={r.id} className="relative pl-8 pb-12 last:pb-0">
                                    <span className={`absolute -left-[6px] top-1 w-[11px] h-[11px] ${['bg-violet-500', 'bg-cyan-500', 'bg-rose-500', 'bg-orange-500'][i % 4]}`} aria-hidden />
                                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                        <span className="font-pixel text-lg">v{r.version}</span>
                                        <span className="font-mono text-xs text-text-secondary">{fmt(r.release_date)}</span>
                                    </div>
                                    {r.title && <h3 className="mt-2 text-xl font-bold">{r.title}</h3>}
                                    {r.description && <p className="mt-2 text-text-secondary leading-relaxed max-w-[65ch]">{r.description}</p>}
                                    {r.roadmap_features?.length > 0 && (
                                        <ul className="mt-4 space-y-1.5">
                                            {r.roadmap_features.map((f: RoadmapFeature) => (
                                                <li key={f.id} className="flex gap-3 text-sm text-zinc-300"><span className="text-cyan-400 font-mono">+</span>{f.title}</li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="border border-white/10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em]">Have an idea?</h2>
                            <p className="mt-2 text-text-secondary">Send it over and help shape what comes next.</p>
                        </div>
                        <a href="mailto:contact@theretrocircuit.com" className="bg-white text-black font-mono text-sm px-6 py-3 hover:bg-violet-500 hover:text-white transition-colors self-start md:self-auto">contact@theretrocircuit.com</a>
                    </section>
                </div>
            </div>
        </main>
    );
}
