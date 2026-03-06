import { fetchManufacturers, fetchVaultConsoles } from '../../app/actions';
import ConsoleVaultClient from '../../components/console/ConsoleVaultClient';
import { createClient } from '../../lib/supabase/server';

export async function generateMetadata() {
  const supabase = await createClient();

  // Get count of published consoles
  const { count: consoleCount } = await supabase
    .from('consoles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Get count of variants for published consoles
  // This is a bit tricky to do with just count and filtering joined tables on Supabase without a custom RPC.
  // Since we already fetch all consoles below anyway, we could just do it there, but we want it in metadata.
  // Let's do a basic fetch for variant count
  const { count: variantCount } = await supabase
    .from('console_variants')
    .select('*', { count: 'exact', head: true });

  const numConsoles = consoleCount || 64;
  const numVariants = variantCount || 133;

  return {
    title: 'Console Vault | All Retro Handhelds | The Retro Circuit',
    description: `Browse, filter, and sort every retro handheld console in the database. ${numConsoles} consoles, ${numVariants} hardware variants.`,
  };
}


export const revalidate = 60;

export default async function ConsoleVaultPage() {
  let manufacturers: any[] = [];
  let allConsoles: any[] = [];

  try {
    [manufacturers, allConsoles] = await Promise.all([
      fetchManufacturers(),
      fetchVaultConsoles()
    ]);
  } catch (error) {
    console.warn('Build Warning: Failed to fetch console vault data. Returning empty state.', error);
    // Fallback is empty arrays, allowing build to complete
  }

  return <ConsoleVaultClient initialManufacturers={manufacturers} initialConsoles={allConsoles} />;
}
