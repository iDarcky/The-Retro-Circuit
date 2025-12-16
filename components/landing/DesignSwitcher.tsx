'use client';

import React from 'react';
import { LayoutDashboard, Terminal, Zap, Image as ImageIcon } from 'lucide-react';

export type DesignVariant = 'dashboard' | 'hero' | 'terminal' | 'marketing';

interface DesignSwitcherProps {
  current: DesignVariant;
  onChange: (variant: DesignVariant) => void;
}

export default function DesignSwitcher({ current, onChange }: DesignSwitcherProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-black/90 border border-retro-neon p-2 rounded-lg flex flex-col gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)]">
      <div className="text-[10px] text-center text-retro-neon font-pixel mb-1 border-b border-retro-neon/30 pb-1">
        DEV_TOOLS: LANDING
      </div>

      <div className="flex gap-2">
        <button
            onClick={() => onChange('dashboard')}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${current === 'dashboard' ? 'bg-retro-neon text-black' : 'text-gray-400'}`}
            title="Dashboard View"
        >
            <LayoutDashboard size={20} />
        </button>

        <button
            onClick={() => onChange('hero')}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${current === 'hero' ? 'bg-retro-neon text-black' : 'text-gray-400'}`}
            title="Clean Hero View"
        >
            <ImageIcon size={20} />
        </button>

        <button
            onClick={() => onChange('terminal')}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${current === 'terminal' ? 'bg-retro-neon text-black' : 'text-gray-400'}`}
            title="Terminal View"
        >
            <Terminal size={20} />
        </button>

        <button
            onClick={() => onChange('marketing')}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${current === 'marketing' ? 'bg-retro-neon text-black' : 'text-gray-400'}`}
            title="Marketing View"
        >
            <Zap size={20} />
        </button>
      </div>
    </div>
  );
}
