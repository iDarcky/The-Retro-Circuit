
import { type FC } from 'react';

interface LogoProps {
  className?: string;
  animate?: boolean;
  src?: string | null;
  alt?: string;
}

const Logo: FC<LogoProps> = ({ className = "w-12 h-12", animate = true, src, alt = "Logo" }) => {
  if (src) {
    return (
      <div className={`${className} relative flex items-center justify-center`}>
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]" 
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circuit Traces - Outer */}
      <path d="M50 5 V 20" className="stroke-retro-grid" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 80 V 95" className="stroke-retro-grid" strokeWidth="4" strokeLinecap="round" />
      <path d="M5 50 H 20" className="stroke-retro-grid" strokeWidth="4" strokeLinecap="round" />
      <path d="M80 50 H 95" className="stroke-retro-grid" strokeWidth="4" strokeLinecap="round" />
      
      {/* Decorative Pins */}
      <path d="M30 5 V 20" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />
      <path d="M70 5 V 20" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />
      <path d="M30 80 V 95" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />
      <path d="M70 80 V 95" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />
      
      <path d="M5 30 H 20" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />
      <path d="M5 70 H 20" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />
      <path d="M80 30 H 95" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />
      <path d="M80 70 H 95" className="stroke-retro-grid" strokeWidth="2" opacity="0.5" />

      {/* Main Chip Body */}
      <rect x="20" y="20" width="60" height="60" rx="8" className="fill-retro-dark stroke-retro-neon" strokeWidth="4" />
      
      {/* Internal Details */}
      <path d="M35 35 L 45 35 L 45 45" className="stroke-retro-blue" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M65 65 L 55 65 L 55 55" className="stroke-retro-pink" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Central Core Pulse */}
      <circle cx="50" cy="50" r="6" className={`fill-retro-neon ${animate ? 'animate-pulse' : ''}`} />
    </svg>
  );
};

export default Logo;
