'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { siteConfig } from '../../config/site';

const Footer: FC = () => {
  return (
    <footer className="w-full bg-black border-t border-white/10 shrink-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between text-[10px] font-mono">
        
        {/* Left: Branding */}
        <div className="flex items-center text-retro-neon tracking-widest min-w-[120px]">
           [ {siteConfig.name.toUpperCase()} ]
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-4 text-gray-500">
           {siteConfig.routes.map((route, index) => (
             <div key={route.label} className="flex items-center gap-4">
                <Link 
                  href={route.href} 
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  {route.label}
                </Link>
                {index < siteConfig.routes.length - 1 && (
                  <span className="opacity-30">|</span>
                )}
             </div>
           ))}
        </div>

        {/* Right: System Status */}
        <div className="flex items-center gap-3 text-gray-600">
           <span>VER: {siteConfig.version}</span>
           <span className="opacity-30">•</span>
           <span className="flex items-center gap-1.5 text-retro-neon">
             ONLINE
             <span className="w-1.5 h-1.5 rounded-full bg-retro-neon animate-pulse shadow-[0_0_5px_currentColor]"></span>
           </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;