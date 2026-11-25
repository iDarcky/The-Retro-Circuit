/* Plain data shapes and constants shared by the homepage's server loader and its client
 * widgets. No imports, so the client bundles stay small. */

export const SYSTEMS = [
    { key: 'gba', label: 'Game Boy Advance' },
    { key: 'ps1', label: 'PlayStation' },
    { key: 'n64', label: 'N64' },
    { key: 'nds', label: 'Nintendo DS' },
    { key: 'dreamcast', label: 'Dreamcast' },
    { key: 'psp', label: 'PSP' },
    { key: 'ps2', label: 'PS2' },
    { key: 'gamecube', label: 'GameCube' },
    { key: 'switch', label: 'Switch' },
] as const;
export type SystemKey = (typeof SYSTEMS)[number]['key'];

/** Emulation ratings, indexed 0 (unrated) to 4 (perfect). */
export const RATING = ['Not rated', 'Struggles', 'Playable', 'Great', 'Perfect'];

export interface HomeDevice {
    slug: string;
    /** Brand plus model, e.g. "Retroid Pocket 6", unless the name already starts with the brand. */
    label: string;
    image: string | null;
    price: number | null;
    screenIn: number | null;
    chip: string | null;
    ramGb: number | null;
    batteryMah: number | null;
    weightG: number | null;
    /** Best rating across a console's variants, 0 to 4. */
    emu: Record<SystemKey, number>;
}

export interface HomePair {
    href: string;
    a: HomeDevice;
    b: HomeDevice;
}

export interface HomeGuide {
    href: string;
    label: string;
    title: string;
}

export interface HomeData {
    count: number;
    minPrice: number | null;
    newest: HomeDevice[];
    all: HomeDevice[];
    pairs: HomePair[];
    guides: HomeGuide[];
}
