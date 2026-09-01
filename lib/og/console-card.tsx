import { ImageResponse } from 'next/og';

/* The share card, as a pure function of already-fetched data.
 *
 * Split out from the route so it can be rendered in a test without a database. The first
 * version of this shipped untested, rendered fine for a console with no score, and took
 * the production build down on the first one that had a score.
 *
 * Two Satori rules it broke, both worth stating because they fail the whole build rather
 * than one card:
 *
 *   1. A <div> with more than one child needs an explicit display. In JSX,
 *      `Circuit Score{suffix}` and `${price}` are each TWO children, a text node and an
 *      expression. Everything here is precomputed into single strings so the next person
 *      editing a label does not have to know that.
 *   2. Satori cannot decode WebP, and the image uploader writes WebP. The caller filters
 *      the URL; this renders whatever it is given or nothing.
 */

export const OG_SIZE = { width: 1200, height: 630 };

/** Image formats Satori can decode. WebP and AVIF are not among them. */
export const OG_RENDERABLE = /\.(png|jpe?g|gif|svg)(\?|$)/i;

export interface ConsoleCardData {
    name: string;
    brand?: string;
    /** Pre-formatted, e.g. "$309". */
    priceLabel?: string | null;
    /** Pre-formatted, e.g. "87". */
    scoreValue?: string | null;
    /** Pre-formatted, e.g. "Circuit Score · Tier 5". */
    scoreLabel?: string;
    /** Already checked against OG_RENDERABLE by the caller. */
    image?: string | null;
    facts?: string[];
}

const VIOLET = '#8b5cf6';
const EMERALD = '#34d399';
const GROUND = '#09090b';
const PANEL = '#101014';
const HAIR = 'rgba(255,255,255,0.10)';
const DIM = '#8b8b96';

export function renderConsoleCard(d: ConsoleCardData) {
    const name = d.name || 'Unknown device';
    const facts = d.facts ?? [];
    const label = {
        display: 'flex', fontSize: 18, letterSpacing: 3, color: DIM,
        textTransform: 'uppercase' as const, marginBottom: 6,
    };

    return new ImageResponse(
        (
            <div style={{
                width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                background: GROUND, color: '#fafafa', padding: 56,
            }}>
                <div style={{ display: 'flex', flex: 1, gap: 44 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        {d.brand ? (
                            <div style={{ display: 'flex', fontSize: 24, letterSpacing: 4, color: DIM, textTransform: 'uppercase', marginBottom: 14 }}>
                                {d.brand}
                            </div>
                        ) : null}
                        <div style={{
                            display: 'flex',
                            fontSize: name.length > 22 ? 62 : 82, fontWeight: 700, lineHeight: 1.02,
                            textTransform: 'uppercase', letterSpacing: -2, marginBottom: 26,
                        }}>
                            {name}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {facts.slice(0, 4).map(f => (
                                <div key={f} style={{
                                    display: 'flex', border: `1px solid ${HAIR}`, padding: '7px 13px',
                                    fontSize: 20, color: DIM, textTransform: 'uppercase', letterSpacing: 1,
                                }}>
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {d.image ? (
                        <div style={{
                            display: 'flex', width: 400, alignItems: 'center', justifyContent: 'center',
                            background: PANEL, border: `1px solid ${HAIR}`,
                            backgroundImage: 'radial-gradient(120% 90% at 50% 40%, rgba(139,92,246,0.16), transparent 62%)',
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={d.image} alt="" width={330} height={330} style={{ objectFit: 'contain' }} />
                        </div>
                    ) : null}
                </div>

                <div style={{
                    display: 'flex', alignItems: 'flex-end', gap: 52,
                    borderTop: '2px solid rgba(255,255,255,0.18)', paddingTop: 26, marginTop: 30,
                }}>
                    {d.priceLabel ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={label}>From</div>
                            <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, color: EMERALD, lineHeight: 1 }}>
                                {d.priceLabel}
                            </div>
                        </div>
                    ) : null}
                    {d.scoreValue ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={label}>{d.scoreLabel ?? 'Circuit Score'}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ fontSize: 52, fontWeight: 700, color: VIOLET, lineHeight: 1 }}>{d.scoreValue}</span>
                                <span style={{ fontSize: 24, color: DIM, marginLeft: 6 }}>/100</span>
                            </div>
                        </div>
                    ) : null}
                    <div style={{
                        display: 'flex', marginLeft: 'auto', fontSize: 20, letterSpacing: 4,
                        color: DIM, textTransform: 'uppercase',
                    }}>
                        theretrocircuit.com
                    </div>
                </div>
            </div>
        ),
        OG_SIZE,
    );
}
