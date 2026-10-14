import { VERSUS_SEP } from './resolve';

/* The comparison pages we put in the sitemap.
 *
 * pairs.ts generates ~720 comparisons and the sitemap used to list all of them. On
 * 2026-10-15 Google had indexed 12 of those 720, never crawled 707, and was barely
 * crawling the rest of the site either: 82% of the sitemap was one template. Only these
 * are in the sitemap now. Other console-level pairs from pairs.ts stay indexable, so Google
 * can still pick them up through links; configuration pairs and pairings outside pairs.ts
 * are noindex, follow (see app/arena/[[...versus]]/page.tsx).
 *
 * Picked from Search Console (2026-10-15, 90 days and 16 months):
 *   - every pair that drew impressions or is already indexed
 *   - the pairs named in search queries
 *   - head-to-heads around the console pages that rank (Retroid, Odin, RG SP, Steam Deck,
 *     GKD 350H Ultra, Trimui, Miyoo), chosen by hand as the comparisons buyers make
 *
 * Console-level pairs only. Configuration pairs (`device~8gb-vs-device~12gb`) stay
 * noindex until their variant slugs are readable.
 *
 * Order inside a pair does not matter: keys are sorted, matching the canonical URL. */
const PAIRS: [string, string][] = [
    // --- Drawing impressions or already indexed
    ['ayaneo-pocket-s-mini', 'ayn-odin-3'],
    ['analogue-pocket', 'ayaneo-pocket-vert'],
    ['kinhank-k59', 'retroid-pocket-4'],
    ['ayn-odin-2-mini', 'ayn-odin-3'],
    ['ayaneo-pocket-air-mini', 'retroid-pocket-2-plus'],
    ['retroid-pocket-2', 'retroid-pocket-2-plus'],
    ['retroid-pocket-mini', 'retroid-pocket-mini-v2'],
    ['mangmi-air-y', 'trimui-brick-pro'],
    ['ayn-odin-2-portal', 'ayn-odin-3'],
    ['anbernic-rg-34xxsp', 'anbernic-rg-sp'],
    ['anbernic-rg-35xxsp', 'anbernic-rg-sp'],
    ['anbernic-rg-sp', 'miyoo-flip'],
    ['ayaneo-pocket-s-1080p', 'valve-steam-deck'],
    ['valve-steam-deck', 'valve-steam-deck-oled'],
    ['retroid-pocket-5', 'retroid-pocket-6'],
    ['anbernic-rg-cube', 'kinhank-k59'],
    ['ayaneo-pocket-micro-2', 'retroid-pocket-6'],
    ['anbernic-rg-ds', 'anbernic-rg-sp'],
    ['game-kiddy-gkd-350h-ultra', 'kinhank-k59'],
    ['powkiddy-rgb30', 'trimui-smart-pro-s'],
    ['ayaneo-pocket-micro', 'retroid-pocket-6'],
    ['ayaneo-next-2', 'ayaneo-pocket-air-mini'],
    // --- Named in search queries
    ['ayaneo-pocket-s-1080p', 'ayn-odin-3'],
    ['ayaneo-pocket-s2', 'ayn-odin-3'],
    // --- Buyer head-to-heads around the pages that rank
    ['retroid-pocket-5', 'retroid-pocket-mini'],
    ['ayn-odin-3', 'retroid-pocket-6'],
    ['retroid-pocket-6', 'retroid-pocket-nova'],
    ['retroid-pocket-5', 'retroid-pocket-nova'],
    ['game-kiddy-gkd-350h-ultra', 'retroid-pocket-nova'],
    ['retroid-pocket-5', 'retroid-pocket-flip-2'],
    ['ayaneo-pocket-dmg', 'retroid-pocket-classic'],
    ['analogue-pocket', 'ayaneo-pocket-dmg'],
    ['anbernic-rg-35xxsp', 'miyoo-flip'],
    ['miyoo-a30', 'miyoo-mini-plus'],
    ['trimui-brick-pro', 'trimui-smart-brick'],
    ['trimui-smart-pro', 'trimui-smart-pro-s'],
    ['anbernic-rg-35xx-plus', 'anbernic-rg-35xxh'],
    ['anbernic-rg-477v', 'retroid-pocket-6'],
    ['anbernic-rg-ds', 'ayn-thor'],
    ['ayaneo-pocket-ds', 'ayn-thor'],
    ['asus-rog-ally', 'valve-steam-deck'],
    ['asus-rog-ally', 'valve-steam-deck-oled'],
    ['anbernic-rg-vita', 'anbernic-rg-vita-pro'],
    ['mangmi-air-x', 'mangmi-air-y'],
    ['ayaneo-pocket-micro', 'ayaneo-pocket-micro-2'],
    ['sony-psp-1000', 'sony-psp-2000'],
];

export const pairKey = (a: string, b: string) => [a, b].sort().join(VERSUS_SEP);

/** Sorted `a-vs-b` keys of the comparisons listed in the sitemap, always indexable. */
export const INDEXABLE_ARENA_PAIRS: ReadonlySet<string> = new Set(PAIRS.map(([a, b]) => pairKey(a, b)));

/** The two console slugs of an indexable pair, for filtering against what is published. */
export const INDEXABLE_ARENA_SIDES: ReadonlyArray<[string, string]> = PAIRS;
