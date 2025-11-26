import React from 'react';

const RetroLoader: React.FC = () => {
  return (
    <div className="w-full h-96 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-retro-neon border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(0,255,157,0.3)]"></div>
      <div className="font-pixel text-retro-neon text-sm animate-pulse">
        LOADING DATA CHUNK...
      </div>
      <div className="mt-2 font-mono text-xs text-gray-500">
        DECRYPTING SIGNAL
      </div>
    </div>
  );
};

export default RetroLoader;