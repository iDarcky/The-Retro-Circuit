
// Emulation Tier Definitions and Scoring Logic

// Map score to numeric value for averaging
export const SCORE_MAP: Record<string, number> = {
    'Perfect': 5,
    'Great': 4,
    'Playable': 3,
    'Struggles': 2,
    'Unplayable': 1,
    'N/A': 0
};

// Map numeric average back to text badge
export const getAverageBadge = (avg: number) => {
    if (avg >= 4.5) return { label: 'PERFECT', color: 'text-green-400 border-green-500' };
    if (avg >= 3.5) return { label: 'GREAT', color: 'text-blue-400 border-blue-500' };
    if (avg >= 2.5) return { label: 'PLAYABLE', color: 'text-yellow-400 border-yellow-500' };
    if (avg >= 1.5) return { label: 'STRUGGLES', color: 'text-orange-400 border-orange-500' };
    if (avg > 0) return { label: 'UNPLAYABLE', color: 'text-red-400 border-red-500' };
    return { label: 'UNTESTED', color: 'text-gray-500 border-gray-700' };
};

export const SYSTEM_TIERS = [
    {
        title: 'TIER 1: CLASSIC 2D',
        shortLabel: 'TIER 1',
        systems: [
            { key: 'nes_state', label: 'NES' },
            { key: 'snes_state', label: 'SNES' },
            { key: 'master_system', label: 'Master System' },
            { key: 'genesis_state', label: 'Genesis' },
            { key: 'gb_state', label: 'Game Boy' },
            { key: 'gbc_state', label: 'GB Color' },
            { key: 'gba_state', label: 'GBA' },
        ]
    },
    {
        title: 'TIER 2: EARLY 3D',
        shortLabel: 'TIER 2',
        systems: [
            { key: 'ps1_state', label: 'PlayStation' },
            { key: 'n64_state', label: 'N64' },
            { key: 'saturn_state', label: 'Saturn' },
            { key: 'nds_state', label: 'Nintendo DS' },
            { key: 'dreamcast_state', label: 'Dreamcast' }
        ]
    },
    {
        title: 'TIER 3: ADVANCED HANDHELDS',
        shortLabel: 'TIER 3',
        systems: [
            { key: 'psp_state', label: 'PSP' },
            { key: 'x3ds_state', label: '3DS' },
            { key: 'vita_state', label: 'PS Vita' },
        ]
    },
    {
        title: 'TIER 4: CLASSIC HOME',
        shortLabel: 'TIER 4',
        systems: [
            { key: 'ps2_state', label: 'PS2' },
            { key: 'gamecube_state', label: 'GameCube' },
            { key: 'xbox', label: 'Xbox' },
        ]
    },
    {
        title: 'TIER 5: MODERN & HD',
        shortLabel: 'TIER 5',
        systems: [
            { key: 'wii_state', label: 'Wii' },
            { key: 'wii_u', label: 'Wii U' },
            { key: 'ps3_state', label: 'PS3' },
            { key: 'xbox_360', label: 'Xbox 360' },
            { key: 'switch_state', label: 'Switch' },
        ]
    }
];
