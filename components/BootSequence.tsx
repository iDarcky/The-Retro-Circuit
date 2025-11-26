import React, { useEffect, useState } from 'react';
import { useSound } from './SoundContext';

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const { playHover, playBoot } = useSound();

  useEffect(() => {
    const sequence = [
      "RETRO-BIOS v1.0 (c) 199X",
      "CHECKING SYSTEM MEMORY... 640KB OK",
      "LOADING VIDEO DRIVERS... OK",
      "INITIALIZING SOUND SYNTH... OK",
      "MOUNTING CARTRIDGE...",
      "SYSTEM READY."
    ];

    let delay = 0;

    // Attempt to trigger boot sound (might require interaction first in some browsers, but we try)
    playBoot();

    sequence.forEach((line, index) => {
      // Randomize typing speed slightly
      delay += 400 + Math.random() * 300;
      
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        playHover(); // Use hover blip as a typing sound
      }, delay);
    });

    setTimeout(() => {
      onComplete();
    }, delay + 1000);

  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] p-8 md:p-16 flex flex-col justify-end pb-20 md:pb-32 font-mono text-retro-neon uppercase text-lg md:text-2xl leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="mb-2 drop-shadow-[0_0_8px_rgba(0,255,157,0.6)]">
          {line}
        </div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
};

export default BootSequence;
