/**
 * Must-have checks for the Finder, read from the real variant columns.
 *
 * The Finder used to read `specs.video_output`, `specs.bluetooth`, `specs.wifi` and
 * `specs.joysticks`, none of which exist. Every console failed every must-have, the
 * filter emptied the list, and the "relax if nothing is left" fallback silently threw
 * the user's must-haves away. A console now qualifies when any of its configurations
 * has the feature; an empty or "No" value counts as not having it.
 */

type Variant = Record<string, any>;

const NO = /^(no|none|n\/a|-|false)$/i;

function has(value: unknown): boolean {
    if (value == null) return false;
    if (typeof value === 'boolean') return value;
    const s = String(value).trim();
    return s.length > 0 && !NO.test(s);
}

function stickCount(v: Variant): number {
    const ip = Array.isArray(v.variant_input_profile) ? v.variant_input_profile[0] : v.variant_input_profile;
    return Number(ip?.stick_count ?? 0) || 0;
}

const CHECKS: Record<string, (v: Variant, c: { form_factor?: string | null; chassis_features?: string | null }) => boolean> = {
    hdmi: (v) => has(v.video_out),
    bluetooth: (v) => has(v.bluetooth_specs),
    wifi: (v) => has(v.wifi_specs) && !/dongle/i.test(String(v.wifi_specs)),
    dual_sticks: (v) => stickCount(v) >= 2,
    dual_screen: (v, c) => has(v.second_screen_size) || /dual[\s-]?screen/i.test(c.chassis_features ?? ''),
};

export function meetsMustHaves(
    consoleItem: { variants?: Variant[] | null; specs?: Variant | null; form_factor?: string | null; chassis_features?: string | null },
    features: string[],
): boolean {
    const variants = consoleItem.variants?.length ? consoleItem.variants : consoleItem.specs ? [consoleItem.specs] : [];
    return features.every((f) => {
        const check = CHECKS[f];
        if (!check) return true;
        return variants.some((v) => check(v, consoleItem));
    });
}

/** Devices you can actually buy new: not discontinued, not unreleased. */
export function isBuyable(consoleItem: { release_status?: string | null }): boolean {
    return consoleItem.release_status !== 'discontinued' && consoleItem.release_status !== 'upcoming';
}
