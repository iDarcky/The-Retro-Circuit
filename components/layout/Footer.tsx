'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { siteConfig } from '../../config/site';

const Footer: FC = () => {
  return (
    <footer className="w-full bg-black shrink-0 z-10 relative border-t-4 border-border-normal before:absolute before:bottom-0 before:left-0 before:w-full before:h-[4px] before:bg-gradient-to-r before:from-pink-500 before:via-green-500 before:to-cyan-500 before:content-['']">
      <div className="max-w-7xl mx-auto px-4 py-6 md:h-16 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-[10px] font-mono">
        
        {/* Left: Branding */}
        <div className="flex items-center min-w-[120px]">
           <Link href="/" className="hover:opacity-80 transition-opacity">
               <span className="font-pixel text-[10px] md:text-xs text-secondary tracking-wider">
                  [ THE RETRO CIRCUIT ]
               </span>
           </Link>
        </div>

        {/* Center: Navigation */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-gray-500 font-tech uppercase tracking-wider">
           {siteConfig.routes.map((route, index) => (
             <div key={route.label} className="flex items-center gap-4">
                <Link 
                  href={route.href} 
                  className="hover:text-white transition-colors"
                >
                  {route.label}
                </Link>
                {index < siteConfig.routes.length - 1 && (
                  <span className="opacity-30 hidden md:inline">|</span>
                )}
             </div>
           ))}
        </div>

        {/* Right: System Status */}
        <div className="flex items-center gap-3 text-gray-600 font-tech uppercase tracking-wide">
           <span>VER: {siteConfig.version}</span>
           <span className="opacity-30">•</span>
           <span className="flex items-center gap-1.5 text-secondary">
             ONLINE
             <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_5px_currentColor]"></span>
           </span>
           <span className="opacity-30">•</span>
           <span>LOC: MARS</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
