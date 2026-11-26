import Link from 'next/link';
import Bit from '../../components/brand/Bit';

// BETA BRANCH: redesigned in place.
export const metadata = {
    title: 'Credits | The Retro Circuit',
    description: 'Acknowledgments and credits for the open-source tools, data, and contributors powering The Retro Circuit.',
    robots: { index: false, follow: true },
    alternates: { canonical: '/credits' },
};

const TOOLS = [
    { name: 'Next.js', what: 'The framework the site runs on', href: 'https://nextjs.org' },
    { name: 'React', what: 'The interface library', href: 'https://react.dev' },
    { name: 'Supabase', what: 'The database behind the catalogue', href: 'https://supabase.com' },
    { name: 'Tailwind CSS', what: 'Styling', href: 'https://tailwindcss.com' },
    { name: 'Vercel', what: 'Hosting', href: 'https://vercel.com' },
    { name: 'Lucide', what: 'Icons', href: 'https://lucide.dev' },
    { name: 'Press Start 2P', what: 'The pixel font, by CodeMan38', href: 'https://fonts.google.com/specimen/Press+Start+2P' },
    { name: 'Inter and JetBrains Mono', what: 'Body and data fonts', href: 'https://fonts.google.com' },
];
const COLORS = ['bg-violet-500', 'bg-cyan-500', 'bg-rose-500', 'bg-orange-500'];

export default function CreditsPage() {
    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-14">
                <div className="max-w-[900px] mx-auto">
                    <p className="font-pixel text-[10px] text-violet-400"><span className="text-text-secondary">01</span>&nbsp;&nbsp;CREDITS</p>
                    <h1 className="mt-4 text-4xl md:text-7xl font-extrabold tracking-[-0.045em] leading-[0.98]">Thank you.</h1>
                    <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-[56ch]">This project is a tribute to the history of handheld gaming. It exists to preserve technical specifications and provide a clean, data-driven interface for enthusiasts.</p>
                </div>
            </header>

            <div className="px-5 md:px-12">
                <div className="max-w-[900px] mx-auto space-y-20">
                    <section aria-labelledby="tools">
                        <h2 id="tools" className="text-2xl md:text-4xl font-extrabold tracking-[-0.03em]">Built with</h2>
                        <ul className="mt-8 grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
                            {TOOLS.map((t, i) => (
                                <li key={t.name} className="bg-bg-primary">
                                    <a href={t.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 p-5 h-full hover:bg-white/[0.04] transition-colors">
                                        <span className={`mt-2 w-2 h-2 shrink-0 ${COLORS[i % 4]}`} aria-hidden />
                                        <span>
                                            <span className="block font-bold group-hover:text-violet-300 transition-colors">{t.name} <span className="font-mono text-xs text-zinc-500">↗</span></span>
                                            <span className="block text-sm text-text-secondary">{t.what}</span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="flex flex-col sm:flex-row items-center gap-6 border border-white/10 p-8 md:p-10">
                        <Bit size={110} />
                        <div>
                            <p className="font-pixel text-[11px] leading-relaxed">More names coming soon.</p>
                            <p className="mt-2 text-text-secondary">Helped with data or spotted your work here? <a href="mailto:contact@theretrocircuit.com" className="text-violet-400 hover:text-white">Tell us</a> and we&apos;ll credit you properly. Or read the <Link href="/about" className="text-violet-400 hover:text-white">story behind the site</Link>.</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
