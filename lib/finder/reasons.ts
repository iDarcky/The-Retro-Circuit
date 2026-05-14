import type { ScoreBreakdown } from './scoring';

export type PickType = 'best' | 'perf' | 'upgrade' | 'runner';

interface ReasonInputs {
    profile: string | null;
    targetTier: string | null;
    budgetBand: string | null;
    portabilityPref: string | null;
    setupAnswer: string | null;
}

const TIER_NAMES: Record<string, string> = {
    '8bit': '8/16-bit',
    '32bit': 'PS1/N64',
    '2000s': 'PSP/DS',
    '6thgen': 'PS2/GameCube',
    'modern': 'Switch-class',
};

const BUDGET_CEILING: Record<string, string> = {
    'b_under_60': '$60',
    'b_60_120': '$120',
    'b_120_180': '$180',
    'b_180_300': '$300',
    'b_300_plus': 'unlimited credits',
};

// Profile flavor — opening fragments per persona.
const PROFILE_OPENER: Record<string, string> = {
    nostalgia: "The signal carries the old frequencies",
    completionist: "The codex reads complete",
    performance: "Maximum throughput, commander",
    onthego: "Travel-grade, carrier-bound",
    gift: "A worthy offering",
};

// Maps a sub-score against its max possible value (the Q1 weight).
const PROFILE_WEIGHTS_MAX: Record<string, Record<string, number>> = {
    nostalgia: { power: 20, portability: 20, ease: 25, value: 15, library: 20 },
    completionist: { power: 20, portability: 15, ease: 15, value: 20, library: 30 },
    performance: { power: 40, portability: 10, ease: 10, value: 15, library: 25 },
    onthego: { power: 15, portability: 40, ease: 15, value: 15, library: 15 },
    gift: { power: 15, portability: 15, ease: 40, value: 15, library: 15 },
    default: { power: 20, portability: 20, ease: 20, value: 20, library: 20 },
};

// Phrasing for the dominant dimension. Index = dimension; value = phrase.
const DIMENSION_PHRASE: Record<string, string> = {
    power: "raw throughput holds the tier covenant",
    library: "the catalog spans the eras you asked for",
    portability: "carry-grade — built for the routes you travel",
    ease: "plug it in, no rituals required",
    value: "stretches every credit the oracle allotted",
};

function getTopDimensions(breakdown: ScoreBreakdown, profile: string | null): string[] {
    const weights = PROFILE_WEIGHTS_MAX[profile?.toLowerCase() || 'default'] || PROFILE_WEIGHTS_MAX.default;
    const ratios: Array<[string, number]> = [
        ['power', weights.power > 0 ? breakdown.power / weights.power : 0],
        ['library', weights.library > 0 ? breakdown.library / weights.library : 0],
        ['portability', weights.portability > 0 ? breakdown.portability / weights.portability : 0],
        ['ease', weights.ease > 0 ? breakdown.ease / weights.ease : 0],
        ['value', weights.value > 0 ? breakdown.value / weights.value : 0],
    ];
    return ratios
        .filter(([, ratio]) => ratio >= 0.7)
        .sort((a, b) => b[1] - a[1])
        .map(([dim]) => dim);
}

export function generateMatchReason(
    pickType: PickType,
    breakdown: ScoreBreakdown,
    inputs: ReasonInputs,
    price: number | null,
): string {
    const tierLabel = inputs.targetTier ? TIER_NAMES[inputs.targetTier] : null;
    const budgetCeil = inputs.budgetBand ? BUDGET_CEILING[inputs.budgetBand] : null;
    const profile = inputs.profile?.toLowerCase() || 'default';

    if (pickType === 'best') {
        const opener = PROFILE_OPENER[profile] || "Coordinates locked";
        const tops = getTopDimensions(breakdown, inputs.profile);
        const dimPhrase = tops.length > 0
            ? DIMENSION_PHRASE[tops[0]]
            : "the star-charts ranked it first across every axis";
        const budgetTail = budgetCeil && price && budgetCeil !== 'unlimited credits'
            ? ` Holds inside ${budgetCeil}, no overage.`
            : '';
        const tierTail = tierLabel ? ` Clears the ${tierLabel} threshold.` : '';
        return `${opener} — ${dimPhrase}.${tierTail}${budgetTail}`;
    }

    if (pickType === 'perf') {
        const tierTail = tierLabel ? ` Tuned for the ${tierLabel} run.` : '';
        const budgetTail = budgetCeil && budgetCeil !== 'unlimited credits'
            ? ` The sharpest tier-fit your ${budgetCeil} budget can summon.`
            : ' The sharpest tier-fit on offer.';
        return `Maximum throughput, priest-confirmed.${tierTail}${budgetTail}`;
    }

    if (pickType === 'upgrade') {
        const tierTail = tierLabel
            ? ` The codex shows a full generation of headroom past ${tierLabel}.`
            : ' The codex shows a full generation of headroom your top pick cannot reach.';
        return `Cross the threshold. Fifty more credits buys real range —${tierTail}`;
    }

    // runner-up
    const tops = getTopDimensions(breakdown, inputs.profile);
    const dimPhrase = tops.length > 0
        ? `still strong on ${DIMENSION_PHRASE[tops[0]].replace(/^./, c => c.toLowerCase())}`
        : "still on-frequency";
    return `A worthy second prophecy — the star-charts favored your top pick by a narrow margin, but this rig is ${dimPhrase}.`;
}
