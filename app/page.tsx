export const revalidate = false;

import LandingPage from '@/components/landing/LandingPage';

export const metadata = {
  alternates: { canonical: '/' },
};

export default async function ControlRoomPage() {
  return (
    <div className="w-full">
      <LandingPage />
    </div>
  );
}
