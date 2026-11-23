/* Bit, the site's mascot, in its pixel form: traced block for block from the
 * brand guide (fig. 04, "BIT // PIXEL"), on its 24 x 27 grid.
 * It idles like a game sprite: a two-frame bob and a waving hand.
 * All motion stops for anyone who asks the system for reduced motion. */

type Px = [x: number, y: number, w?: number, h?: number];

const CYAN = '#00E5FF';
const SCREEN = '#7FEFFF';
const PINK = '#FF2FC9';
const DARK = '#111114';

function px(cells: Px[], fill: string) {
    return cells.map(([x, y, w = 1, h = 1]) => <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={fill} />);
}

export default function Bit({ size = 96, className = '', title }: { size?: number; className?: string; title?: string }) {
    return (
        <svg
            viewBox="0 0 24 27"
            width={size * (24 / 27)}
            height={size}
            shapeRendering="crispEdges"
            role={title ? 'img' : undefined}
            aria-hidden={title ? undefined : true}
            className={`group/bit overflow-visible ${className}`}
        >
            {title && <title>{title}</title>}

            {/* Legs and shoes stay planted */}
            {px([[7, 18, 1, 5], [16, 18, 1, 5]], CYAN)}
            {px([[6, 23, 3, 2], [5, 25, 5, 2], [15, 23, 3, 2], [14, 25, 5, 2]], PINK)}

            {/* Everything above the legs bobs */}
            <g className="motion-safe:animate-[bitBob_1.2s_steps(1,end)_infinite]">
                {/* Body: dark face, cyan outline with notched corners */}
                <rect x={6} y={1} width={12} height={16} fill={DARK} />
                {px([[6, 0, 12, 1], [6, 17, 12, 1], [5, 1, 1, 16], [18, 1, 1, 16]], CYAN)}
                {/* Screen frame */}
                {px([[7, 2, 10, 1], [7, 9, 10, 1], [7, 3, 1, 6], [16, 3, 1, 6]], SCREEN)}
                {/* Eyes */}
                <g className="motion-safe:animate-[bitBlink_4s_steps(1,end)_infinite]">
                    {px([[9, 4, 2, 1], [13, 4, 2, 1]], '#000')}
                </g>
                {/* Smile, d-pad, two buttons, speaker */}
                {px([[11, 6, 2, 1], [10, 7, 4, 1]], PINK)}
                {px([[10, 11, 2, 1], [9, 12, 4, 1], [10, 13, 2, 1]], PINK)}
                {px([[14, 13], [16, 13]], PINK)}
                {px([[10, 15, 6, 1]], PINK)}
                {/* Hanging arm */}
                {px([[0, 20, 1, 2], [1, 21, 1, 2], [2, 22, 1, 2]], PINK)}
                {/* Waving arm: two frames, swapped */}
                <g className="motion-safe:animate-[bitWaveA_3s_steps(1,end)_infinite] group-hover/bit:motion-safe:[animation-duration:1s]">
                    {px([[20, 10, 1, 2], [21, 9, 1, 2], [22, 8, 1, 2], [23, 7, 1, 2]], PINK)}
                </g>
                <g className="opacity-0 motion-safe:animate-[bitWaveB_3s_steps(1,end)_infinite] group-hover/bit:motion-safe:[animation-duration:1s]">
                    {px([[20, 10, 1, 2], [21, 10, 1, 2], [22, 9, 1, 2], [23, 9, 1, 2]], PINK)}
                </g>
            </g>
        </svg>
    );
}
