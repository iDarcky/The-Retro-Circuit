import { Metadata } from 'next';
import { FinderFlow } from '@/components/finder/FinderFlow';

export const metadata: Metadata = {
  title: 'Handheld Finder | Retro Circuit',
  description: 'Take a short quiz to find the best retro handheld console for your budget and play style. Get 2–3 personalized picks, compare specs, and find where to buy.',
  openGraph: {
    title: 'Find Your Perfect Handheld',
    description: 'Answer a few quick questions and we’ll recommend 2–3 handhelds that fit your budget, comfort, and the games you want to play.',
  },
};

export default function FinderPage() {
  return <FinderFlow />;
}
