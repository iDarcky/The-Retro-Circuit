import type { ConsoleDetails, ConsoleVariant } from '../../lib/types/domain';
import type { LandingDevice } from './types';

/** The variant a console should be represented by: its default, else its first. */
function pickVariant(console_: ConsoleDetails): Partial<ConsoleVariant> | undefined {
    const variants = console_.variants ?? [];
    return variants.find((v) => v.is_default) ?? variants[0];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(date?: string | null): string | null {
    if (!date) return null;
    const [year, month] = date.split('-');
    const index = Number(month) - 1;
    if (!year || Number.isNaN(index) || !MONTHS[index]) return null;
    return `${MONTHS[index]} ${year}`;
}

/* Up to four spec rows, in the order a buyer actually asks about them.
 *
 * Rows for missing columns are dropped rather than printed as "N/A": the catalogue is
 * uneven (battery and launch price are blank on plenty of variants) and a stage full
 * of N/A reads as a broken page, not as missing data.
 */
function buildSpecs(variant?: Partial<ConsoleVariant>): { label: string; value: string }[] {
    if (!variant) return [];

    const rows: { label: string; value: string }[] = [];

    const size = variant.screen_size_inch ? `${variant.screen_size_inch}"` : null;
    const panel = variant.display_type?.trim() || null;
    if (size || panel) {
        rows.push({ label: 'Screen', value: [size, panel].filter(Boolean).join(' ') });
    }

    const chip = [variant.soc_vendor, variant.soc_name].filter(Boolean).join(' ').trim();
    if (chip) rows.push({ label: 'Chip', value: chip });

    if (variant.ram_mb) {
        const gb = variant.ram_mb / 1024;
        rows.push({ label: 'Memory', value: `${Number.isInteger(gb) ? gb : gb.toFixed(1)} GB` });
    }

    if (variant.battery_capacity_mah) {
        rows.push({ label: 'Battery', value: `${variant.battery_capacity_mah.toLocaleString('en-US')} mAh` });
    }

    if (rows.length < 4 && variant.price_launch_usd) {
        rows.push({ label: 'Launch price', value: `$${variant.price_launch_usd}` });
    }

    if (rows.length < 4 && variant.weight_g) {
        rows.push({ label: 'Weight', value: `${variant.weight_g} g` });
    }

    return rows.slice(0, 4);
}

const STATUS_LABEL: Record<string, string> = {
    upcoming: 'Not out yet',
    announced: 'Announced',
    rumoured: 'Rumoured',
    discontinued: 'Discontinued',
};

export function toLandingDevice(console_: ConsoleDetails): LandingDevice {
    const variant = pickVariant(console_);
    const status = console_.release_status ? STATUS_LABEL[console_.release_status] ?? null : null;

    return {
        slug: console_.slug,
        name: console_.name,
        brand: console_.manufacturer?.name ?? 'Unknown',
        brandSlug: console_.manufacturer?.slug ?? '',
        imageUrl: console_.image_url ?? null,
        specs: buildSpecs(variant),
        released: formatMonth(variant?.release_date),
        status,
    };
}
