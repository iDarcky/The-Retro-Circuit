import Image from 'next/image';

/* The hero's backdrop: an LCD-style dot grid with handhelds floating faintly around the
 * edges, each bobbing on its own beat. Spots stay clear of the headline and of Bit. */

export type HeroSprite = { slug: string; image: string };

const SPOTS = [
    'left-[2%] top-[6%] w-24 md:w-32',
    'left-[24%] top-[3%] w-16 md:w-20 hidden md:block',
    'left-[44%] top-[8%] w-20 md:w-24 hidden lg:block',
    'right-[24%] top-[4%] w-16 md:w-20 hidden md:block',
    'right-[3%] top-[9%] w-20 md:w-28',
    'right-[1%] top-[44%] w-16 md:w-24 hidden lg:block',
    'left-[1%] top-[42%] w-16 md:w-20 hidden md:block',
    'left-[5%] bottom-[14%] w-20 md:w-28 hidden sm:block',
    'left-[28%] bottom-[6%] w-16 md:w-20 hidden md:block',
    'left-[50%] bottom-[11%] w-16 md:w-24 hidden md:block',
    'right-[22%] bottom-[5%] w-16 md:w-20 hidden lg:block',
    'right-[3%] bottom-[14%] w-24 md:w-32 hidden sm:block',
];

export default function HeroBackground({ sprites }: { sprites: HeroSprite[] }) {
    return (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1.3px)', backgroundSize: '22px 22px' }} />
            {sprites.slice(0, SPOTS.length).map((d, i) => (
                <span
                    key={d.slug}
                    className={`absolute aspect-[4/3] opacity-[0.2] motion-safe:animate-[spriteBob_1.8s_steps(2,jump-none)_infinite] ${SPOTS[i]}`}
                    style={{ animationDelay: `${(i * 370) % 1800}ms` }}
                >
                    <Image src={d.image} alt="" fill sizes="128px" className="object-contain" />
                </span>
            ))}
        </div>
    );
}
