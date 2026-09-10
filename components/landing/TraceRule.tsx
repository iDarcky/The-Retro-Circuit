/* The divider between sections, drawn as a bus line rather than a plain border.
 *
 * A 1px rule on a black page is almost nothing, and the sections it divides are the same
 * colour. So the rule borrows the vocabulary the hero's background already uses: a run of
 * solder pads sitting on the line, at irregular intervals, as though the traces above
 * terminate into it. Squares rather than circles — this is chrome, not the drawing.
 *
 * Positions are deliberately uneven. Evenly spaced dots read as a decorative border;
 * uneven ones read as a board layout.
 */
const PADS: { left: number; size: number; accent?: boolean }[] = [
    { left: 6, size: 5, accent: true },
    { left: 17, size: 3 },
    { left: 31, size: 5 },
    { left: 39, size: 3 },
    { left: 55, size: 5, accent: true },
    { left: 68, size: 3 },
    { left: 79, size: 5 },
    { left: 92, size: 3, accent: true },
];

export default function TraceRule() {
    return (
        <div aria-hidden className="relative h-px w-full bg-border-normal">
            {PADS.map((pad) => (
                <span
                    key={pad.left}
                    className={`absolute top-1/2 -translate-y-1/2 ${pad.accent ? 'bg-violet-500' : 'bg-border-normal'}`}
                    style={{ left: `${pad.left}%`, width: pad.size, height: pad.size }}
                />
            ))}
        </div>
    );
}
