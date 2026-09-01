/* Turning one side of an /arena/a-vs-b URL into a console and a configuration.
 *
 * The comparison this site is uniquely able to make is between two configurations of the
 * same device: "Thor 8/128 or 12/256", where the two differ by chip, memory and price.
 * That needs a URL, and a console slug alone cannot express it.
 *
 * The separator is `~`, and that choice is forced by the data rather than taste:
 *
 *   - A plain hyphen is ambiguous. `anbernic-rg-vita` has a variant slugged `pro`, and
 *     `anbernic-rg-vita-pro` is also a real console. Joining with `-` makes those two
 *     things the same string, and the console wins, so the Vita's Pro configuration
 *     becomes unaddressable.
 *   - `--` is taken: three variant slugs already contain it.
 *   - `~` appears in no console slug and no variant slug, and RFC 3986 lists it as
 *     unreserved, so it needs no escaping.
 *
 * So `/arena/anbernic-rg-vita~pro-vs-anbernic-rg-vita~base` is unambiguous by
 * construction rather than by a lookup that happens to succeed today.
 *
 * Old hyphen-joined URLs still resolve. They are indexed, and the previous code did
 * produce some of them, so they are handled as a legacy shape rather than broken.
 */

export const VARIANT_SEP = '~';
export const VERSUS_SEP = '-vs-';

export interface ConsoleRef {
    id: string;
    slug: string;
}

export interface ParsedToken {
    consoleSlug: string;
    /** null means "whichever variant is the default". */
    variantSlug: string | null;
    /** True when the token had to be read with the legacy hyphen rule. */
    legacy: boolean;
}

/** One side of a comparison URL, as a path segment. */
export function buildArenaToken(consoleSlug: string, variantSlug?: string | null): string {
    return variantSlug ? `${consoleSlug}${VARIANT_SEP}${variantSlug}` : consoleSlug;
}

/**
 * A whole comparison path, with the two sides ordered so one comparison has one URL.
 * The page sets its canonical from the same sort, so both orders agree.
 */
export function buildArenaPath(a: string, b: string): string {
    return `/arena/${[a, b].sort().join(VERSUS_SEP)}`;
}

/** Split `a-vs-b` into its two sides. Returns null when the shape is wrong. */
export function splitVersus(segment: string): [string, string] | null {
    const parts = segment.split(VERSUS_SEP);
    return parts.length === 2 && parts[0] && parts[1] ? [parts[0], parts[1]] : null;
}

/**
 * Read one side of the URL against the set of console slugs that actually exist.
 *
 * Resolution order matters, and exact-match-first is what keeps the legacy rule safe:
 * a token that names a real console is always that console, never a longer console's
 * variant that happens to spell the same thing.
 */
export function parseToken(token: string, consoleSlugs: Set<string>): ParsedToken | null {
    if (!token || token === 'select') return null;

    // 1. Explicit, and the only form we generate.
    const sep = token.indexOf(VARIANT_SEP);
    if (sep > 0) {
        const consoleSlug = token.slice(0, sep);
        const variantSlug = token.slice(sep + 1);
        if (!consoleSlug || !variantSlug) return null;
        return { consoleSlug, variantSlug, legacy: false };
    }

    // 2. A console on its own, showing its default configuration.
    if (consoleSlugs.has(token)) {
        return { consoleSlug: token, variantSlug: null, legacy: false };
    }

    // 3. Legacy hyphen join. Longest console prefix wins, so `retroid-pocket-2-plus-8gb`
    //    reads as the 2 Plus rather than the 2 with a variant called `plus-8gb`.
    let best: ParsedToken | null = null;
    for (const slug of consoleSlugs) {
        if (!token.startsWith(slug + '-')) continue;
        if (best && slug.length <= best.consoleSlug.length) continue;
        best = { consoleSlug: slug, variantSlug: token.slice(slug.length + 1), legacy: true };
    }
    return best;
}

/** Canonical form of a token, so a legacy URL can point at the one we generate. */
export function canonicaliseToken(parsed: ParsedToken): string {
    return buildArenaToken(parsed.consoleSlug, parsed.variantSlug);
}
