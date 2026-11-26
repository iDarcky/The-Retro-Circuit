import Link from 'next/link';
import { Linkedin, ArrowRight } from 'lucide-react';
import { getSystemVersion } from '../../app/actions/roadmap';
import EmailActionCard from '../../components/about/EmailActionCard';
import { fetchConsoleAndVariantCounts } from '../../app/actions/consoles';
import { fetchPublicManufacturers } from '../../app/actions/manufacturers';
import Bit from '../../components/brand/Bit';

// BETA BRANCH: redesigned in place. The copy is the owner's own words, unchanged.
export const metadata = {
    title: 'About | The Retro Circuit',
    description: "The story behind The Retro Circuit. Why it was built, what it stands for, and where it's going.",
    alternates: { canonical: '/about' },
};

const H2 = ({ n, children, color }: { n: string; children: React.ReactNode; color: string }) => (
    <div>
        <p className={`font-pixel text-[10px] ${color}`}><span className="text-text-secondary">{n}</span></p>
        <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-tight">{children}</h2>
    </div>
);

const STACK = [
    ['Framework', 'Next.js 16'],
    ['UI', 'React 19 and Tailwind CSS'],
    ['Data', 'Supabase (PostgreSQL)'],
    ['Language', 'TypeScript'],
    ['Hosting', 'Vercel'],
];

export default async function AboutPage() {
    const [version, counts, brands] = await Promise.all([
        getSystemVersion().catch(() => ''),
        fetchConsoleAndVariantCounts(),
        fetchPublicManufacturers().catch(() => []),
    ]);
    const stats = [
        { v: counts.consoles, k: 'handhelds', bg: 'bg-violet-600' },
        { v: counts.variants, k: 'configurations', bg: 'bg-cyan-600' },
        { v: brands.length, k: 'brands', bg: 'bg-rose-600' },
        { v: String(version || '').replace(/^pre-?alpha\s*/i, '') || '0.x', k: 'pre-alpha version', bg: 'bg-orange-600' },
    ];

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-14">
                <div className="max-w-[1100px] mx-auto">
                    <p className="font-pixel text-[10px] text-violet-400"><span className="text-text-secondary">01</span>&nbsp;&nbsp;ABOUT</p>
                    <h1 className="mt-4 text-4xl md:text-7xl font-extrabold tracking-[-0.045em] leading-[0.98]">Good data, good design,<br className="hidden md:block" /> and a love for the hardware.</h1>
                </div>
            </header>

            <div className="px-5 md:px-12">
                <div className="max-w-[1100px] mx-auto space-y-20 md:space-y-28">
                    {/* Numbers */}
                    <section aria-label="The catalogue in numbers" className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {stats.map((s) => (
                            <div key={s.k} className={`${s.bg} p-5 md:p-6`}>
                                <p className="font-pixel text-xl md:text-2xl">{s.v}</p>
                                <p className="mt-3 text-sm opacity-90">{s.k}</p>
                            </div>
                        ))}
                    </section>

                    {/* Why */}
                    <section className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-12">
                        <H2 n="02" color="text-violet-400">Why it exists</H2>
                        <div className="text-lg text-zinc-300 leading-relaxed space-y-6 max-w-[62ch]">
                            <p>The retro handheld market is a labyrinth of fragmented data. Variants, revisions, and silent upgrades create static in the signal.</p>
                            <p>The Circuit exists to cut through that. Not by cataloguing everything, but by cataloguing things correctly &mdash; with the kind of judgment that knows when two devices that share a name are actually the same product, and when they&apos;re not.</p>
                            <p>There are already solutions in this space and this isn&apos;t an attempt to replace them. It&apos;s a different take. A hub where good data, good design, and a genuine love for the hardware finally coexist.</p>
                            <p className="border-l-2 border-violet-500 pl-5 text-zinc-400">In a sea of subjective noise, we provide the raw signal. <span className="text-white font-semibold">No feelings. Just data.</span></p>
                        </div>
                    </section>

                    {/* State of the build */}
                    <section className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-12">
                        <H2 n="03" color="text-cyan-400">Where it stands</H2>
                        <div className="text-lg text-zinc-300 leading-relaxed space-y-6 max-w-[62ch]">
                            <p>The Circuit is live but unfinished. Pre-Alpha means the data is growing, features are evolving, and things may occasionally break. That&apos;s the deal for now.</p>
                            <p>Signals, reviews, and editorial content are planned. The priority right now is getting the data right before building on top of it.</p>
                            <p>Everything being built, fixed, and shipped is on the public roadmap. No vague promises, just a changelog and a queue.</p>
                            <Link href="/roadmap" className="inline-flex items-center gap-2 bg-white text-black font-mono text-sm px-5 py-3 hover:bg-violet-500 hover:text-white transition-colors">See the roadmap <ArrowRight size={14} /></Link>
                        </div>
                    </section>

                    {/* Who */}
                    <section className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-12">
                        <div>
                            <H2 n="04" color="text-rose-400">Who&apos;s behind it</H2>
                            <div className="mt-6 hidden md:block"><Bit size={140} /></div>
                        </div>
                        <div className="text-lg text-zinc-300 leading-relaxed space-y-6 max-w-[62ch]">
                            <p>I&apos;ve wanted to build something like this for almost five years. The idea was always there. The problem was I couldn&apos;t code, so it stayed an idea.</p>
                            <p>I&apos;m a Product Manager by trade. I know how to define a problem, design a system, and know when the output is wrong. What I didn&apos;t have was the ability to build. AI changed that equation.</p>
                            <p>The Circuit is the result of finally being able to close the gap between the thing in my head and the thing on the screen. It&apos;s built out of a love for data, a love for design, and a love for consoles that goes back further than I&apos;d like to admit.</p>
                            <p>It&apos;s not finished. It probably never fully will be. But it&apos;s real, it&apos;s live, and it&apos;s mine.</p>
                            <p className="text-white italic">Your Captain, Daniel (iDarkcy)</p>
                        </div>
                    </section>

                    {/* Thanks + stack */}
                    <section className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-12">
                        <H2 n="05" color="text-orange-400">Thanks</H2>
                        <div className="max-w-[62ch]">
                            <div className="text-lg text-zinc-300 leading-relaxed space-y-6">
                                <p>This space has people who have put real work into it. The goal was never to compete with that or copy it, but to add to it. To contribute something that didn&apos;t exist in quite this way before.</p>
                                <p>If something here helped you or sparked something in you, that&apos;s the point and we are happy.</p>
                            </div>
                            <dl className="mt-8 border-t border-white/10">
                                {STACK.map(([k, v]) => (
                                    <div key={k} className="flex justify-between gap-4 border-b border-white/10 py-3 text-sm">
                                        <dt className="font-mono text-zinc-500">{k}</dt><dd>{v}</dd>
                                    </div>
                                ))}
                            </dl>
                            <Link href="/credits" className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-violet-400 hover:text-white">All credits <ArrowRight size={14} /></Link>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-12">
                        <H2 n="06" color="text-violet-400">Say hi</H2>
                        <div className="grid sm:grid-cols-2 gap-3 max-w-[62ch]">
                            <EmailActionCard hoverBorderColor="hover:border-white" hoverIconBorderColor="group-hover:border-white" hoverTextColor="group-hover:text-violet-300" />
                            <a href="https://www.linkedin.com/in/danielnmaghis/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border border-white/10 p-4 hover:border-white transition-colors">
                                <span className="flex items-center gap-4"><span className="w-10 h-10 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white"><Linkedin size={18} /></span>
                                    <span><span className="block text-sm font-medium group-hover:text-violet-300">Connect</span><span className="block font-mono text-xs text-zinc-500">LinkedIn</span></span></span>
                                <ArrowRight size={16} className="text-zinc-600 group-hover:text-white" />
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
