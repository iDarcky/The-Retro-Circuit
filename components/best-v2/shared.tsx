import type { ConsoleDetails } from '../../lib/types';

/* Bits shared by the redesigned guide index and guide pages (server components). */

export const DOT_GRID: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.2px)',
    backgroundSize: '14px 14px',
};

/** Each guide gets one of the four face-button colours, in order. */
export const GUIDE_COLORS = [
    { bg: 'bg-violet-600', text: 'text-violet-400', chip: 'bg-violet-500' },
    { bg: 'bg-cyan-600', text: 'text-cyan-400', chip: 'bg-cyan-500' },
    { bg: 'bg-rose-600', text: 'text-rose-400', chip: 'bg-rose-500' },
    { bg: 'bg-orange-600', text: 'text-orange-400', chip: 'bg-orange-500' },
];

/** The system a guide is about, so its rating can be highlighted on every pick. */
export const GUIDE_SYSTEM: Record<string, string> = {
    'best-handhelds-for-ps2-emulation': 'ps2_state',
    'best-handhelds-for-gamecube-emulation': 'gamecube_state',
    'best-handhelds-for-psp-emulation': 'psp_state',
};

export const SYSTEMS = [
    { key: 'ps1_state', label: 'PS1' },
    { key: 'psp_state', label: 'PSP' },
    { key: 'nds_state', label: 'DS' },
    { key: 'ps2_state', label: 'PS2' },
    { key: 'gamecube_state', label: 'GameCube' },
];

const RANK: Record<string, number> = { Perfect: 4, Great: 3, Playable: 2, Struggles: 1, Unplayable: 0 };

export function emuState(c: ConsoleDetails, key: string): string | null {
    let best: string | null = null;
    for (const v of ((c as any).variants || []) as any[]) {
        const p = v.emulation_profile || v.emulation_profiles;
        const prof = Array.isArray(p) ? p[0] : p;
        const s = prof?.[key];
        if (s && (best === null || (RANK[s] ?? -1) > (RANK[best] ?? -1))) best = s;
    }
    return best;
}

export const STATE_COLOR: Record<string, string> = {
    Perfect: 'text-cyan-300',
    Great: 'text-cyan-400',
    Playable: 'text-white',
    Struggles: 'text-orange-400',
    Unplayable: 'text-rose-400',
};

export function priceOf(c: ConsoleDetails): number | null {
    const p = Number((c as any).specs?.price_launch_usd);
    return p > 0 ? Math.round(p) : null;
}
