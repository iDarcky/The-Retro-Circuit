import { ConsoleDetails } from './types';

/**
 * Shape helpers for rows coming back from PostgREST.
 *
 * Supabase returns a 1:1 relation as a one-element array, so every caller that joins
 * `variant_input_profile` or `emulation_profiles` has to unwrap it. The same three
 * lines were copied into `app/actions/consoles.ts`, `app/actions/latest.ts` and the
 * arena route, and drifted: the arena copy had no console-level normaliser at all, so
 * its rows carried no `specs`. They live here now so there is one definition to fix.
 *
 * These are deliberately not server actions — a `"use server"` module publishes every
 * export as an RPC endpoint, and these are pure shape helpers.
 */

/** Unwrap the single-element arrays PostgREST returns for a variant's 1:1 relations. */
export function normalizeVariant<T extends Record<string, any>>(v: T | null | undefined): T | null | undefined {
    if (!v) return v;
    if (Array.isArray(v.variant_input_profile)) {
        (v as any).variant_input_profile = v.variant_input_profile[0] || null;
    }
    if (Array.isArray(v.emulation_profiles)) {
        (v as any).emulation_profile = v.emulation_profiles[0] || null;
    }
    return v;
}

/**
 * Pick the configuration a console should be described by.
 *
 * The flagged default when there is one, otherwise the first row. Every listing card,
 * OG image and comparison surface needs the same answer, and picking differently
 * across surfaces is how a console ends up showing one price on `/consoles` and
 * another on its own page.
 */
export function defaultVariantOf<T extends { is_default?: boolean | null }>(variants: T[] | null | undefined): T | undefined {
    if (!variants || variants.length === 0) return undefined;
    return variants.find((v) => v.is_default) ?? variants[0];
}

/**
 * Unwrap a joined relation that may arrive as a row or as a one-element array.
 *
 * `manufacturer:manufacturer(*)` comes back as an object on some queries and an array
 * on others depending on how the FK is declared, so callers cannot assume either.
 */
export function unwrapRelation<T>(rel: T | T[] | null | undefined): T | null {
    if (Array.isArray(rel)) return rel[0] ?? null;
    return rel ?? null;
}

/**
 * Normalize a console list: unwrap variant relations, then hoist the default
 * variant onto `specs` and backfill the card image from it.
 *
 * Mutates in place, which is what the existing callers rely on — these rows are
 * freshly deserialized from PostgREST and are not shared.
 */
export function normalizeConsoleList(data: any[] | null | undefined): ConsoleDetails[] {
    if (!data || !Array.isArray(data)) return [];

    return data
        .map((item: any) => {
            if (!item) return null;

            const variants = (item.variants || []).map(normalizeVariant);
            item.variants = variants;

            const defaultVariant = defaultVariantOf<any>(variants);
            if (defaultVariant) {
                if (!item.image_url) item.image_url = defaultVariant.image_url;
                item.specs = defaultVariant;
            } else {
                item.specs = {};
            }

            return item;
        })
        .filter(Boolean) as ConsoleDetails[];
}
