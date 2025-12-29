import { fetchManufacturers, fetchAllConsoles } from '../../lib/api';
import ConsoleVaultClient from '../../components/console/ConsoleVaultClient';

export const revalidate = 60;

export const metadata = {
  title: 'Console Vault | The Retro Circuit',
  description: 'The ultimate database of retro and modern handheld gaming hardware. Compare specs, prices, and performance.',
};

export default async function ConsoleVaultPage() {
  let manufacturers: any[] = [];
  let allConsoles: any[] = [];

  try {
      [manufacturers, allConsoles] = await Promise.all([
          fetchManufacturers(),
          fetchAllConsoles()
      ]);
  } catch (error) {
      console.warn('Build Warning: Failed to fetch console vault data. Returning empty state.', error);
      // Fallback is empty arrays, allowing build to complete
  }

  return <ConsoleVaultClient initialManufacturers={manufacturers} initialConsoles={allConsoles} />;
}
