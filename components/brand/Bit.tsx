/* Bit, the site's mascot (the neon artwork from the brand guide).
 * Shown on its own dark tile, like a little screen, so the glow reads on any background.
 * It floats, rocks side to side as if waving, and the neon flickers now and then.
 * All motion stops for anyone who asks the system for reduced motion. */

export default function Bit({ size = 160, className = '', title }: { size?: number; className?: string; title?: string }) {
    return (
        <span
            className={`group/bit relative inline-block shrink-0 bg-[#030a14] overflow-hidden ${className}`}
            style={{ width: size, height: size * (522 / 576) }}
            role={title ? 'img' : undefined}
            aria-label={title}
            aria-hidden={title ? undefined : true}
        >
            <span className="absolute inset-0 motion-safe:animate-[bitFloat_3.2s_ease-in-out_infinite]">
                <span className="absolute inset-0 origin-bottom motion-safe:animate-[bitRock_2.4s_ease-in-out_infinite] group-hover/bit:motion-safe:[animation-duration:0.5s]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/bit-neon.webp"
                        alt=""
                        width={576}
                        height={522}
                        className="block w-full h-full object-contain p-[5%] motion-safe:animate-[neonFlicker_7s_linear_infinite]"
                    />
                </span>
            </span>
        </span>
    );
}
