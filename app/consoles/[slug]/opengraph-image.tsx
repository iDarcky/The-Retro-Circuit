import { supabaseAnon } from '../../../lib/supabase/anon';
import { circuitScore } from '../../../lib/scoring/circuit-score';
import { fetchConsoleList } from '../../../app/actions/consoles';
import { renderConsoleCard, OG_SIZE, OG_RENDERABLE, type ConsoleCardData } from '../../../lib/og/console-card';

/* The card a console link unfurls into.
 *
 * Every link to this site posted anywhere used to render as a blank rectangle, which is
 * the cheapest possible way to waste a share. Prerendered with the pages, so nothing
 * happens at request time and a broken card fails the build rather than a visitor.
 *
 * This file only gathers data. The drawing lives in lib/og/console-card so it can be
 * rendered in a test without a database, which is how the display:flex bug that took the
 * build down should have been caught the first time.
 */

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const consoles = await fetchConsoleList(false);
    return consoles.map(c => ({ slug: c.slug }));
}

export const alt = 'Console specs and emulation performance';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const card: ConsoleCardData = { name: 'Unknown device', facts: [] };

    try {
        const { data } = await supabaseAnon
            .from('consoles')
            .select(`
                name, image_url, form_factor, setup_ease_score, community_score,
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
            const mfg = Array.isArray(c.manufacturer) ? c.manufacturer[0] : c.manufacturer;
            const variants: any[] = c.variants ?? [];
            const def = variants.find(v => v.is_default) ?? variants[0];

            card.name = c.name ?? card.name;
            card.brand = mfg?.name ?? '';

            // Satori cannot decode WebP and the uploader writes WebP, so an unusable URL
            // is dropped here rather than failing to load during the build.
            const candidate = c.image_url ?? def?.image_url ?? null;
            card.image = candidate && OG_RENDERABLE.test(candidate) ? candidate : null;

            const prices = variants
                .map(v => v.price_avg_usd || v.price_launch_usd || 0)
                .filter((p: number) => p > 0);
            if (prices.length) card.priceLabel = `$${Math.min(...prices)}`;

            const profile = def?.emulation_profiles
                ? (Array.isArray(def.emulation_profiles) ? def.emulation_profiles[0] : def.emulation_profiles)
                : null;
            const cs = circuitScore(profile, c.setup_ease_score, c.community_score);
            if (cs) {
                card.scoreValue = String(cs.score);
                card.scoreLabel = `Circuit Score · Tier ${cs.reach}`;
            }

            const facts: string[] = [];
            const chip = [def?.soc_vendor, def?.soc_name].filter(Boolean).join(' ');
            if (chip) facts.push(chip);
            if (def?.ram_mb) facts.push(def.ram_mb >= 1024 ? `${Math.round(def.ram_mb / 1024)} GB RAM` : `${def.ram_mb} MB RAM`);
            if (def?.screen_size_inch) facts.push(`${def.screen_size_inch}" screen`);
            if (c.form_factor) facts.push(String(c.form_factor));
            card.facts = facts;
        }
    } catch {
        // A card with the name on it still beats a blank rectangle.
    }

    return renderConsoleCard(card);
}
