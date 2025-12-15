import ConsoleVaultClient from '../../components/console/ConsoleVaultClient';
import { fetchManufacturers, fetchAllConsoles } from '../../lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Console Vault | The Retro Circuit',
  description: 'The ultimate database of retro and modern handheld gaming hardware. Compare specs, prices, and performance.',
};

export default async function ConsoleVaultPage() {
  const [manufacturers, allConsoles] = await Promise.all([
    fetchManufacturers(),
    fetchAllConsoles()
  ]);

  return <ConsoleVaultClient initialManufacturers={manufacturers} initialConsoles={allConsoles} />;
}
