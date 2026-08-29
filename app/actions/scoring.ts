'use server';

import { supabaseAnon } from '../../lib/supabase/anon';
import { circuitScore, scorePerDollar, type CircuitScore } from '../../lib/scoring/circuit-score';
import type { EmulationProfile } from '../../lib/types';

/* Catalogue-wide distributions, so a console page can say where a device stands.
 *
 * Uses the ANON client on purpose, for two reasons. It is stateless, so the console
 * pages stay static — the server client reads cookies and would force them dynamic.
 * And RLS limits anon to published consoles, which is the honest comparison set: a
 * visitor should be ranked against devices they can actually browse, not against
 * drafts nobody can see.
 *
 * The cost of that choice is thin buckets while the catalogue is mostly draft. Any
 * tier with fewer than MIN_POPULATION_FOR_RANK devices returns no rank rather than a
 * rank drawn from three samples. */

export interface TierStats {
    tier: number;
    /** Every Circuit Score in this tier, ascending. */
    scores: number[];
    /** Every price in this tier, ascending. */
    prices: number[];
    /** Score-per-$100 for every priced device in this tier, ascending. */
    values: number[];
    /** Battery capacities, ascending. Kept apart because Wh and mAh are different
     *  scales — pooling them would rank a 50 Wh PC handheld below a 5000 mAh phone chip. */
    batteriesMah: number[];
    batteriesWh: number[];
    medianPrice: number | null;
    medianScore: number | null;
    medianBatteryMah: number | null;
    medianBatteryWh: number | null;
}

export type CatalogueStats = Record<number, TierStats>;

const median = (sorted: number[]): number | null => {
    if (sorted.length === 0) return null;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
};

const EMPTY_TIER = (tier: number): TierStats => ({
    tier, scores: [], prices: [], values: [], batteriesMah: [], batteriesWh: [],
    medianPrice: null, medianScore: null, medianBatteryMah: null, medianBatteryWh: null,
});

export async function fetchCatalogueStats(): Promise<CatalogueStats> {
    const stats: CatalogueStats = { 1: EMPTY_TIER(1), 2: EMPTY_TIER(2), 3: EMPTY_TIER(3), 4: EMPTY_TIER(4), 5: EMPTY_TIER(5) };

    try {
        const { data, error } = await supabaseAnon
            .from('console_variants')
            .select(`
                id, price_launch_usd, price_avg_usd,
                battery_capacity_mah, battery_capacity_wh,
                emulation_profiles(*),
                console:consoles!inner(status, setup_ease_score, community_score)
            `)
            .eq('console.status', 'published');

        if (error) throw error;

        for (const row of (data || []) as any[]) {
            const profile = (Array.isArray(row.emulation_profiles)
                ? row.emulation_profiles[0]
                : row.emulation_profiles) as EmulationProfile | null;
            const consoleRow = Array.isArray(row.console) ? row.console[0] : row.console;

            const cs = circuitScore(profile, consoleRow?.setup_ease_score, consoleRow?.community_score);
            if (!cs) continue;

            const bucket = stats[cs.reach];
            bucket.scores.push(cs.score);

            const price = row.price_avg_usd ?? row.price_launch_usd ?? null;
            if (price && price > 0) {
                bucket.prices.push(Number(price));
                const v = scorePerDollar(cs.score, Number(price));
                if (v !== null) bucket.values.push(v);
            }

            if (row.battery_capacity_wh > 0) bucket.batteriesWh.push(Number(row.battery_capacity_wh));
            if (row.battery_capacity_mah > 0) bucket.batteriesMah.push(Number(row.battery_capacity_mah));
        }

        for (const tier of Object.keys(stats).map(Number)) {
            const b = stats[tier];
            b.scores.sort((a, z) => a - z);
            b.prices.sort((a, z) => a - z);
            b.values.sort((a, z) => a - z);
            b.batteriesMah.sort((a, z) => a - z);
            b.batteriesWh.sort((a, z) => a - z);
            b.medianScore = median(b.scores);
            b.medianPrice = median(b.prices);
            b.medianBatteryMah = median(b.batteriesMah);
            b.medianBatteryWh = median(b.batteriesWh);
        }

        return stats;
    } catch (e: any) {
        console.error('[API] fetchCatalogueStats error:', e?.message ?? e);
        return stats;
    }
}

/** Everything the console page needs to render the score block for one variant. */
export interface ScoreStanding {
    score: CircuitScore;
    /** 0–1 within the same reach tier, or null when the tier is too thin to rank. */
    scorePercentile: number | null;
    pricePercentile: number | null;
    valuePercentile: number | null;
    tierSize: number;
    medianPrice: number | null;
    medianScore: number | null;
}
