'use client';

import React, { useState } from 'react';
import DesignSwitcher, { DesignVariant } from '@/components/landing/DesignSwitcher';
import LandingDashboard from '@/components/landing/LandingDashboard';
import LandingHero from '@/components/landing/LandingHero';
import LandingTerminal from '@/components/landing/LandingTerminal';
import LandingMarketing from '@/components/landing/LandingMarketing';

export default function LandingPage() {
  const [design, setDesign] = useState<DesignVariant>('dashboard');

  const renderDesign = () => {
    switch (design) {
      case 'dashboard': return <LandingDashboard />;
      case 'hero': return <LandingHero />;
      case 'terminal': return <LandingTerminal />;
      case 'marketing': return <LandingMarketing />;
      default: return <LandingDashboard />;
    }
  };

  return (
    <div className="relative w-full min-h-screen">
       <DesignSwitcher current={design} onChange={setDesign} />
       {renderDesign()}
    </div>
  );
}
