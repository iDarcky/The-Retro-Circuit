import { ConsoleDetails } from '../types';

/**
 * "Best Of" landing pages.
 *
 * These are the pages that actually rank on Google and drive affiliate clicks — the site
 * previously had no editorial/collection content at all. Each collection is defined as a
 * filter + ranking over live DB data, so pages stay correct as the catalogue grows
 * (no hand-maintained device lists).
 */

export interface BestOfCollection {
    slug: string;
    /** H1 / page title. */
    title: string;
    /** Meta description + intro copy. */
    description: string;
    /** Short label used in listings. */
    shortLabel: string;
    /** Keep only devices matching this. */
    filter: (c: ConsoleDetails) => boolean;
    /** Higher is better. */
    rank: (c: ConsoleDetails) => number;
}

const specs = (c: ConsoleDetails): any => (c as any).specs || {};
const price = (c: ConsoleDetails): number | null => {
    const p = specs(c).price_launch_usd;
    return typeof p === 'number' && p > 0 ? p : null;
};

/** Emulation ratings that count as "this system actually runs". */
const PASS_STATES = ['Playable', 'Great', 'Perfect'];
const STATE_RANK: Record<string, number> = { Perfect: 4, Great: 3, Playable: 2, Struggles: 1, Unplayable: 0 };

const emuState = (c: ConsoleDetails, key: string): string | null => {
    const variants = (c as any).variants || [];
    // Use the best rating across variants — the console "can" do it if any variant can.
    let best: string | null = null;
    for (const v of variants) {
        const profile = v.emulation_profile || v.emulation_profiles;
        const state = profile?.[key];
        if (!state) continue;
        if (best === null || (STATE_RANK[state] ?? -1) > (STATE_RANK[best] ?? -1)) best = state;
    }
    return best;
};

const runsSystem = (c: ConsoleDetails, key: string): boolean => {
    const s = emuState(c, key);
    return s !== null && PASS_STATES.includes(s);
};

const systemScore = (c: ConsoleDetails, key: string): number => {
    const s = emuState(c, key);
    return s ? (STATE_RANK[s] ?? 0) : 0;
};

/** Rank by how well it runs the system, then by value (cheaper wins ties). */
const rankBySystemThenValue = (key: string) => (c: ConsoleDetails): number => {
    const p = price(c);
    const valueBonus = p ? Math.max(0, 1 - p / 1000) : 0;
    return systemScore(c, key) * 10 + valueBonus;
};

/** Rank by capability per dollar. */
const rankByValue = (c: ConsoleDetails): number => {
    const p = price(c);
    if (!p) return 0;
    const power = ['ps2_state', 'gamecube_state', 'psp_state', 'nds_state', 'ps1_state', 'switch_state']
        .reduce((sum, k) => sum + systemScore(c, k), 0);
    return power / Math.max(p, 30);
};

const underPrice = (max: number) => (c: ConsoleDetails): boolean => {
    const p = price(c);
    return p !== null && p <= max;
};

export const BEST_OF_COLLECTIONS: BestOfCollection[] = [
    {
        slug: 'best-retro-handhelds-under-100',
        title: 'Best Retro Handhelds Under $100',
        shortLabel: 'Under $100',
        description:
            'The best budget retro handhelds you can buy for under $100 — ranked by how much emulation power you actually get for the money.',
        filter: underPrice(100),
        rank: rankByValue,
    },
    {
        slug: 'best-retro-handhelds-under-200',
        title: 'Best Retro Handhelds Under $200',
        shortLabel: 'Under $200',
        description:
            'The best retro handhelds under $200. This is the sweet spot for PS1, PSP and DS emulation without overspending.',
        filter: underPrice(200),
        rank: rankByValue,
    },
    {
        slug: 'best-handhelds-for-ps2-emulation',
        title: 'Best Handhelds for PS2 Emulation',
        shortLabel: 'PS2 emulation',
        description:
            'PS2 is where cheap handhelds fall apart. These are the devices that genuinely run PlayStation 2 games well, ranked by real-world performance.',
        filter: (c) => runsSystem(c, 'ps2_state'),
        rank: rankBySystemThenValue('ps2_state'),
    },
    {
        slug: 'best-handhelds-for-gamecube-emulation',
        title: 'Best Handhelds for GameCube Emulation',
        shortLabel: 'GameCube emulation',
        description:
            'Handhelds that can actually handle GameCube emulation, ranked by measured performance rather than marketing claims.',
        filter: (c) => runsSystem(c, 'gamecube_state'),
        rank: rankBySystemThenValue('gamecube_state'),
    },
    {
        slug: 'best-handhelds-for-psp-emulation',
        title: 'Best Handhelds for PSP Emulation',
        shortLabel: 'PSP emulation',
        description:
            'PSP emulation is achievable on modest hardware. These handhelds run it best, from budget picks to premium devices.',
        filter: (c) => runsSystem(c, 'psp_state'),
        rank: rankBySystemThenValue('psp_state'),
    },
    {
        slug: 'best-clamshell-handhelds',
        title: 'Best Clamshell Retro Handhelds',
        shortLabel: 'Clamshell',
        description:
            'Clamshell handhelds fold shut to protect the screen, making them the most pocketable option. Here are the best ones available.',
        filter: (c) => (c.form_factor || '').toLowerCase() === 'clamshell',
        rank: rankByValue,
    },
    {
        slug: 'best-vertical-handhelds',
        title: 'Best Vertical Retro Handhelds',
        shortLabel: 'Vertical',
        description:
            'Vertical handhelds echo the classic Game Boy layout and excel at retro 2D libraries. These are the strongest picks.',
        filter: (c) => (c.form_factor || '').toLowerCase() === 'vertical',
        rank: rankByValue,
    },
    {
        slug: 'best-premium-handhelds',
        title: 'Best Premium Retro Handhelds',
        shortLabel: 'Premium',
        description:
            'If budget is not the constraint, these are the most capable handhelds available — the ones that run the hardest systems.',
        filter: (c) => {
            const p = price(c);
            return p !== null && p >= 250;
        },
        rank: (c) =>
            ['switch_state', 'ps3_state', 'wii_u', 'ps2_state', 'gamecube_state'].reduce(
                (sum, k) => sum + systemScore(c, k),
                0
            ),
    },
];

export function getCollection(slug: string): BestOfCollection | undefined {
    return BEST_OF_COLLECTIONS.find((c) => c.slug === slug);
}

/** Apply a collection to the catalogue: filter, rank, and cap the list. */
export function selectForCollection(
    collection: BestOfCollection,
    consoles: ConsoleDetails[],
    limit = 10
): ConsoleDetails[] {
    return consoles
        .filter(collection.filter)
        .sort((a, b) => collection.rank(b) - collection.rank(a))
        .slice(0, limit);
}
