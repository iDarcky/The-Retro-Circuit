import Link from 'next/link';
import { loadHomeData } from './home-data';
import HandheldPicker from './HandheldPicker';
import HeadToHead from './HeadToHead';
import JustAdded from './JustAdded';
import Bit from '../brand/Bit';

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

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary font-sans">
            {/* Hero, ending in the "Just added" strip */}
            <header>
                <div className="px-5 pt-12 md:pt-24 pb-10 md:pb-16 text-center">
                    <div className="flex justify-center mb-6"><FaceButtons /></div>
                    <h1 className="font-pixel text-[20px] leading-[1.4] sm:text-4xl lg:text-5xl md:text-[64px] md:leading-[1.25] text-white">
                        Every handheld.<br />Every spec.
                    </h1>
                    <p className="mt-5 md:mt-6 text-base sm:text-lg md:text-2xl text-text-secondary max-w-[34ch] mx-auto leading-snug">
                        {data.count > 0 ? `${data.count} retro handhelds, measured the same way` : 'Retro handhelds, measured the same way'}
                        {data.minPrice ? `, from $${data.minPrice} pocket players to PS2-class powerhouses.` : '.'}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-6 max-w-[320px] sm:max-w-none mx-auto">
                        <Link href="/consoles" className={`text-center bg-white text-black font-mono text-sm px-6 py-3 hover:bg-violet-500 hover:text-white transition-colors ${focus}`}>
                            Browse handhelds
                        </Link>
                        <Link href="/arena" className={`text-center font-mono text-sm text-violet-400 hover:text-white py-3 sm:py-0 border border-white/10 sm:border-0 ${focus}`}>
                            Compare two
                        </Link>
                    </div>
                </div>

                {data.newest.length > 0 && <JustAdded devices={data.newest} />}
            </header>

            <HandheldPicker devices={data.all} guides={data.guides} />

            <HeadToHead pairs={data.pairs} />

            {/* Finder */}
            <section className="px-5 md:px-12 pt-16 md:pt-36 pb-16 md:pb-36" aria-labelledby="finder-heading">
                <div className="max-w-[1200px] mx-auto bg-violet-600 text-white px-6 py-10 md:p-20 grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center overflow-hidden">
                    <div>
                        <h2 id="finder-heading" className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05]">Still deciding?</h2>
                        <p className="mt-4 text-base sm:text-lg md:text-xl text-violet-100 max-w-[32ch]">Answer eight quick questions and get a ranked shortlist made for you.</p>
                        <Link href="/finder" className={`mt-8 inline-block bg-white text-black font-mono text-sm px-6 py-3 hover:bg-black hover:text-white transition-colors ${focus} focus-visible:outline-white`}>
                            Start the Finder
                        </Link>
                    </div>
                    {/* Bit, the mascot, offering to help */}
                    <div aria-hidden className="flex items-end gap-3 md:flex-col md:items-center md:gap-5 md:pr-8">
                        <span className="relative order-2 md:order-1 bg-white text-black font-pixel text-[9px] md:text-[11px] leading-relaxed px-3 py-2 md:px-4 md:py-3 mb-10 md:mb-0">
                            Psst. I can help.
                            {/* stepped pixel tail, pointing at Bit */}
                            <span className="absolute w-2 h-2 bg-white -left-2 bottom-3 md:left-1/2 md:-bottom-2" />
                            <span className="absolute w-2 h-2 bg-white -left-4 bottom-1 md:left-[calc(50%-8px)] md:-bottom-4" />
                        </span>
                        <span className="order-1 md:order-2 md:hidden"><Bit size={130} /></span>
                        <span className="order-1 md:order-2 hidden md:block"><Bit size={260} /></span>
                    </div>
                </div>
            </section>

        </div>
    );
}
