/* What the comparison page shows, worked out from two variants.
 *
 * Pure functions, no React: the page draws whatever these return. Values are cleaned for
 * reading here (imported rows carry `usb_c`, `hall`, `false` in text columns), so the
 * page never prints a raw database value. */

import { SYSTEM_TIERS } from '../config/emulation';

type V = Record<string, any>;

export const STATE_RANK: Record<string, number> = { Perfect: 4, Great: 3, Playable: 2, Struggles: 1, Unplayable: 0 };
export const RATING_LABEL = ['Unplayable', 'Struggles', 'Playable', 'Great', 'Perfect'];

export type Better = 'higher' | 'lower' | null;

export interface SpecRow {
    label: string;
    a: string | null;
    b: string | null;
    /** Which side has the better value, when the row has a direction and both are known. */
    win: 'a' | 'b' | null;
}

export interface SpecGroup {
    title: string;
    rows: SpecRow[];
}

export interface EmuRow {
    label: string;
    a: number | null;
    b: number | null;
    win: 'a' | 'b' | null;
}

/* ---------- reading values ---------- */

const num = (v: unknown): number | null => {
    const n = typeof v === 'string' ? parseFloat(v) : v;
    return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : null;
};

const NICE: Record<string, string> = {
    usb_c: 'USB-C', usbc: 'USB-C', hall: 'Hall effect', tmr: 'TMR', alps: 'ALPS', potentiometer: 'Potentiometer',
    analog: 'Analog', digital: 'Digital', cross: 'Cross', disc: 'Disc', microsd: 'microSD', sd: 'SD',
    active: 'Fan', passive: 'Passive', asymmetric: 'Offset', symmetric: 'Side by side', ips: 'IPS', oled: 'OLED',
    amoled: 'AMOLED', lcd: 'LCD', aluminium: 'Aluminium', plastic: 'Plastic', stereo: 'Stereo', mono: 'Mono',
};

/** A text value as a person would write it, or null for empty / placeholder values. */
export function text(v: unknown): string | null {
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    if (!s || /^(false|null|none|n\/a|unknown|-+)$/i.test(s)) return null;
    const nice = NICE[s.toLowerCase()];
    if (nice) return nice;
    // snake_case and all-lowercase single words read as raw data
    const spaced = s.replace(/_/g, ' ');
    return spaced === spaced.toLowerCase() ? spaced[0].toUpperCase() + spaced.slice(1) : spaced;
}

const yesNo = (v: unknown): string | null => (v === true ? 'Yes' : v === false ? 'No' : null);

const fmt = (n: number, unit = '') => `${Number.isInteger(n) ? n : Math.round(n * 10) / 10}${unit}`;

export function chipOf(v: V): string | null {
    return text(v.soc_name) ?? text(v.soc) ?? text(v.cpu_model);
}

export function ramGb(v: V): number | null {
    const mb = num(v.ram_mb);
    return mb ? Math.round((mb / 1024) * 10) / 10 : null;
}

export function priceOf(v: V): number | null {
    const p = num(v.price_launch_usd);
    // No handheld launches under $20: a smaller number is a data-entry slip.
    return p && p >= 20 ? Math.round(p) : null;
}

function osOf(v: V): string | null {
    const fam = text(v.os_family);
    if (fam && v.os_version) return `${fam} ${v.os_version}`;
    return text(v.os) ?? fam;
}

/* ---------- rows ---------- */

type Def = {
    label: string;
    get: (v: V) => { show: string | null; n?: number | null };
    better?: Better;
};

const n = (key: string, unit = '', better: Better = 'higher') => ({
    get: (v: V) => {
        const x = num(v[key]);
        return { show: x ? fmt(x, unit) : null, n: x };
    },
    better,
});
const t = (get: (v: V) => unknown) => ({ get: (v: V) => ({ show: text(get(v)) }) });
const b = (get: (v: V) => unknown) => ({ get: (v: V) => ({ show: yesNo(get(v)) }) });
const ip = (v: V) => v.variant_input_profile || {};

const GROUPS: { title: string; defs: Def[] }[] = [
    {
        title: 'Screen',
        defs: [
            { label: 'Size', ...n('screen_size_inch', '"') },
            {
                label: 'Resolution',
                get: (v) => {
                    const x = num(v.screen_resolution_x), y = num(v.screen_resolution_y);
                    return { show: x && y ? `${x} × ${y}` : null, n: x && y ? x * y : null };
                },
                better: 'higher',
            },
            { label: 'Panel', ...t((v) => v.display_type) },
            { label: 'Refresh rate', ...n('refresh_rate_hz', ' Hz') },
            { label: 'Pixel density', ...n('ppi', ' ppi') },
            { label: 'Brightness', ...n('brightness_nits', ' nits') },
            { label: 'Aspect ratio', ...t((v) => v.aspect_ratio) },
            { label: 'Touchscreen', ...b((v) => v.touchscreen) },
            { label: 'Second screen', ...n('second_screen_size', '"') },
        ],
    },
    {
        title: 'Performance',
        defs: [
            { label: 'Chip', get: (v) => ({ show: chipOf(v) }) },
            { label: 'CPU cores', ...n('cpu_cores', '', null) },
            { label: 'CPU max clock', ...n('cpu_clock_max_mhz', ' MHz') },
            { label: 'Graphics', ...t((v) => v.gpu_name ?? v.gpu_model) },
            { label: 'GPU clock', ...n('gpu_clock_mhz', ' MHz') },
            { label: 'Software', get: (v) => ({ show: osOf(v) }) },
        ],
    },
    {
        title: 'Memory and storage',
        defs: [
            { label: 'RAM', get: (v) => { const g = ramGb(v); return { show: g ? `${g} GB` : null, n: g }; }, better: 'higher' },
            { label: 'RAM type', ...t((v) => v.ram_type) },
            { label: 'Storage', ...n('storage_gb', ' GB') },
            { label: 'Storage type', ...t((v) => v.storage_type) },
            { label: 'Card slot', get: (v) => ({ show: text(v.expansion_card_type) ?? yesNo(v.storage_expandable) }) },
        ],
    },
    {
        title: 'Battery',
        defs: [
            { label: 'Capacity', ...n('battery_capacity_mah', ' mAh') },
            { label: 'Energy', ...n('battery_capacity_wh', ' Wh') },
            { label: 'Charging', ...n('charging_speed_w', ' W') },
        ],
    },
    {
        title: 'Controls',
        defs: [
            { label: 'D-pad', ...t((v) => ip(v).dpad_shape) },
            { label: 'Sticks', ...t((v) => ip(v).stick_tech) },
            { label: 'Stick layout', ...t((v) => ip(v).stick_layout) },
            { label: 'Triggers', ...t((v) => ip(v).trigger_type) },
            { label: 'Back buttons', get: (v) => { const x = num(ip(v).back_button_count); return { show: x ? String(x) : (ip(v).back_button_count === 0 ? 'None' : null), n: x ?? 0 }; }, better: 'higher' },
            { label: 'Gyro', ...b((v) => ip(v).has_gyro) },
            { label: 'Rumble', ...b((v) => ip(v).has_rumble) },
        ],
    },
    {
        title: 'Connections',
        defs: [
            { label: 'Wi-Fi', get: (v) => { const s = text(v.wifi_specs); return { show: s && /^\d/.test(s) ? `Wi-Fi ${s}` : s }; } },
            { label: 'Bluetooth', ...t((v) => v.bluetooth_specs) },
            { label: 'Video out', ...t((v) => v.video_out) },
            { label: 'Headphone jack', ...b((v) => v.has_headphone_jack) },
            { label: 'Charge port', ...t((v) => v.charge_port) },
        ],
    },
    {
        title: 'Size and build',
        defs: [
            { label: 'Weight', ...n('weight_g', ' g', 'lower') },
            {
                label: 'Dimensions',
                get: (v) => {
                    const w = num(v.width_mm), h = num(v.height_mm), d = num(v.depth_mm);
                    return { show: w && h && d ? `${fmt(w)} × ${fmt(h)} × ${fmt(d)} mm` : null };
                },
            },
            { label: 'Thickness', ...n('depth_mm', ' mm', 'lower') },
            { label: 'Body', ...t((v) => v.body_material) },
            { label: 'Cooling', ...t((v) => v.cooling_type) },
            { label: 'Colours', ...t((v) => v.available_colors) },
        ],
    },
];

function row(def: Def, a: V, b: V): SpecRow {
    const ra = def.get(a), rb = def.get(b);
    let win: SpecRow['win'] = null;
    if (def.better && ra.n && rb.n && ra.n !== rb.n) {
        const aBetter = def.better === 'higher' ? ra.n > rb.n : ra.n < rb.n;
        win = aBetter ? 'a' : 'b';
    }
    return { label: def.label, a: ra.show, b: rb.show, win };
}

/** Every spec, grouped, skipping rows neither side has. */
export function specGroups(a: V, b: V): SpecGroup[] {
    return GROUPS.map((g) => ({
        title: g.title,
        rows: g.defs.map((d) => row(d, a, b)).filter((r) => r.a || r.b),
    })).filter((g) => g.rows.length > 0);
}

const KEY_LABELS = ['Size', 'Refresh rate', 'Chip', 'RAM', 'Storage', 'Capacity', 'Weight'];

/** The short table at the top of the page. */
export function keySpecs(a: V, b: V): SpecRow[] {
    const all = new Map(GROUPS.flatMap((g) => g.defs).map((d) => [d.label, d]));
    const price: SpecRow = (() => {
        const pa = priceOf(a), pb = priceOf(b);
        return {
            label: 'Launch price',
            a: pa ? `$${pa}` : null,
            b: pb ? `$${pb}` : null,
            win: pa && pb && pa !== pb ? (pa < pb ? 'a' : 'b') : null,
        };
    })();
    const rename: Record<string, string> = { Size: 'Screen', Capacity: 'Battery' };
    return [
        price,
        ...KEY_LABELS.map((l) => ({ ...row(all.get(l)!, a, b), label: rename[l] ?? l })),
    ];
}

/* ---------- emulation ---------- */

/** Systems either device has a rating for, oldest first. */
export function emulationRows(a: V, b: V): EmuRow[] {
    const pa = a.emulation_profile || {}, pb = b.emulation_profile || {};
    const systems: { key: string; label: string }[] = SYSTEM_TIERS.flatMap((tier) => [...tier.systems] as { key: string; label: string }[]);
    return systems
        .map(({ key, label }): EmuRow => {
            const ra = STATE_RANK[pa[key]] ?? null, rb = STATE_RANK[pb[key]] ?? null;
            const win: EmuRow['win'] = ra !== null && rb !== null && ra !== rb ? (ra > rb ? 'a' : 'b') : null;
            return { label, a: ra, b: rb, win };
        })
        .filter((r) => r.a !== null || r.b !== null);
}

/* ---------- where each one wins ---------- */

const pct = (x: number, y: number) => Math.round(((x - y) / y) * 100);

/** Plain, spec-derived reasons to pick each side. Facts only: no opinion. */
export function reasons(a: V, b: V): { a: string[]; b: string[] } {
    const out = { a: [] as string[], b: [] as string[] };
    const side = (aWins: boolean) => (aWins ? out.a : out.b);

    const pa = priceOf(a), pb = priceOf(b);
    if (pa && pb && Math.abs(pa - pb) >= 10) side(pa < pb).push(`Costs $${Math.abs(pa - pb)} less at launch`);

    const sa = num(a.screen_size_inch), sb = num(b.screen_size_inch);
    if (sa && sb && Math.abs(sa - sb) >= 0.2) side(sa > sb).push(`Bigger screen (${fmt(Math.max(sa, sb))}" vs ${fmt(Math.min(sa, sb))}")`);

    const ha = num(a.refresh_rate_hz), hb = num(b.refresh_rate_hz);
    if (ha && hb && ha !== hb) side(ha > hb).push(`${Math.max(ha, hb)} Hz screen, against ${Math.min(ha, hb)} Hz`);

    const ba = num(a.battery_capacity_mah), bb = num(b.battery_capacity_mah);
    if (ba && bb && Math.abs(pct(ba, bb)) >= 10) {
        const aWins = ba > bb;
        side(aWins).push(`${aWins ? pct(ba, bb) : pct(bb, ba)}% more battery`);
    }

    const wa = num(a.weight_g), wb = num(b.weight_g);
    if (wa && wb && Math.abs(wa - wb) >= 15) side(wa < wb).push(`${Math.round(Math.abs(wa - wb))} g lighter`);

    const ra = ramGb(a), rb = ramGb(b);
    if (ra && rb && ra !== rb) side(ra > rb).push(`More memory (${Math.max(ra, rb)} GB vs ${Math.min(ra, rb)} GB)`);

    // The newest system where the two differ is the one that matters most.
    const emu = emulationRows(a, b).filter((r) => r.win && r.a !== null && r.b !== null);
    const top = emu[emu.length - 1];
    if (top) {
        const aWins = top.win === 'a';
        const hi = RATING_LABEL[Math.max(top.a!, top.b!)].toLowerCase(), lo = RATING_LABEL[Math.min(top.a!, top.b!)].toLowerCase();
        side(aWins).push(`Runs ${top.label} better (${hi}, against ${lo})`);
    }

    return out;
}
