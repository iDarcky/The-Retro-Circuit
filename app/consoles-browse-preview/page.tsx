import type { Metadata } from 'next';
import { fetchVaultConsoles } from '../actions';
import { fetchConsoleAndVariantCounts } from '../actions/consoles';
import BrowseView, { type BrowseDevice } from '../../components/browse-v2/BrowseView';
import ConsoleLinkIndex from '../../components/console/ConsoleLinkIndex';
import type { ConsoleDetails } from '../../lib/types';

// Beta mockup of the redesigned catalogue. Served on /consoles in the beta branch through a rewrite.
export const metadata: Metadata = {
    title: { absolute: 'Every Retro Handheld, Compared | The Retro Circuit' },
    robots: { index: false, follow: false },
};

export const revalidate = false;

function toDevice(c: ConsoleDetails): BrowseDevice {
    const s: any = c.specs || {};
    const price = Number(s.price_launch_usd || s.price_avg_usd) || null;
    const released = s.release_date ? new Date(s.release_date).getTime() : undefined;
    return {
        slug: c.slug,
        name: c.name,
        brand: c.manufacturer?.name ?? null,
        image: c.image_url ?? null,
        shape: c.form_factor ?? null,
        price: price && price >= 20 ? Math.round(price) : null,
        chip: s.soc_name ?? null,
        screen: s.screen_size_inch ?? null,
        os: s.os_family ?? null,
        year: s.release_date ? String(s.release_date).slice(0, 4) : null,
        released: Number.isFinite(released) ? released : undefined,
    };
}

export default async function BrowsePreviewPage() {
    let consoles: ConsoleDetails[] = [];
    let variants = 0;
    try {
        const [list, counts] = await Promise.all([fetchVaultConsoles(), fetchConsoleAndVariantCounts()]);
        consoles = list;
        variants = counts.variants || 0;
    } catch (e) {
        console.warn('Build Warning: browse preview data failed', e);
    }
    const devices = consoles.filter((c) => c.slug).map(toDevice);
    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans">
            <BrowseView devices={devices} variantCount={variants} />
            <ConsoleLinkIndex consoles={consoles} />
        </main>
    );
}
