import { fetchPublicManufacturers, fetchVaultConsoles } from '../../app/actions';
import { fetchConsoleAndVariantCounts } from '../../app/actions/consoles';
import ConsoleVaultClient from '../../components/console/ConsoleVaultClient';

export async function generateMetadata() {
  // Use the anonymous client (via the shared action) so this page stays fully static.
  // Reading cookies here (server client) would silently force the whole route dynamic.
  const { consoles: consoleCount, variants: variantCount } = await fetchConsoleAndVariantCounts();

  const numConsoles = consoleCount || 64;
  const numVariants = variantCount || 133;

  return {
    title: 'Console Vault | All Retro Handhelds | The Retro Circuit',
    description: `Browse, filter, and sort every retro handheld console in the database. ${numConsoles} consoles, ${numVariants} hardware variants.`,
    alternates: { canonical: "https://theretrocircuit.com/consoles" },
  };
}


export const revalidate = false;

export default async function ConsoleVaultPage() {
  let manufacturers: any[] = [];
  let allConsoles: any[] = [];

  try {
    [manufacturers, allConsoles] = await Promise.all([
      fetchPublicManufacturers(),
      fetchVaultConsoles()
    ]);
  } catch (error) {
    console.warn('Build Warning: Failed to fetch console vault data. Returning empty state.', error);
    // Fallback is empty arrays, allowing build to complete
  }

  return <ConsoleVaultClient initialManufacturers={manufacturers} initialConsoles={allConsoles} />;
}
