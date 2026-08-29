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
