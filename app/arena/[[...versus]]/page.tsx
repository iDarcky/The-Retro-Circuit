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
        return { title: 'Arena VS | Compare Any Two Handhelds | The Retro Circuit', description: 'Pick any two retro handhelds and compare them head-to-head. Specs, performance, price, and emulation targets.', robots: { index: false, follow: false } };
    }

    const parts = versus[0].split('-vs-');

    // Basic title if not fully parseable yet
    if (parts.length !== 2) return { title: 'Arena VS | Compare Any Two Handhelds | The Retro Circuit', description: 'Pick any two retro handhelds and compare them head-to-head. Specs, performance, price, and emulation targets.', robots: { index: false, follow: false } };

    // Simply format the slugs for the title (capitalized)
    const formatName = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const name1 = formatName(parts[0]);
    const name2 = formatName(parts[1]);

    return {
        robots: {
            index: false,
            follow: false,
        },
        title: `${name1} vs ${name2} | The Retro Circuit Arena`,
        description: `Detailed spec comparison: ${name1} versus ${name2}. Compare CPU, Screen, Battery, and more.`,
        openGraph: {
            title: `${name1} vs ${name2} - Fight!`,
            description: 'Who wins? Check the specs.',
        }
    };
}

export default async function ArenaVersusPage({ params }: { params: Promise<{ versus?: string[] }> }) {
    const { versus } = await params;

    if (!versus || versus.length === 0) {
        return <ArenaComparisonClient />;
    }

    const supabase = await createClient();
    const parts = versus[0].split('-vs-');

    const resolveSlug = async (raw: string) => {
        if (!raw || raw === 'select') return { p: null, v: null, details: null, variant: null };

        // 1. Try to resolve using new manufacturer-inclusive format
        // Fetch minimal console data to match against (there's <100 consoles, so this is fast)
        const { data: allConsoles } = await supabase.from('consoles').select('id, slug, manufacturer:manufacturer(slug, name)');

        if (allConsoles) {
            let matchedConsole = null;
            let matchedVariantSlug = null;

            for (const c of allConsoles) {
                const mfgName = (c.manufacturer as any)?.name;
                const mfgSlug = (c.manufacturer as any)?.slug || (mfgName ? mfgName.toLowerCase().replace(/\s+/g, '-') : 'unknown');
                const baseStr = `${mfgSlug}-${c.slug}`;

                if (raw === baseStr) {
                    matchedConsole = c;
                    break;
                } else if (raw.startsWith(baseStr + '-')) {
                    matchedConsole = c;
                    matchedVariantSlug = raw.substring(baseStr.length + 1);
                    break; // Pick the first match. You could sort by length descending to be safer if slugs overlap
                }
            }

            if (matchedConsole) {
                const { data: fullConsole } = await supabase.from('consoles').select('*, manufacturer:manufacturer(*)').eq('id', matchedConsole.id).maybeSingle();
                if (fullConsole) {
                    const { data: variants } = await supabase.from('console_variants').select('*, emulation_profiles(*), variant_input_profile(*)').eq('console_id', fullConsole.id);
                    fullConsole.variants = variants?.map(normalizeVariant);

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

        // 2. Fallback to old URL logic (backwards compatibility for existing links)
        const { data: consoleMatch } = await supabase.from('consoles').select('*, manufacturer:manufacturer(*)').eq('slug', raw).maybeSingle();
        if (consoleMatch) {
            const { data: variants } = await supabase.from('console_variants').select('*, emulation_profiles(*), variant_input_profile(*)').eq('console_id', consoleMatch.id);
            const defaultVar = variants?.find((v: any) => v.is_default) || variants?.[0];
            consoleMatch.variants = variants?.map(normalizeVariant);
            return { p: raw, v: null, details: consoleMatch, variant: normalizeVariant(defaultVar) };
        }

        let lastIndex = raw.lastIndexOf('-');
        while (lastIndex > 0) {
            const potentialConsole = raw.substring(0, lastIndex);
            const potentialVariant = raw.substring(lastIndex + 1);

            const { data: cMatch } = await supabase.from('consoles').select('*, manufacturer:manufacturer(*)').eq('slug', potentialConsole).maybeSingle();
            if (cMatch) {
                const { data: vMatch } = await supabase.from('console_variants').select('*, emulation_profiles(*), variant_input_profile(*)').eq('console_id', cMatch.id).eq('slug', potentialVariant).maybeSingle();
                if (vMatch) {
                    const { data: allVars } = await supabase.from('console_variants').select('*, emulation_profiles(*), variant_input_profile(*)').eq('console_id', cMatch.id);
                    cMatch.variants = allVars?.map(normalizeVariant);
                    return { p: potentialConsole, v: potentialVariant, details: cMatch, variant: normalizeVariant(vMatch) };
                }
            }
            lastIndex = raw.lastIndexOf('-', lastIndex - 1);
        }
        return { p: raw, v: null, details: null, variant: null };
    };

    const [r1, r2] = await Promise.all([
        parts[0] ? resolveSlug(parts[0]) : Promise.resolve(null),
        parts[1] ? resolveSlug(parts[1]) : Promise.resolve(null)
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
