'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { siteConfig } from '../../config/site';

const Footer: FC = () => {
  return (
    <footer className="w-full bg-black shrink-0 z-10 relative before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-pink-500 before:via-green-500 before:to-cyan-500 before:content-['']">
      <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between text-[10px] font-mono">
        
        {/* Left: Branding */}
        <div className="flex items-center min-w-[120px]">
           <Link href="/" className="hover:opacity-80 transition-opacity">
               <span className="font-mono text-lg font-bold text-retro-neon tracking-wider">
                  [ THE RETRO CIRCUIT ]
               </span>
           </Link>
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
           <span className="opacity-30">•</span>
           <span>LOC: MARS</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;