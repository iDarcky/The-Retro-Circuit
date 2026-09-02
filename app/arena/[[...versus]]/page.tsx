export const revalidate = false;
export const dynamic = 'force-static';
// Pairs outside the generated list still render on first request and are then cached.
export const dynamicParams = true;

import { supabaseAnon } from '../../../lib/supabase/anon';
import { fetchArenaPairs } from '../../../lib/arena/pairs';
import { parseToken, splitVersus, buildArenaToken } from '../../../lib/arena/resolve';
import { normalizeVariant, unwrapRelation } from '../../../lib/normalize';
import ArenaComparisonClient from '../../../components/arena/ArenaComparisonClient';

/* Build the comparison pages instead of waiting for a visitor to ask for one.
 *
 * Without this the HTML did not exist until first request, so Google could only find a
 * comparison through an internal link from the finder or the homepage compare box. This
 * is the page type carrying most of the site's non-brand clicks. */
export async function generateStaticParams() {
    const pairs = await fetchArenaPairs();
    // The bare hub, then one entry per pair.
    return [{ versus: [] as string[] }, ...pairs.map(pair => ({ versus: [pair] }))];
}

export async function generateMetadata({ params }: { params: Promise<{ versus?: string[] }> }) {
    const { versus } = await params;

    const hub = {
        title: 'Arena VS | Compare Any Two Handhelds | The Retro Circuit',
        description: 'Pick any two retro handhelds and compare them head-to-head. Specs, performance, price, and emulation targets.',
    };
    if (!versus || versus.length === 0) return hub;

    const parts = splitVersus(versus[0]);
    if (!parts) return hub;

    // Resolving here as well as in the page means a legacy hyphen URL canonicalises onto
    // the `~` form rather than declaring itself canonical, so the two do not compete.
    const { data: index } = await supabaseAnon
        .from('consoles')
        .select('slug, name, manufacturer:manufacturer(name)')
        .eq('status', 'published');
    const rows = (index ?? []) as any[];
    const slugSet = new Set(rows.map(r => r.slug));
    const nameOf = new Map(rows.map(r => {
        const mfg = unwrapRelation<any>(r.manufacturer);
        return [r.slug, [mfg?.name, r.name].filter(Boolean).join(' ')];
    }));

    const sides = parts.map(tok => {
        const parsed = parseToken(tok, slugSet);
        if (!parsed) return { token: tok, label: tok.replace(/[-~]/g, ' ').trim() };
        const base = nameOf.get(parsed.consoleSlug) ?? parsed.consoleSlug.replace(/-/g, ' ');
        // Configuration slugs are terse ("12256"), so they ride along in parentheses
        // rather than being spelled out as if they were words.
        const label = parsed.variantSlug ? `${base} (${parsed.variantSlug.replace(/-/g, ' ')})` : base;
        return { token: buildArenaToken(parsed.consoleSlug, parsed.variantSlug), label };
    });

    const [a, b] = sides;
    const sameDevice = parts.length === 2
        && parseToken(parts[0], slugSet)?.consoleSlug === parseToken(parts[1], slugSet)?.consoleSlug;

    const title = sameDevice
        ? `${a.label} vs ${b.label}: which configuration to buy | The Retro Circuit`
        : `${a.label} vs ${b.label} | The Retro Circuit`;
    const description = sameDevice
        ? `Two configurations of the same device compared: what changes between ${a.label} and ${b.label}, and what the step costs.`
        : `Head-to-head spec comparison: ${a.label} vs ${b.label}. Performance, price, and emulation targets.`;

    return {
        title,
        description,
        alternates: { canonical: `/arena/${[a.token, b.token].sort().join('-vs-')}` },
        openGraph: { title, description },
    };
}

/**
 * Fetch a console's full data (with variants, emulation profiles, input profiles) by its DB id.
 * This is the single "heavy" query — called only once we know which console we need.
 */
async function fetchFullConsole(supabase: any, consoleId: string) {
    const { data: fullConsole } = await supabase
        .from('consoles')
        .select('*, manufacturer:manufacturer(*)')
        .eq('id', consoleId)
        .maybeSingle();

    if (!fullConsole) return null;

    const { data: variants } = await supabase
        .from('console_variants')
        .select('*, emulation_profiles(*), variant_input_profile(*)')
        .eq('console_id', fullConsole.id);

    fullConsole.variants = variants?.map(normalizeVariant) || [];
    return fullConsole;
}


export default async function ArenaVersusPage({ params }: { params: Promise<{ versus?: string[] }> }) {
    const { versus } = await params;

    if (!versus || versus.length === 0) {
        return <ArenaComparisonClient />;
    }

    const supabase = supabaseAnon;
    const parts = splitVersus(versus[0]) ?? [versus[0], ''];

    /* One index fetch, then pure parsing.
     *
     * This replaced three overlapping heuristics that each hit the database, the last of
     * which walked hyphens right to left issuing a query per position. It was ambiguous
     * as well as slow: `anbernic-rg-vita-pro` is both a console and the Vita's Pro
     * configuration, and the console always won, so that configuration had no URL. See
     * lib/arena/resolve.ts for why the separator is `~`.
     */
    const { data: index } = await supabase
        .from('consoles')
        .select('id, slug')
        .eq('status', 'published');
    const bySlug = new Map<string, string>((index ?? []).map((c: any) => [c.slug, c.id]));
    const slugSet = new Set(bySlug.keys());

    const resolveSlug = async (_supabase: any, raw: string) => {
        const parsed = parseToken(raw, slugSet);
        if (!parsed) return { p: raw, v: null, details: null, variant: null };

        const consoleId = bySlug.get(parsed.consoleSlug);
        if (!consoleId) return { p: raw, v: null, details: null, variant: null };

        const fullConsole = await fetchFullConsole(supabase, consoleId);
        if (!fullConsole) return { p: raw, v: null, details: null, variant: null };

        // An unknown variant slug falls back to the default rather than 404ing: the
        // console is still the right page to show.
        const variant = (parsed.variantSlug
            ? fullConsole.variants?.find((v: any) => v.slug === parsed.variantSlug)
            : null)
            ?? fullConsole.variants?.find((v: any) => v.is_default)
            ?? fullConsole.variants?.[0]
            ?? null;

        return { p: parsed.consoleSlug, v: variant?.slug ?? null, details: fullConsole, variant };
    };
    const [r1, r2] = await Promise.all([
        parts[0] ? resolveSlug(supabase, parts[0]) : Promise.resolve(null),
        parts[1] ? resolveSlug(supabase, parts[1]) : Promise.resolve(null)
    ]);

    const initialSelectionA = r1?.details ? {
        slug: r1.p,
        details: r1.details,
        selectedVariant: r1.variant,
        loading: false
    } : undefined;

    const initialSelectionB = r2?.details ? {
        slug: r2.p,
        details: r2.details,
        selectedVariant: r2.variant,
        loading: false
    } : undefined;

    return (
        <ArenaComparisonClient
            initialSelectionA={initialSelectionA}
            initialSelectionB={initialSelectionB}
        />
    );
}
