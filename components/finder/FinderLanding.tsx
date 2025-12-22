'use client';

import { FC } from 'react';
import Button from '../ui/Button';

interface FinderLandingProps {
  onStart: () => void;
}

export const FinderLanding: FC<FinderLandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
      <h1 className="text-3xl md:text-5xl font-pixel mb-6 text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
        Find Your Perfect Handheld
      </h1>

      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed font-mono">
        Answer a few quick questions and we’ll recommend 2–3 handhelds that fit your budget, comfort, and the games you want to play.
      </p>

      <div className="flex flex-col items-center gap-3">
        <Button
          variant="primary"
          onClick={onStart}
          className="text-lg px-8 py-4"
        >
          Start the Finder
        </Button>
        <span className="text-sm font-tech text-white/50 tracking-wider">
          (~2 MINUTES)
        </span>
      </div>
    </div>
  );
};
