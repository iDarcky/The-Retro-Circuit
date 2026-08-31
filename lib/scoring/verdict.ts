import { SYSTEM_TIERS } from '../config/emulation';
import type { EmulationProfile } from '../types';

/* THE SHORT VERSION
 *
 *   [position] [form factor] that [top capability][, though weakness]
 *
 * Generated from rank, never written. It states a position in the catalogue and a
 * measured capability; it never expresses a preference, because opinionated copy has
 * to be human-written and 462 consoles is a year of it.
 *
 * The weakness clause is the part that earns trust. A line that only praises reads as
 * marketing; one that concedes something reads as a review. It is drawn from the same
 * grades as the praise, so it can never contradict them.
 *
 * Returns null when price or grades are missing: a half-built sentence is worse than
 * no sentence.
 *
 * NO EM DASHES. Enforced by noEmDash() below rather than left to the template, so a
 * later edit cannot quietly reintroduce one. Em and en dashes read as machine-written
 * and are the single clearest tell that a line was generated. */

/**
 * Strip em and en dashes from generated copy.
 *
 * " — x" and " – x" become ", x"; a bare dash between words becomes a comma. Runs on
 * every verdict, so the rule holds no matter how the template is edited later.
 */
export function noEmDash(text: string): string {
    return text
        .replace(/\s*[—–]\s*/g, ', ')
        .replace(/,\s*,/g, ',')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Strongest true claim about where the price sits, cheapest first. */
function positionPhrase(pricePercentile: number | null, rankable: boolean): string | null {
    if (!rankable || pricePercentile === null) return null;
    // pricePercentile is "share of the tier priced below this one", so low = cheap.
    if (pricePercentile <= 0.02) return 'The cheapest device in the catalogue';
    if (pricePercentile <= 0.10) return 'One of the cheapest devices';
    if (pricePercentile <= 0.25) return 'One of the more affordable devices';
    if (pricePercentile <= 0.60) return 'A mid-priced device';
    if (pricePercentile <= 0.85) return 'A premium device';
    return 'One of the most expensive devices';
}

/** Two highest-tier systems running Playable or better. */
function topCapability(profile: EmulationProfile): string[] {
    const out: string[] = [];
    for (let i = SYSTEM_TIERS.length - 1; i >= 0 && out.length < 2; i--) {
        for (const sys of SYSTEM_TIERS[i].systems) {
            const g = String((profile as any)[sys.key] ?? '');
            if (g === 'Playable' || g === 'Great' || g === 'Perfect') {
                out.push(sys.label);
                if (out.length === 2) break;
            }
        }
    }
    return out;
}

/**
 * The most notable thing it cannot do: the highest-tier system graded Struggles.
 * Deliberately not Unplayable: nobody expects a cheap handheld to run Switch, so calling
 * that out is noise. A system that *almost* works is the useful warning.
 */
function notableWeakness(profile: EmulationProfile, reach: number): string | null {
    for (let i = Math.min(reach, SYSTEM_TIERS.length) - 1; i >= 0; i--) {
        for (const sys of SYSTEM_TIERS[i].systems) {
            if (String((profile as any)[sys.key] ?? '') === 'Struggles') return sys.label;
        }
    }
    return null;
}

const FORM_NOUN: Record<string, string> = {
    horizontal: 'horizontal handhelds',
    vertical: 'verticals',
    clamshell: 'clamshells',
};

export function buildVerdict(opts: {
    profile?: EmulationProfile | null;
    reach: number | null;
    formFactor?: string | null;
    pricePercentile: number | null;
    tierSize: number;
    rankable: boolean;
}): string | null {
    const { profile, reach, formFactor, pricePercentile, rankable } = opts;
    if (!profile || reach === null) return null;

    const position = positionPhrase(pricePercentile, rankable);
    if (!position) return null;

    const caps = topCapability(profile);
    if (caps.length === 0) return null;

    const form = FORM_NOUN[String(formFactor ?? '').toLowerCase()];
    const subject = form ? `${position.replace(/ devices?$/, '')} ${form}` : position;

    const runs = caps.length === 2 ? `${caps[0]} and ${caps[1]}` : caps[0];
    const weakness = notableWeakness(profile, reach);

    return noEmDash(
        `${subject} that runs ${runs} playably${weakness ? `, though ${weakness} struggles` : ''}.`,
    );
}

/* THE SPEC SUMMARY
 *
 * 60 to 90 words of plain description, assembled from columns. This exists because 328
 * drafts are fully specced and emulation-graded but have no description, and a page with
 * no unique text is a weak search result no matter how good the data underneath is.
 *
 * It states only what the database records. No judgement, no recommendation, no adjectives
 * that are not measurements, because opinionated copy has to be human-written. Treat the
 * output as a first draft to edit, not a finished review.
 *
 * Returns null rather than a stub when there is too little to say.
 */

export interface SummaryInput {
    name: string;
    brand?: string | null;
    deviceCategory?: string | null;
    formFactor?: string | null;
    releaseYear?: string | null;
    socName?: string | null;
    socVendor?: string | null;
    cpuClusters?: { count?: number | null; core?: string | null; clock_mhz?: number | null }[] | null;
    ramMb?: number | null;
    screenInch?: number | null;
    screenResX?: number | null;
    screenResY?: number | null;
    batteryMah?: number | null;
    batteryWh?: number | null;
    osFamily?: string | null;
    priceLow?: number | null;
    priceHigh?: number | null;
    variantCount?: number;
    profile?: EmulationProfile | null;
}

const CATEGORY_NOUN: Record<string, string> = {
    emulation: 'emulation handheld',
    pc_gaming: 'PC gaming handheld',
    fpga: 'FPGA handheld',
    legacy: 'handheld console',
};

/** "8 cores at up to 2.8 GHz" from the cluster rows. */
function corePhrase(clusters?: SummaryInput['cpuClusters']): string | null {
    if (!clusters || clusters.length === 0) return null;
    const total = clusters.reduce((n, c) => n + (Number(c?.count) || 0), 0);
    if (total <= 0) return null;
    const top = Math.max(...clusters.map(c => Number(c?.clock_mhz) || 0));
    const clock = top >= 1000 ? `${(top / 1000).toFixed(2).replace(/\.?0+$/, '')} GHz` : top > 0 ? `${top} MHz` : null;
    return clock ? `${total} cores at up to ${clock}` : `${total} cores`;
}

/** Every system it runs playably, highest tier first, capped so the sentence stays readable. */
function playableSystems(profile: EmulationProfile, limit: number): string[] {
    const out: string[] = [];
    for (let i = SYSTEM_TIERS.length - 1; i >= 0 && out.length < limit; i--) {
        for (const sys of SYSTEM_TIERS[i].systems) {
            const g = String((profile as any)[sys.key] ?? '');
            if (g === 'Playable' || g === 'Great' || g === 'Perfect') {
                out.push(sys.label);
                if (out.length === limit) break;
            }
        }
    }
    return out;
}

/**
 * "a AMD Van Gogh" and "a 8 inch display" are the tells that a sentence was assembled
 * rather than written. Numerals go by how they are said, not how they are spelt: 8, 11
 * and 18 take "an", every other leading digit takes "a".
 */
const article = (word: string): string => {
    const w = word.trim();
    if (/^(8|11|18)(\D|$)/.test(w)) return 'an';
    if (/^\d/.test(w)) return 'a';
    return /^[aeiou]/i.test(w) ? 'an' : 'a';
};

const list = (items: string[]): string =>
    items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export function buildSummary(o: SummaryInput): string | null {
    const sentences: string[] = [];
    const full = o.brand ? `${o.brand} ${o.name}` : o.name;
    const noun = CATEGORY_NOUN[String(o.deviceCategory ?? '').toLowerCase()] || 'handheld';

    // 1. What it is.
    const form = String(o.formFactor ?? '').toLowerCase();
    const opening = [
        `The ${full} is a`,
        o.releaseYear ? `${o.releaseYear}` : null,
        form && form !== 'unknown' ? form : null,
        noun,
    ].filter(Boolean).join(' ');
    const os = o.osFamily ? ` running ${o.osFamily === 'steamos' ? 'SteamOS' : o.osFamily.charAt(0).toUpperCase() + o.osFamily.slice(1)}` : '';
    sentences.push(`${opening}${os}.`);

    // 2. The hardware.
    const hw: string[] = [];
    const chip = [o.socVendor, o.socName].filter(Boolean).join(' ');
    if (chip) hw.push(`${article(chip)} ${chip}`);
    const cores = corePhrase(o.cpuClusters);
    if (cores) hw.push(cores);
    if (o.ramMb && o.ramMb > 0) {
        hw.push(o.ramMb >= 1024 ? `${Math.round(o.ramMb / 1024)} GB of RAM` : `${o.ramMb} MB of RAM`);
    }
    const hasSilicon = Boolean(chip) || Boolean(cores);
    if (hw.length > 0 && hasSilicon) sentences.push(`It is built around ${list(hw)}.`);

    // 3. Screen and battery.
    const body: string[] = [];
    if (o.screenInch) {
        const res = o.screenResX && o.screenResY ? ` ${o.screenResX} by ${o.screenResY}` : '';
        body.push(`${article(String(o.screenInch))} ${o.screenInch} inch${res} display`);
    }
    if (o.batteryWh) body.push(`a ${o.batteryWh} Wh battery`);
    else if (o.batteryMah) body.push(`a ${o.batteryMah} mAh battery`);
    // Without silicon to lead on, the RAM joins the screen and battery in one clause.
    const rest = hasSilicon ? body : [...hw, ...body];
    if (rest.length > 0) sentences.push(`It has ${list(rest)}.`);

    // 4. What it actually plays. The reason anyone reads the page.
    if (o.profile) {
        const runs = playableSystems(o.profile, 4);
        const weak = notableWeakness(o.profile, SYSTEM_TIERS.length);
        if (runs.length > 0) {
            sentences.push(
                `In testing it runs ${list(runs)} at playable speeds${weak ? `, while ${weak} struggles` : ''}.`,
            );
        }
    }

    // 5. What it costs, and how many ways you can buy it.
    if (o.priceLow && o.priceLow > 0) {
        const spread = o.priceHigh && o.priceHigh > o.priceLow;
        const configs = (o.variantCount ?? 0) > 1 ? ` across ${o.variantCount} configurations` : '';
        sentences.push(
            spread
                ? `Prices run from $${o.priceLow} to $${o.priceHigh}${configs}.`
                : `It launched at $${o.priceLow}${configs}.`,
        );
    }

    // A page needs more than a name and a price to be worth indexing.
    if (sentences.length < 3) return null;

    return noEmDash(sentences.join(' '));
}

/* TAGS
 *
 * Six, priority-ordered, dropped from the bottom when the data is missing. Four was too
 * few to characterise a device and eight crowded the title. Form factor is in the set
 * because 457 of 462 consoles have it and nothing else on the page states it. */

export interface Tag { label: string; tone: 'violet' | 'cyan' | 'orange' | 'emerald' | 'plain'; dot?: boolean }

export function buildTags(opts: {
    deviceCategory?: string | null;
    formFactor?: string | null;
    screenInch?: number | null;
    screenResY?: number | null;
    osFamily?: string | null;
    osVersion?: string | null;
    osText?: string | null;
    releaseDate?: string | null;
    weightG?: number | null;
}): Tag[] {
    const tags: Tag[] = [];

    if (opts.deviceCategory) {
        tags.push({ label: String(opts.deviceCategory).replace(/_/g, ' '), tone: 'violet', dot: true });
    }
    if (opts.formFactor) {
        tags.push({ label: opts.formFactor, tone: 'emerald' });
    }
    const screen = [
        opts.screenInch ? `${opts.screenInch}"` : null,
        opts.screenResY ? `${opts.screenResY}p` : null,
    ].filter(Boolean).join(' · ');
    if (screen) tags.push({ label: screen, tone: 'orange' });

    const os = [opts.osFamily, opts.osVersion].filter(Boolean).join(' ') || opts.osText;
    if (os) tags.push({ label: os, tone: 'cyan' });

    if (opts.releaseDate) {
        const year = opts.releaseDate.slice(0, 4);
        // "New" expires. A 2024 device is not news in 2026, it is just a 2024 device.
        const monthsOld = (Date.now() - new Date(opts.releaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
        const fresh = Number.isFinite(monthsOld) && monthsOld >= 0 && monthsOld <= 12;
        tags.push({ label: fresh ? `New · ${year}` : year, tone: fresh ? 'cyan' : 'plain', dot: fresh });
    }
    if (opts.weightG) tags.push({ label: `${Math.round(opts.weightG)} g`, tone: 'plain' });

    return tags.slice(0, 6);
}
