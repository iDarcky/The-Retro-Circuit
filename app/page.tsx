/* PROTOTYPE BRANCH (prototype/homepage-variants): three homepage mockups on the real route,
 * switchable with ?variant=A|B|C|D. Never merge this file; fold the winner into the real page. */
import LandingPage from '@/components/landing/LandingPage';
import { loadHomeData } from '@/components/landing/prototype/data';
import VariantShowroom from '@/components/landing/prototype/VariantShowroom';
import VariantPlay from '@/components/landing/prototype/VariantPlay';
import VariantArena from '@/components/landing/prototype/VariantArena';
import Switcher from '@/components/landing/prototype/Switcher';

export const metadata = {
  alternates: { canonical: '/' },
  robots: { index: false },
};

const VARIANTS = [
  { key: 'A', name: 'Showroom' },
  { key: 'B', name: 'What do you want to play?' },
  { key: 'C', name: 'Arena head-to-head' },
  { key: 'D', name: 'Spec ledger (first try)' },
];

export default async function HomePrototype({ searchParams }: { searchParams: Promise<{ variant?: string }> }) {
  const v = ((await searchParams).variant ?? 'A').toUpperCase();
  const showSwitcher = process.env.VERCEL_ENV !== 'production';
  const data = v === 'D' ? null : await loadHomeData();
  return (
    <div className="w-full">
      {v === 'D' ? (
        <LandingPage />
      ) : v === 'B' ? (
        <VariantPlay data={data!} />
      ) : v === 'C' ? (
        <VariantArena data={data!} />
      ) : (
        <VariantShowroom data={data!} />
      )}
      {showSwitcher && <Switcher variants={VARIANTS} current={VARIANTS.some((x) => x.key === v) ? v : 'A'} />}
    </div>
  );
}
