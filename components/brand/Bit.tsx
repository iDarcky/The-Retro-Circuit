/* Bit, the site's mascot, in its pixel form (brand guide, fig. 04).
 * Drawn as an SVG on a 20 x 24 grid so it stays crisp at any size.
 * It idles like a game sprite: a two-frame bob, a blink and a wave.
 * All motion stops for anyone who asks the system for reduced motion. */

type Px = [x: number, y: number, w?: number, h?: number];

const BODY = 'fill-cyan-400';
const TRIM = 'fill-rose-500';

function px(cells: Px[], className: string) {
    return cells.map(([x, y, w = 1, h = 1]) => <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} className={className} />);
}

export default function Bit({ size = 96, className = '', title }: { size?: number; className?: string; title?: string }) {
    return (
        <svg
            viewBox="0 0 20 24"
            width={size * (20 / 24)}
            height={size}
            shapeRendering="crispEdges"
            role={title ? 'img' : undefined}
            aria-hidden={title ? undefined : true}
            className={`group/bit overflow-visible ${className}`}
        >
            {title && <title>{title}</title>}

            {/* Legs and shoes stay planted */}
            {px([[7, 17, 1, 4], [12, 17, 1, 4]], BODY)}
            {px([[6, 20, 2, 1], [5, 21, 3, 2], [12, 20, 2, 1], [12, 21, 3, 2]], TRIM)}

            {/* Everything above the legs bobs */}
            <g className="motion-safe:animate-[bitBob_1.2s_steps(1,end)_infinite]">
                {/* Body outline */}
                {px([[5, 2, 10, 1], [5, 16, 10, 1], [5, 3, 1, 13], [14, 3, 1, 13]], BODY)}
                {/* Screen, lit */}
                <rect x={7} y={4} width={6} height={6} className="fill-cyan-200" />
                {/* Eyes, which blink */}
                <g className="motion-safe:animate-[bitBlink_4s_steps(1,end)_infinite]">
                    {px([[8, 6], [11, 6]], 'fill-black')}
                </g>
                {px([[9, 8, 2, 1]], TRIM)}
                {/* D-pad, two buttons, speaker */}
                {px([[7, 11], [6, 12, 3, 1], [7, 13]], TRIM)}
                {px([[11, 12], [12, 11]], TRIM)}
                {px([[8, 14, 4, 1]], TRIM)}
                {/* Arm at rest */}
                {px([[4, 11], [3, 12], [3, 13]], TRIM)}
                {/* Waving arm: two frames, swapped */}
                <g className="motion-safe:animate-[bitWaveA_3s_steps(1,end)_infinite] group-hover/bit:motion-safe:[animation-duration:1s]">
                    {px([[15, 10], [16, 9], [17, 8], [17, 7], [18, 6]], TRIM)}
                </g>
                <g className="opacity-0 motion-safe:animate-[bitWaveB_3s_steps(1,end)_infinite] group-hover/bit:motion-safe:[animation-duration:1s]">
                    {px([[15, 10], [16, 10], [17, 9], [18, 9], [19, 8]], TRIM)}
                </g>
            </g>
        </svg>
    );
}
