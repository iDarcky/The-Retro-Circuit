import ConsoleVaultClient from '../../components/console/ConsoleVaultClient';
import { createClient } from '../../lib/supabase/server';
import { fetchAllConsoles, fetchManufacturers } from '../../lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Console Vault | The Retro Circuit',
  description: 'The ultimate database of retro and modern handheld gaming hardware. Compare specs, prices, and performance.',
};

export default async function ConsoleVaultPage() {
  const supabase = await createClient();
  const [manufacturers, allConsoles] = await Promise.all([
    fetchManufacturers(supabase),
    fetchAllConsoles(supabase)
  ]);

  return <ConsoleVaultClient initialConsoles={allConsoles} initialManufacturers={manufacturers} />;
}