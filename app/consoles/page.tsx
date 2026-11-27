import { fetchVaultConsoles } from '../../app/actions';
import { siteConfig } from '../../config/site';
import { fetchConsoleAndVariantCounts } from '../../app/actions/consoles';
import BrowseView, { type BrowseDevice } from '../../components/browse-v2/BrowseView';
import type { ConsoleDetails } from '../../lib/types';

export async function generateMetadata() {
  // Use the anonymous client (via the shared action) so this page stays fully static.
  // Reading cookies here (server client) would silently force the whole route dynamic.
  const { consoles: consoleCount, variants: variantCount } = await fetchConsoleAndVariantCounts();

  const numConsoles = consoleCount || 64;
  const numVariants = variantCount || 133;

  return {
    title: 'Console Vault | All Retro Handhelds | The Retro Circuit',
    description: `Browse, filter, and sort every retro handheld console in the database. ${numConsoles} consoles, ${numVariants} hardware variants.`,
    alternates: { canonical: `${siteConfig.url}/consoles` },
  };
}


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

export default async function ConsoleVaultPage() {
  let allConsoles: any[] = [];

  try {
    allConsoles = await fetchVaultConsoles();
  } catch (error) {
    console.warn('Build Warning: Failed to fetch console vault data. Returning empty state.', error);
    // Fallback is empty arrays, allowing build to complete
  }

  return (
    <>
      <main className="bg-bg-primary min-h-screen text-text-primary font-sans">
        <BrowseView devices={(allConsoles as ConsoleDetails[]).filter((c) => c.slug).map(toDevice)} />
      </main>
    </>
  );
}
