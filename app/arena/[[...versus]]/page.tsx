export const revalidate = false;
export const dynamic = 'force-static';

import { createClient } from '../../../lib/supabase/server';
import ArenaComparisonClient from '../../../components/arena/ArenaComparisonClient';

// Quick inline normalize for server
function normalizeVariant(v: any): any {
    if (!v) return v;
    if (Array.isArray(v.variant_input_profile)) { v.variant_input_profile = v.variant_input_profile[0] || null; }
    if (Array.isArray(v.emulation_profiles)) { v.emulation_profile = v.emulation_profiles[0] || null; }
    return v;
}

export async function generateMetadata({ params }: { params: Promise<{ versus?: string[] }> }) {
    const { versus } = await params;

    if (!versus || versus.length === 0) {
        return { title: 'Arena VS | Compare Any Two Handhelds | The Retro Circuit', description: 'Pick any two retro handhelds and compare them head-to-head. Specs, performance, price, and emulation targets.' };
    }

    const parts = versus[0].split('-vs-');

    // Basic title if not fully parseable yet
    if (parts.length !== 2) return { title: 'Arena VS | Compare Any Two Handhelds | The Retro Circuit', description: 'Pick any two retro handhelds and compare them head-to-head. Specs, performance, price, and emulation targets.' };

    // Simply format the slugs for the title (capitalized)
    const formatName = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const name1 = formatName(parts[0]);
    const name2 = formatName(parts[1]);


    const sortedSlugs = [parts[0], parts[1]].sort();
    const canonicalPath = `/arena/${sortedSlugs[0]}-vs-${sortedSlugs[1]}`;

    return {
        // Now allowing indexing with canonical tag pointing to alphabetically sorted URL
        title: `${name1} vs ${name2} | The Retro Circuit`,
        description: `Head-to-head spec comparison: ${name1} vs ${name2}. Performance, price, and emulation targets.`,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title: `${name1} vs ${name2} | The Retro Circuit Arena`,
            description: `Head-to-head spec comparison: ${name1} vs ${name2}.`,
        }
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

/**
 * Resolve a raw URL slug (e.g. "miyoo-mini" or "retroid-pocket-5-base") to a console + variant.
 *
 * Strategy (optimized — no fetch-all-then-filter):
 * 1. Fetch only lightweight lookup data (id, slug, manufacturer slug) in ONE query.
 *    PostgREST returns this as a small payload (~66 rows × 3 columns).
 *    Match in code — this is CPU-only with no additional DB round-trips.
 * 2. Once matched, fetch the full console + variants in ONE targeted query by ID.
 * 3. Fallback: try direct slug match for legacy URLs.
 */
async function resolveSlug(supabase: any, raw: string) {
    if (!raw || raw === 'select') return { p: null, v: null, details: null, variant: null };

    // --- Step 1: Lightweight lookup ---
    const { data: lookupList } = await supabase
        .from('consoles')
        .select('id, slug, manufacturer:manufacturer(slug, name)');

    if (lookupList) {
        let matchedId: string | null = null;
        let matchedVariantSlug: string | null = null;

        for (const c of lookupList) {
            const mfgSlug = (c.manufacturer as any)?.slug
                || ((c.manufacturer as any)?.name ? (c.manufacturer as any).name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
            const baseStr = `${mfgSlug}-${c.slug}`;

            if (raw === baseStr) {
                matchedId = c.id;
                break;
            } else if (raw.startsWith(baseStr + '-')) {
                matchedId = c.id;
                matchedVariantSlug = raw.substring(baseStr.length + 1);
                break;
            }
        }

        if (matchedId) {
            const fullConsole = await fetchFullConsole(supabase, matchedId);
            if (fullConsole) {
                let variantMatch = null;
                if (matchedVariantSlug) {
                    variantMatch = fullConsole.variants?.find((v: any) => v.slug === matchedVariantSlug);
                }
                if (!variantMatch) {
                    variantMatch = fullConsole.variants?.find((v: any) => v.is_default) || fullConsole.variants?.[0];
                }
                return { p: raw, v: matchedVariantSlug, details: fullConsole, variant: variantMatch || null };
            }
        }
    }

    // --- Step 2: Fallback — legacy direct slug match ---
    const { data: legacyMatch } = await supabase
        .from('consoles')
        .select('id')
        .eq('slug', raw)
        .maybeSingle();

    if (legacyMatch) {
        const fullConsole = await fetchFullConsole(supabase, legacyMatch.id);
        if (fullConsole) {
            const defaultVar = fullConsole.variants?.find((v: any) => v.is_default) || fullConsole.variants?.[0];
            return { p: raw, v: null, details: fullConsole, variant: defaultVar || null };
        }
    }

    // --- Step 3: Fallback — legacy slug-variant split (walk hyphens) ---
    let lastIndex = raw.lastIndexOf('-');
    while (lastIndex > 0) {
        const potentialConsole = raw.substring(0, lastIndex);
        const potentialVariant = raw.substring(lastIndex + 1);

        const { data: cMatch } = await supabase
            .from('consoles')
            .select('id')
            .eq('slug', potentialConsole)
            .maybeSingle();

        if (cMatch) {
            const fullConsole = await fetchFullConsole(supabase, cMatch.id);
            if (fullConsole) {
                const vMatch = fullConsole.variants?.find((v: any) => v.slug === potentialVariant);
                if (vMatch) {
                    return { p: potentialConsole, v: potentialVariant, details: fullConsole, variant: vMatch };
                }
            }
        }
        lastIndex = raw.lastIndexOf('-', lastIndex - 1);
    }

    return { p: raw, v: null, details: null, variant: null };
}

export default async function ArenaVersusPage({ params }: { params: Promise<{ versus?: string[] }> }) {
    const { versus } = await params;

    if (!versus || versus.length === 0) {
        return <ArenaComparisonClient />;
    }

    const supabase = await createClient();
    const parts = versus[0].split('-vs-');

    const resolveSlug = async (supabase: any, raw: string) => {
        if (!raw || raw === 'select') return { p: null, v: null, details: null, variant: null };

        // --- Step 1: Lightweight lookup ---
        const { data: lookupList } = await supabase
            .from('consoles')
            .select('id, slug, manufacturer:manufacturer(slug, name)');

        if (lookupList) {
            let matchedId: string | null = null;
            let matchedVariantSlug: string | null = null;

            for (const c of lookupList) {
                const mfgSlug = (c.manufacturer as any)?.slug
                    || ((c.manufacturer as any)?.name ? (c.manufacturer as any).name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
                const baseStr = `${mfgSlug}-${c.slug}`;

                if (raw === baseStr) {
                    matchedId = c.id;
                    break;
                } else if (raw.startsWith(baseStr + '-')) {
                    matchedId = c.id;
                    matchedVariantSlug = raw.substring(baseStr.length + 1);
                    break;
                }
            }

            if (matchedId) {
                const fullConsole = await fetchFullConsole(supabase, matchedId);
                if (fullConsole) {
                    let variantMatch = null;
                    if (matchedVariantSlug) {
                        variantMatch = fullConsole.variants?.find((v: any) => v.slug === matchedVariantSlug);
                    }
                    if (!variantMatch) {
                        variantMatch = fullConsole.variants?.find((v: any) => v.is_default) || fullConsole.variants?.[0];
                    }
                    return { p: raw, v: matchedVariantSlug, details: fullConsole, variant: variantMatch || null };
                }
            }
        }

        // --- Step 2: Fallback — legacy direct slug match ---
        const { data: legacyMatch } = await supabase
            .from('consoles')
            .select('id')
            .eq('slug', raw)
            .maybeSingle();

        if (legacyMatch) {
            const fullConsole = await fetchFullConsole(supabase, legacyMatch.id);
            if (fullConsole) {
                const defaultVar = fullConsole.variants?.find((v: any) => v.is_default) || fullConsole.variants?.[0];
                return { p: raw, v: null, details: fullConsole, variant: defaultVar || null };
            }
        }

        // --- Step 3: Fallback — legacy slug-variant split (walk hyphens) ---
        let lastIndex = raw.lastIndexOf('-');
        while (lastIndex > 0) {
            const potentialConsole = raw.substring(0, lastIndex);
            const potentialVariant = raw.substring(lastIndex + 1);

            const { data: cMatch } = await supabase
                .from('consoles')
                .select('id')
                .eq('slug', potentialConsole)
                .maybeSingle();

            if (cMatch) {
                const fullConsole = await fetchFullConsole(supabase, cMatch.id);
                if (fullConsole) {
                    const vMatch = fullConsole.variants?.find((v: any) => v.slug === potentialVariant);
                    if (vMatch) {
                        return { p: potentialConsole, v: potentialVariant, details: fullConsole, variant: vMatch };
                    }
                }
            }
            lastIndex = raw.lastIndexOf('-', lastIndex - 1);
        }

        return { p: raw, v: null, details: null, variant: null };
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
