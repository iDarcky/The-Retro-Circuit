'use client';

import React, { useState } from 'react';
import DesignSwitcher, { DesignVariant } from '@/components/landing/DesignSwitcher';
import LandingDashboard from '@/components/landing/LandingDashboard';
import LandingHero from '@/components/landing/LandingHero';
import LandingTerminal from '@/components/landing/LandingTerminal';
import LandingMarketing from '@/components/landing/LandingMarketing';
import LandingAppleDark from '@/components/landing/LandingAppleDark';
import LandingAppleLight from '@/components/landing/LandingAppleLight';
import LandingGSM from '@/components/landing/LandingGSM';
import LandingBento from '@/components/landing/LandingBento';
import LandingWin95 from '@/components/landing/LandingWin95';
import LandingBrutalist from '@/components/landing/LandingBrutalist';
import LandingMagazine from '@/components/landing/LandingMagazine';
import LandingTimeline from '@/components/landing/LandingTimeline';

export default function LandingPage() {
  const [design, setDesign] = useState<DesignVariant>('marketing');

  const renderDesign = () => {
    switch (design) {
      case 'dashboard': return <LandingDashboard />;
      case 'hero': return <LandingHero />;
      case 'terminal': return <LandingTerminal />;
      case 'marketing': return <LandingMarketing />;
      case 'apple-dark': return <LandingAppleDark />;
      case 'apple-light': return <LandingAppleLight />;
      case 'gsm': return <LandingGSM />;
      case 'bento': return <LandingBento />;
      case 'win95': return <LandingWin95 />;
      case 'brutalist': return <LandingBrutalist />;
      case 'magazine': return <LandingMagazine />;
      case 'timeline': return <LandingTimeline />;
      default: return <LandingMarketing />;
    }
  };

  return (
    <div className="relative w-full min-h-screen">
       <DesignSwitcher current={design} onChange={setDesign} />
       {renderDesign()}
    </div>
  );
}
