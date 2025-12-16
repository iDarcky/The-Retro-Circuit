export const revalidate = 60;

import Link from 'next/link';
import DesignSwitcher from '@/components/landing/DesignSwitcher';

export default async function ControlRoomPage() {
  return (
    <div className="w-full">
      <DesignSwitcher />
      {/*
        The DesignSwitcher component now handles the rendering of the entire landing page
        based on the selected design. The original content is replaced by the specific
        Landing Component selected in the switcher.
      */}
    </div>
  );
}
