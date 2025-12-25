export const revalidate = 60;

import HomepageV1 from '@/components/landing/HomepageV1';

export default async function ControlRoomPage() {
  return (
    <div className="w-full">
      <HomepageV1 />
    </div>
  );
}
