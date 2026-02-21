import React from 'react';
import { adConfig } from '../../lib/config/ads';

interface AdWrapperProps {
  type: 'sidebar' | 'grid' | 'banner' | 'mobile-content';
  slotId?: string; // Optional override
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
}

const AdWrapper: React.FC<AdWrapperProps> = ({
  type,
  slotId,
  className = '',
  format = 'auto'
}) => {
  if (!adConfig.enabled) return null;

  // Prevent unused variable error during build
  // format will be used when real ads are enabled
  void format;

  const isPlaceholder = adConfig.usePlaceholders;
  const currentSlotId = slotId || adConfig.slots[type === 'mobile-content' ? 'mobileContent' : type];

  // Specific dimensions based on type if not overridden by className
  // Note: These are defaults; parent can override via className
  const getDimensions = () => {
    switch (type) {
      case 'sidebar':
        return 'w-full min-h-[600px]'; // Skyscraper
      case 'grid':
        return 'w-full h-full min-h-[350px]'; // Matches card height roughly
      case 'banner':
        return 'w-full h-[100px] md:h-[250px]'; // Leaderboard
      case 'mobile-content':
        return 'w-full h-[250px]'; // MPU
      default:
        return 'w-full h-[250px]';
    }
  };

  const dimensions = getDimensions();

  // Base Swiss Design wrapper styles
  const wrapperClass = `
    relative flex flex-col items-center justify-center
    border border-border-subtle bg-bg-secondary/5
    overflow-hidden transition-all duration-300
    ${dimensions}
    ${className}
  `;

  return (
    <div className={wrapperClass}>
      {/* Label - Swiss Mono */}
      <div className="absolute top-0 left-0 bg-bg-secondary/10 border-b border-r border-border-subtle px-2 py-1 z-10">
        <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest">
          Advertisement
        </span>
      </div>

      {/* Content */}
      {isPlaceholder ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-4">
            {/* Diagonal Stripe Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)] pointer-events-none"></div>

            <div className="text-center z-10 opacity-40">
                <div className="font-pixel text-2xl text-text-secondary mb-2 tracking-widest">AD SPACE</div>
                <div className="font-mono text-xs text-text-secondary/60 uppercase">
                    {type.replace('-', ' ')}
                </div>
                {type === 'grid' && (
                   <div className="mt-4 px-3 py-1 border border-dashed border-text-secondary/30 text-[10px] font-mono text-text-secondary/50">
                      SPONSORED
                   </div>
                )}
            </div>

            {/* Decorative corners */}
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-text-secondary/20"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-text-secondary/20"></div>
        </div>
      ) : (
        /* Real AdSense Unit */
        <div className="w-full h-full flex items-center justify-center bg-transparent">
             {/* This is where the actual <ins> tag would go */}
             {/* Example structure for future implementation: */}
             {/*
             <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot={currentSlotId}
                 data-ad-format={format}
                 data-full-width-responsive="true"></ins>
             <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
             */}
             <div className="text-xs text-red-500 font-mono">
                ADSENSE NOT CONFIGURED
             </div>
        </div>
      )}
    </div>
  );
};

export default AdWrapper;
