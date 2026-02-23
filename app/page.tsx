export const revalidate = 60;

import LandingPage from '@/components/landing/LandingPage';
import { getSystemVersion } from './actions/roadmap';

export default async function ControlRoomPage() {
  const version = await getSystemVersion();
  return (
    <div className="w-full">
      <LandingPage version={version} />
    </div>
  );
}
