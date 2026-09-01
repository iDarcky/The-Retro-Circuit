import { ImageResponse } from 'next/og';
import { supabaseAnon } from '../../../lib/supabase/anon';
import { circuitScore } from '../../../lib/scoring/circuit-score';
import { fetchConsoleList } from '../../../app/actions/consoles';

/* The card a console link unfurls into.
 *
 * Every link to this site posted anywhere, Reddit, Discord, a group chat, used to render
 * as a blank rectangle, which is the cheapest possible way to waste a share. Generated at
 * build time alongside the page, so there is no request-time cost.
 *
 * No custom fonts on purpose. Fetching Press Start 2P per page would put a network call
 * in the critical path of every one of these at build, and a failed fetch fails the
 * build. The identity comes from the palette, the rules and the layout instead.
 */

/* Prerendered with the pages, not on request. Without generateStaticParams this route
 * builds as dynamic, which breaks the rule that only /admin/* renders per request. */
export const dynamic = 'force-static';

export async function generateStaticParams() {
    const consoles = await fetchConsoleList(false);
    return consoles.map(c => ({ slug: c.slug }));
}

export const alt = 'Console specs and emulation performance';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const VIOLET = '#8b5cf6';
const EMERALD = '#34d399';
const GROUND = '#09090b';
const PANEL = '#101014';
const HAIR = 'rgba(255,255,255,0.10)';
const DIM = '#8b8b96';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let name = 'Unknown device';
    let brand = '';
    let price: number | null = null;
    let score: number | null = null;
    let reach: number | null = null;
    let image: string | null = null;
    const facts: string[] = [];

    try {
        const { data } = await supabaseAnon
            .from('consoles')
            .select(`
                name, image_url, device_category, form_factor,
                setup_ease_score, community_score,
                manufacturer:manufacturer(name),
                variants:console_variants(
                    is_default, image_url, price_avg_usd, price_launch_usd,
                    ram_mb, screen_size_inch, soc_name, soc_vendor,
                    emulation_profiles(*)
                )
            `)
            .eq('slug', decodeURIComponent(slug))
            .eq('status', 'published')
            .maybeSingle();

        if (data) {
            const c = data as any;
            name = c.name ?? name;
            const mfg = Array.isArray(c.manufacturer) ? c.manufacturer[0] : c.manufacturer;
            brand = mfg?.name ?? '';

            const variants: any[] = c.variants ?? [];
            const def = variants.find(v => v.is_default) ?? variants[0];
            image = c.image_url ?? def?.image_url ?? null;

            const prices = variants
                .map(v => v.price_avg_usd || v.price_launch_usd || 0)
                .filter((p: number) => p > 0);
            price = prices.length ? Math.min(...prices) : null;

            const profile = def?.emulation_profiles
                ? (Array.isArray(def.emulation_profiles) ? def.emulation_profiles[0] : def.emulation_profiles)
                : null;
            const cs = circuitScore(profile, c.setup_ease_score, c.community_score);
            if (cs) { score = cs.score; reach = cs.reach; }

            const chip = [def?.soc_vendor, def?.soc_name].filter(Boolean).join(' ');
            if (chip) facts.push(chip);
            if (def?.ram_mb) facts.push(def.ram_mb >= 1024 ? `${Math.round(def.ram_mb / 1024)} GB RAM` : `${def.ram_mb} MB RAM`);
            if (def?.screen_size_inch) facts.push(`${def.screen_size_inch}" screen`);
            if (c.form_factor) facts.push(String(c.form_factor));
        }
    } catch {
        // A card with the name on it still beats a blank rectangle.
    }

    return new ImageResponse(
        (
            <div style={{
                width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                background: GROUND, color: '#fafafa', padding: 56,
            }}>
                <div style={{ display: 'flex', flex: 1, gap: 44 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        {brand && (
                            <div style={{ fontSize: 24, letterSpacing: 4, color: DIM, textTransform: 'uppercase', marginBottom: 14 }}>
                                {brand}
                            </div>
                        )}
                        <div style={{
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

                    {image && (
                        <div style={{
                            display: 'flex', width: 400, alignItems: 'center', justifyContent: 'center',
                            background: PANEL, border: `1px solid ${HAIR}`,
                            backgroundImage: `radial-gradient(120% 90% at 50% 40%, rgba(139,92,246,0.16), transparent 62%)`,
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image} alt="" width={330} height={330} style={{ objectFit: 'contain' }} />
                        </div>
                    )}
                </div>

                <div style={{
                    display: 'flex', alignItems: 'flex-end', gap: 52,
                    borderTop: `2px solid rgba(255,255,255,0.18)`, paddingTop: 26, marginTop: 30,
                }}>
                    {price !== null && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 18, letterSpacing: 3, color: DIM, textTransform: 'uppercase', marginBottom: 6 }}>From</div>
                            <div style={{ fontSize: 52, fontWeight: 700, color: EMERALD, lineHeight: 1 }}>${price}</div>
                        </div>
                    )}
                    {score !== null && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 18, letterSpacing: 3, color: DIM, textTransform: 'uppercase', marginBottom: 6 }}>
                                Circuit Score{reach ? ` · Tier ${reach}` : ''}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ fontSize: 52, fontWeight: 700, color: VIOLET, lineHeight: 1 }}>{score}</span>
                                <span style={{ fontSize: 24, color: DIM, marginLeft: 6 }}>/100</span>
                            </div>
                        </div>
                    )}
                    <div style={{
                        display: 'flex', marginLeft: 'auto', fontSize: 20, letterSpacing: 4,
                        color: DIM, textTransform: 'uppercase',
                    }}>
                        theretrocircuit.com
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
