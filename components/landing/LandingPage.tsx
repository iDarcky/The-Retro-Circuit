import Link from 'next/link';
import { loadHomeData } from './home-data';
import HandheldPicker from './HandheldPicker';
import HeadToHead from './HeadToHead';
import JustAdded from './JustAdded';
import Bit from '../brand/Bit';
import HeroBackground from './HeroBackground';

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';

/** The four signal colours set out like a controller's face buttons: the page's small mark. */
function FaceButtons() {
    const dot = 'w-[9px] h-[9px] rounded-full';
    return (
        <span aria-hidden className="inline-grid grid-cols-3 gap-[2px] motion-safe:animate-[faceTurn_6s_cubic-bezier(.5,1.8,.5,1)_infinite]">
            <span /><span className={`${dot} bg-violet-500`} /><span />
            <span className={`${dot} bg-cyan-500`} /><span /><span className={`${dot} bg-rose-500`} />
            <span /><span className={`${dot} bg-orange-500`} /><span />
        </span>
    );
}

export default async function LandingPage() {
    const data = await loadHomeData();
    // Twelve handhelds spread across the catalogue, so the backdrop shows a mix of shapes.
    const withImg = data.all.filter((d) => d.image);
    const step = Math.max(1, Math.floor(withImg.length / 12));
    const sprites = withImg.filter((_, i) => i % step === 0).slice(0, 12).map((d) => ({ slug: d.slug, image: d.image! }));

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary font-sans">
            {/* Hero: fills the first screen and ends in the "Just added" strip */}
            <header className="relative flex flex-col min-h-[calc(100svh-3.5rem)] md:min-h-[calc(100svh-4.125rem)] overflow-hidden">
                <HeroBackground sprites={sprites} />

                <div className="relative flex-1 flex items-center px-5 md:px-12 py-12 md:py-16">
                    <div className="w-full max-w-[1200px] mx-auto grid md:grid-cols-[1fr_auto] items-center gap-10 md:gap-16">
                        <div>
                            <div className="mb-6"><FaceButtons /></div>
                            <h1 className="font-pixel text-[26px] leading-[1.4] sm:text-4xl md:text-[52px] lg:text-[64px] md:leading-[1.2] text-white">
                                Every handheld.<br />Every spec.
                            </h1>
                            <p className="mt-6 text-lg md:text-2xl text-text-secondary max-w-[36ch] leading-snug">
                                {data.count > 0 ? `${data.count} retro handhelds, measured the same way` : 'Retro handhelds, measured the same way'}
                                {data.minPrice ? `, from $${data.minPrice} pocket players to PS2-class powerhouses.` : '.'}
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 max-w-[320px] sm:max-w-none">
                                {/* Purple, with the corner brackets that grow into a frame on hover (as on the live site) */}
                                <span className="relative group inline-flex">
                                    <span aria-hidden className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-violet-500 transition-[width,height,border-color] duration-500 group-hover:w-[calc(100%+12px)] group-hover:h-[calc(100%+12px)] group-hover:border-violet-300" />
                                    <span aria-hidden className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-violet-500 transition-[width,height,border-color] duration-500 group-hover:w-[calc(100%+12px)] group-hover:h-[calc(100%+12px)] group-hover:border-violet-300" />
                                    <Link href="/consoles" className={`hero-cta relative w-full text-center bg-violet-600 text-white font-mono text-sm px-7 py-3.5 hover:brightness-110 transition-[filter] ${focus}`}>
                                        Browse handhelds
                                    </Link>
                                </span>
                                <Link href="/arena" className={`text-center font-mono text-sm text-violet-300 hover:text-white py-3 sm:py-0 border border-white/10 sm:border-0 ${focus}`}>
                                    Compare two
                                </Link>
                            </div>
                        </div>

                        {/* Bit offers the Finder */}
                        <Link href="/finder" className={`group flex items-end md:flex-col md:items-center gap-3 md:gap-5 ${focus}`}>
                            <span className="relative order-2 md:order-1 bg-white text-black font-pixel text-[9px] md:text-[11px] leading-relaxed px-3 py-2 md:px-4 md:py-3 mb-8 md:mb-0 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                                Psst. I can help.
                                {/* stepped pixel tail, pointing at Bit */}
                                <span className="absolute w-2 h-2 bg-inherit -left-2 bottom-3 md:left-1/2 md:-bottom-2" />
                                <span className="absolute w-2 h-2 bg-inherit -left-4 bottom-1 md:left-[calc(50%-8px)] md:-bottom-4" />
                            </span>
                            <span className="order-1 md:order-2 md:hidden"><Bit size={110} /></span>
                            <span className="order-1 md:order-2 hidden md:block"><Bit size={280} /></span>
                        </Link>
                    </div>
                </div>

                {data.newest.length > 0 && <div className="relative bg-bg-primary"><JustAdded devices={data.newest} /></div>}
            </header>

            <HandheldPicker devices={data.all} />

            <HeadToHead pairs={data.pairs} />

            <div className="h-20 md:h-32" />
        </div>
    );
}
