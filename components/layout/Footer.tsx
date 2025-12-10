'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { siteConfig } from '../../config/site';

const Footer: FC = () => {
  return (
    <footer className="w-full bg-black border-t border-white/10 mt-auto relative z-10">
      {/* Desktop: 3 Columns. Mobile: Stacked */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        
        {/* Left: Identity */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
           <div className="font-pixel text-retro-neon text-sm tracking-widest mb-1 shadow-[0_0_5px_rgba(0,255,157,0.3)]">
             [ {siteConfig.name.toUpperCase()} ]
           </div>
           <div className="font-mono text-[10px] text-gray-500">
             © {siteConfig.est} // ALL RIGHTS RESERVED
           </div>
        </div>

        {/* Center: Navigation */}
        <div className="flex flex-wrap justify-center gap-4 font-mono text-xs text-gray-400">
           {siteConfig.routes.map((route, index) => (
             <div key={route.label} className="flex items-center gap-4">
                <Link 
                  href={route.href} 
                  className="hover:text-retro-neon transition-colors duration-200 uppercase tracking-wide hover:underline decoration-retro-neon underline-offset-4"
                >
                  {route.label}
                </Link>
                {index < siteConfig.routes.length - 1 && (
                  <span className="text-gray-700 hidden md:inline">|</span>
                )}
             </div>
           ))}
        </div>

        {/* Right: Status HUD */}
        <div className="flex flex-col items-center md:items-end font-mono text-[10px] text-gray-500 spacing-y-1 bg-white/5 p-2 border border-white/5 rounded">
           <div className="flex items-center gap-2">
             <span>VER: <span className="text-retro-blue">{siteConfig.version}</span></span>
           </div>
           <div className="flex items-center gap-2">
             <span>SYS: <span className="text-retro-neon">ONLINE</span></span>
             <span className="w-1.5 h-1.5 rounded-full bg-retro-neon animate-pulse shadow-[0_0_5px_rgba(0,255,157,1)]"></span>
           </div>
           <div>
             LOC: EARTH
           </div>
        </div>

      </div>
      
      {/* Bottom Stripe decoration */}
      <div className="h-0.5 w-full bg-gradient-to-r from-retro-pink via-retro-neon to-retro-blue opacity-30"></div>
    </footer>
  );
};

export default Footer;