'use client';

import { FC } from 'react';
import Button from '../ui/Button';
import { Gamepad2, Smartphone, Monitor } from 'lucide-react';

interface FinderResultsProps {
  onRestart: () => void;
}

export const FinderResults: FC<FinderResultsProps> = ({ onRestart }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 w-full animate-in zoom-in-95 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-pixel text-white mb-4 drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
          Your Matches
        </h2>
        <p className="text-gray-400 font-mono text-lg">
          Based on your answers, these handhelds are perfect for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Placeholder Result 1 */}
        <div className="bg-bg-secondary/80 border border-secondary/30 rounded-xl overflow-hidden relative group hover:border-secondary transition-all">
          <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
            <Gamepad2 className="w-16 h-16 text-gray-600 group-hover:text-secondary transition-colors" />
             <div className="absolute top-4 right-4 bg-secondary text-bg-primary font-bold px-2 py-1 text-xs rounded">
              98% MATCH
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Result A</h3>
            <div className="flex gap-2 mb-4">
               <span className="text-xs border border-white/20 px-2 py-1 rounded text-gray-400">Emulation King</span>
               <span className="text-xs border border-white/20 px-2 py-1 rounded text-gray-400">$50-100</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              A placeholder description for the first recommended handheld console. Ideally fits retro gamers.
            </p>
            <Button className="w-full text-sm">View Details</Button>
          </div>
        </div>

        {/* Placeholder Result 2 */}
        <div className="bg-bg-secondary/80 border border-secondary/30 rounded-xl overflow-hidden relative group hover:border-secondary transition-all">
          <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
            <Smartphone className="w-16 h-16 text-gray-600 group-hover:text-secondary transition-colors" />
            <div className="absolute top-4 right-4 bg-secondary text-bg-primary font-bold px-2 py-1 text-xs rounded">
              95% MATCH
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Result B</h3>
             <div className="flex gap-2 mb-4">
               <span className="text-xs border border-white/20 px-2 py-1 rounded text-gray-400">Pocketable</span>
               <span className="text-xs border border-white/20 px-2 py-1 rounded text-gray-400">$100+</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              A placeholder description for the second recommended handheld console. Great for on-the-go gaming.
            </p>
            <Button className="w-full text-sm">View Details</Button>
          </div>
        </div>

         {/* Placeholder Result 3 */}
         <div className="bg-bg-secondary/80 border border-secondary/30 rounded-xl overflow-hidden relative group hover:border-secondary transition-all">
          <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
            <Monitor className="w-16 h-16 text-gray-600 group-hover:text-secondary transition-colors" />
            <div className="absolute top-4 right-4 bg-secondary text-bg-primary font-bold px-2 py-1 text-xs rounded">
              88% MATCH
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Result C</h3>
             <div className="flex gap-2 mb-4">
               <span className="text-xs border border-white/20 px-2 py-1 rounded text-gray-400">Powerhouse</span>
               <span className="text-xs border border-white/20 px-2 py-1 rounded text-gray-400">$200+</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              A placeholder description for the third recommended handheld console. For those who want max performance.
            </p>
            <Button className="w-full text-sm">View Details</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="secondary" onClick={onRestart}>
          Start Over
        </Button>
      </div>
    </div>
  );
};
