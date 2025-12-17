export const revalidate = 60;

import LandingPage from '@/components/landing/LandingPage';

export default async function ControlRoomPage() {
  return (
    <div className="w-full">
      <LandingPage />
    </div>
  );
}
