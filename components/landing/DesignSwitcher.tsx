'use client';

import React, { useState, useEffect } from 'react';
import LandingDashboard from './LandingDashboard';
import LandingAppleDark from './LandingAppleDark';
import LandingAppleLight from './LandingAppleLight';
import LandingGSM from './LandingGSM';
import LandingWin95 from './LandingWin95';
import LandingBento from './LandingBento';
import LandingBrutalist from './LandingBrutalist';
import LandingMagazine from './LandingMagazine';
import LandingTimeline from './LandingTimeline';
import LandingTerminal from './LandingTerminal';
import LandingHero from './LandingHero';
import LandingMarketing from './LandingMarketing';
import { LayoutGrid, Monitor, Newspaper, Smartphone, Box, Terminal, Zap, Clock, Type } from 'lucide-react';

const DESIGNS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutGrid, component: LandingDashboard },
  { id: 'apple-dark', name: 'Apple Dark', icon: Monitor, component: LandingAppleDark },
  { id: 'apple-light', name: 'Apple Light', icon: Smartphone, component: LandingAppleLight },
  { id: 'gsm', name: 'GSMArena', icon: Smartphone, component: LandingGSM },
  { id: 'win95', name: 'Windows 95', icon: Box, component: LandingWin95 },
  { id: 'bento', name: 'Bento Grid', icon: LayoutGrid, component: LandingBento },
  { id: 'brutalist', name: 'Brutalist', icon: Zap, component: LandingBrutalist },
  { id: 'magazine', name: 'Magazine', icon: Newspaper, component: LandingMagazine },
  { id: 'timeline', name: 'Timeline', icon: Clock, component: LandingTimeline },
  { id: 'terminal', name: 'Terminal', icon: Terminal, component: LandingTerminal },
  { id: 'hero', name: 'Hero Modern', icon: Monitor, component: LandingHero },
  { id: 'marketing', name: 'SaaS Marketing', icon: Type, component: LandingMarketing },
];

export default function DesignSwitcher() {
  const [currentDesign, setCurrentDesign] = useState('dashboard');
  const [isOpen, setIsOpen] = useState(false);

  // Persist choice
  useEffect(() => {
    const saved = localStorage.getItem('retro_landing_design');
    if (saved) setCurrentDesign(saved);
  }, []);

  const handleDesignChange = (id: string) => {
    setCurrentDesign(id);
    localStorage.setItem('retro_landing_design', id);
    setIsOpen(false);
  };

  const ActiveComponent = DESIGNS.find(d => d.id === currentDesign)?.component || LandingDashboard;

  return (
    <div className="relative min-h-screen">
      <ActiveComponent />

      {/* Floaty Switcher */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-black border border-[#00ff9d] text-[#00ff9d] px-4 py-2 font-mono text-xs shadow-[4px_4px_0_rgba(0,255,157,0.2)] hover:shadow-[2px_2px_0_rgba(0,255,157,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
        >
            <LayoutGrid size={14} />
            DEV_TOOLS: LANDING ({DESIGNS.findIndex(d => d.id === currentDesign) + 1}/{DESIGNS.length})
        </button>

        {isOpen && (
            <div className="absolute bottom-12 right-0 w-64 bg-black border border-[#00ff9d] p-2 grid grid-cols-4 gap-2 shadow-xl">
                {DESIGNS.map(d => (
                    <button
                        key={d.id}
                        onClick={() => handleDesignChange(d.id)}
                        className={`p-2 flex flex-col items-center gap-1 hover:bg-[#00ff9d]/20 transition-colors ${currentDesign === d.id ? 'bg-[#00ff9d]/20 text-[#00ff9d]' : 'text-gray-500'}`}
                        title={d.name}
                    >
                        <d.icon size={16} />
                    </button>
                ))}
                <div className="col-span-4 text-[10px] text-center text-gray-500 font-mono mt-1 border-t border-gray-800 pt-1">
                    {DESIGNS.find(d => d.id === currentDesign)?.name}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
