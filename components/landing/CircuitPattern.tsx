/**
 * CircuitPattern — Decorative SVG circuit board traces.
 * Routes and junction dots only. No processor shapes.
 */

const colorMap = {
    cyan: { stroke: 'rgba(6, 182, 212, 0.15)', dot: 'rgba(6, 182, 212, 0.25)' },
    emerald: { stroke: 'rgba(16, 185, 129, 0.15)', dot: 'rgba(16, 185, 129, 0.25)' },
    violet: { stroke: 'rgba(139, 92, 246, 0.15)', dot: 'rgba(139, 92, 246, 0.25)' },
    rose: { stroke: 'rgba(244, 63, 94, 0.15)', dot: 'rgba(244, 63, 94, 0.25)' },
};

interface CircuitPatternProps {
    accentColor: 'cyan' | 'emerald' | 'violet' | 'rose';
    className?: string;
}

export default function CircuitPattern({ accentColor, className = '' }: CircuitPatternProps) {
    const c = colorMap[accentColor];

    return (
        <svg
            className={`pointer-events-none select-none ${className}`}
            viewBox="0 0 1200 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            {/* === HORIZONTAL BUS LINES === */}
            <line x1="0" y1="40" x2="1200" y2="40" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="0" y1="80" x2="1200" y2="80" stroke={c.stroke} strokeWidth="0.5" />
            <line x1="0" y1="130" x2="1200" y2="130" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="0" y1="160" x2="1200" y2="160" stroke={c.stroke} strokeWidth="1" />
            <line x1="0" y1="220" x2="1200" y2="220" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="0" y1="280" x2="1200" y2="280" stroke={c.stroke} strokeWidth="0.5" />
            <line x1="0" y1="330" x2="1200" y2="330" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="0" y1="380" x2="1200" y2="380" stroke={c.stroke} strokeWidth="1" />
            <line x1="0" y1="430" x2="1200" y2="430" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="0" y1="480" x2="1200" y2="480" stroke={c.stroke} strokeWidth="0.5" />
            <line x1="0" y1="540" x2="1200" y2="540" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="0" y1="570" x2="1200" y2="570" stroke={c.stroke} strokeWidth="0.3" />

            {/* === VERTICAL TRACES === */}
            <line x1="100" y1="0" x2="100" y2="600" stroke={c.stroke} strokeWidth="0.5" />
            <line x1="200" y1="0" x2="200" y2="600" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="320" y1="0" x2="320" y2="600" stroke={c.stroke} strokeWidth="0.5" />
            <line x1="450" y1="0" x2="450" y2="600" stroke={c.stroke} strokeWidth="1" />
            <line x1="580" y1="0" x2="580" y2="600" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="700" y1="0" x2="700" y2="600" stroke={c.stroke} strokeWidth="0.5" />
            <line x1="850" y1="0" x2="850" y2="600" stroke={c.stroke} strokeWidth="0.3" />
            <line x1="950" y1="0" x2="950" y2="600" stroke={c.stroke} strokeWidth="0.5" />
            <line x1="1100" y1="0" x2="1100" y2="600" stroke={c.stroke} strokeWidth="0.3" />

            {/* === ANGLED ROUTES === */}
            {/* Top-left region */}
            <polyline points="100,80 150,130 150,160" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="200,80 250,130 320,130 320,160" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="100,160 160,220 200,220" stroke={c.stroke} strokeWidth="0.5" fill="none" />

            {/* Mid-left */}
            <polyline points="200,280 260,340 320,340 320,380" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="100,380 160,320 200,320" stroke={c.stroke} strokeWidth="0.5" fill="none" />

            {/* Center routes */}
            <polyline points="450,80 500,130 580,130 580,160" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="450,160 510,220 580,220 580,280" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="450,280 400,330 320,330" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="450,380 510,440 580,440 580,480" stroke={c.stroke} strokeWidth="0.5" fill="none" />

            {/* Right region */}
            <polyline points="700,80 750,130 850,130 850,160" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="700,160 760,220 850,220" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="950,160 900,210 850,210" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="700,380 760,440 850,440" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="950,280 1000,330 1100,330 1100,380" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="950,380 890,320 850,320" stroke={c.stroke} strokeWidth="0.5" fill="none" />

            {/* Bottom routes */}
            <polyline points="100,480 160,540" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="320,480 380,540 450,540" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="700,480 760,540 850,540" stroke={c.stroke} strokeWidth="0.5" fill="none" />
            <polyline points="1100,480 1050,430 950,430 950,380" stroke={c.stroke} strokeWidth="0.5" fill="none" />

            {/* === JUNCTION DOTS === */}
            {/* Row 1 - y:80 */}
            <circle cx="100" cy="80" r="2.5" fill={c.dot} />
            <circle cx="200" cy="80" r="2" fill={c.dot} />
            <circle cx="450" cy="80" r="2.5" fill={c.dot} />
            <circle cx="700" cy="80" r="2.5" fill={c.dot} />
            <circle cx="950" cy="80" r="2" fill={c.dot} />

            {/* Row 2 - y:160 */}
            <circle cx="100" cy="160" r="2.5" fill={c.dot} />
            <circle cx="320" cy="160" r="2.5" fill={c.dot} />
            <circle cx="450" cy="160" r="2.5" fill={c.dot} />
            <circle cx="580" cy="160" r="2" fill={c.dot} />
            <circle cx="700" cy="160" r="2.5" fill={c.dot} />
            <circle cx="850" cy="160" r="2" fill={c.dot} />
            <circle cx="950" cy="160" r="2" fill={c.dot} />

            {/* Row 3 - y:280 */}
            <circle cx="200" cy="280" r="2" fill={c.dot} />
            <circle cx="450" cy="280" r="2.5" fill={c.dot} />
            <circle cx="580" cy="280" r="2" fill={c.dot} />
            <circle cx="950" cy="280" r="2.5" fill={c.dot} />

            {/* Row 4 - y:380 */}
            <circle cx="100" cy="380" r="2.5" fill={c.dot} />
            <circle cx="320" cy="380" r="2.5" fill={c.dot} />
            <circle cx="450" cy="380" r="2.5" fill={c.dot} />
            <circle cx="700" cy="380" r="2.5" fill={c.dot} />
            <circle cx="950" cy="380" r="2.5" fill={c.dot} />
            <circle cx="1100" cy="380" r="2" fill={c.dot} />

            {/* Row 5 - y:480 */}
            <circle cx="100" cy="480" r="2" fill={c.dot} />
            <circle cx="320" cy="480" r="2" fill={c.dot} />
            <circle cx="580" cy="480" r="2" fill={c.dot} />
            <circle cx="700" cy="480" r="2" fill={c.dot} />
            <circle cx="1100" cy="480" r="2" fill={c.dot} />

            {/* Route midpoint dots */}
            <circle cx="150" cy="130" r="1.5" fill={c.dot} />
            <circle cx="250" cy="130" r="1.5" fill={c.dot} />
            <circle cx="500" cy="130" r="1.5" fill={c.dot} />
            <circle cx="750" cy="130" r="1.5" fill={c.dot} />
            <circle cx="160" cy="220" r="1.5" fill={c.dot} />
            <circle cx="510" cy="220" r="1.5" fill={c.dot} />
            <circle cx="760" cy="220" r="1.5" fill={c.dot} />
            <circle cx="260" cy="340" r="1.5" fill={c.dot} />
            <circle cx="400" cy="330" r="1.5" fill={c.dot} />
            <circle cx="510" cy="440" r="1.5" fill={c.dot} />
            <circle cx="760" cy="440" r="1.5" fill={c.dot} />
            <circle cx="1000" cy="330" r="1.5" fill={c.dot} />
        </svg>
    );
}
