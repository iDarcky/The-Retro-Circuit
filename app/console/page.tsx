import ConsoleVaultClient from '../../components/console/ConsoleVaultClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Console Vault | The Retro Circuit',
  description: 'The ultimate database of retro and modern handheld gaming hardware. Compare specs, prices, and performance.',
};

export default function ConsoleVaultPage() {
  return <ConsoleVaultClient />;
}