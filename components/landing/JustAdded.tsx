import Link from 'next/link';
import Image from 'next/image';
import { type HomeDevice } from './home-types';

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:-outline-offset-2';

function Item({ d, hidden = false }: { d: HomeDevice; hidden?: boolean }) {
    return (
        <Link
            href={`/consoles/${d.slug}`}
            tabIndex={hidden ? -1 : undefined}
            aria-hidden={hidden || undefined}
            className={`shrink-0 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-r border-white/10 hover:bg-white/[0.04] ${focus}`}
        >
            <span className="relative w-12 h-9 sm:w-14 sm:h-10 shrink-0">
                {d.image && <Image src={d.image} alt="" fill sizes="56px" className="object-contain" />}
            </span>
            <span className="text-left">
                <span className="block font-semibold text-sm sm:text-base whitespace-nowrap">{d.label}</span>
                <span className="block font-mono text-xs text-cyan-400 whitespace-nowrap">
                    {[d.screenIn ? `${d.screenIn}"` : null, d.price ? `$${d.price}` : null].filter(Boolean).join(', ') || 'See specs'}
                </span>
            </span>
        </Link>
    );
}

/**
 * The newest consoles as a strip that drifts sideways on its own and pauses under the
 * pointer. The list is drawn twice so the loop is seamless; the copy is hidden from screen
 * readers and the keyboard. With reduced motion it is a plain sideways-scrolling row.
 */
export default function JustAdded({ devices }: { devices: HomeDevice[] }) {
    const seconds = Math.max(30, devices.length * 5);
    return (
        <div className="border-y border-white/10 flex flex-wrap sm:flex-nowrap items-stretch">
            <h2 className="w-full sm:w-auto shrink-0 flex items-center gap-2 px-5 md:px-8 py-2 sm:py-0 font-mono text-xs sm:text-sm text-text-secondary border-b sm:border-b-0 sm:border-r border-white/10 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-emerald-500 motion-safe:animate-pulse" aria-hidden />
                Just added
            </h2>
            <div className="group basis-full sm:basis-0 flex-1 min-w-0 overflow-x-auto motion-safe:overflow-hidden no-scrollbar">
                <div
                    className="flex w-max motion-safe:animate-[stripLoop_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
                    style={{ animationDuration: `${seconds}s` }}
                >
                    {devices.map((d) => <Item key={d.slug} d={d} />)}
                    <span className="hidden motion-safe:contents">
                        {devices.map((d) => <Item key={`${d.slug}-2`} d={d} hidden />)}
                    </span>
                </div>
            </div>
        </div>
    );
}
