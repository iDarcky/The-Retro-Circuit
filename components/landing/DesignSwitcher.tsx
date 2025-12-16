'use client';

import React from 'react';
import {
  LayoutDashboard,
  Terminal,
  Zap,
  Image as ImageIcon,
  Smartphone,
  Grid,
  Monitor,
  MousePointer2,
  Newspaper,
  History,
  Apple
} from 'lucide-react';

export type DesignVariant =
  | 'dashboard'
  | 'hero'
  | 'terminal'
  | 'marketing'
  | 'apple-dark'
  | 'apple-light'
  | 'gsm'
  | 'bento'
  | 'win95'
  | 'brutalist'
  | 'magazine'
  | 'timeline';

interface DesignSwitcherProps {
  current: DesignVariant;
  onChange: (variant: DesignVariant) => void;
}

export default function DesignSwitcher({ current, onChange }: DesignSwitcherProps) {
  const variants: { id: DesignVariant; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { id: 'hero', icon: <ImageIcon size={16} />, label: 'Clean Hero' },
    { id: 'terminal', icon: <Terminal size={16} />, label: 'Terminal' },
    { id: 'marketing', icon: <Zap size={16} />, label: 'Marketing' },
    { id: 'apple-dark', icon: <Apple size={16} />, label: 'Apple (Dark)' },
    { id: 'apple-light', icon: <Apple size={16} />, label: 'Apple (Light)' },
    { id: 'gsm', icon: <Smartphone size={16} />, label: 'GSM Arena' },
    { id: 'bento', icon: <Grid size={16} />, label: 'Bento Grid' },
    { id: 'win95', icon: <Monitor size={16} />, label: 'Win 95' },
    { id: 'brutalist', icon: <MousePointer2 size={16} />, label: 'Brutalist' },
    { id: 'magazine', icon: <Newspaper size={16} />, label: '90s Mag' },
    { id: 'timeline', icon: <History size={16} />, label: 'Timeline' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-black/90 border border-retro-neon p-2 rounded-lg flex flex-col gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)] max-w-[300px]">
      <div className="text-[10px] text-center text-retro-neon font-pixel mb-1 border-b border-retro-neon/30 pb-1">
        DEV_TOOLS: LANDING ({variants.findIndex(v => v.id === current) + 1}/{variants.length})
      </div>

      <div className="grid grid-cols-4 gap-2">
        {variants.map((v) => (
            <button
                key={v.id}
                onClick={() => onChange(v.id)}
                className={`p-2 rounded hover:bg-white/10 transition-colors flex items-center justify-center ${current === v.id ? 'bg-retro-neon text-black' : 'text-gray-400'}`}
                title={v.label}
            >
                {v.icon}
            </button>
        ))}
      </div>
      <div className="text-[9px] text-center text-gray-500 font-mono mt-1">
          {variants.find(v => v.id === current)?.label}
      </div>
    </div>
  );
}
