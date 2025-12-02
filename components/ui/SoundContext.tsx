'use client';

import { createContext, useContext, useEffect, useRef, useState, type FC, type ReactNode } from 'react';

interface SoundContextType {
  playHover: () => void;
  playClick: () => void;
  playBoot: () => void;
  enabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext logic
    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioCtxRef.current = new AudioContextClass();
            }
        }
        // Resume if suspended
        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    // Browsers require user interaction to start audio contexts
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    
    return () => {
        window.removeEventListener('click', initAudio);
        window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const playTone = (freq: number, type: 'square' | 'sawtooth' | 'sine', duration: number, vol: number = 0.1) => {
    if (!enabled || !audioCtxRef.current) return;
    
    // Ensure context is running
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
    }

    try {
        const osc = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        
        // Envelope
        gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(vol, audioCtxRef.current.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        osc.start();
        osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
        // Ignore audio errors
    }
  };

  const playHover = () => {
    // High pitch short blip
    playTone(1200, 'square', 0.05, 0.02);
  };

  const playClick = () => {
    // Confirmation sound
    playTone(440, 'square', 0.1, 0.05);
    setTimeout(() => playTone(880, 'square', 0.15, 0.05), 50);
  };

  const playBoot = () => {
     if (!audioCtxRef.current) return;
     // THX-style rising sound (simplified)
     const now = audioCtxRef.current.currentTime;
     playTone(110, 'sawtooth', 1.5, 0.1); // Bass
     setTimeout(() => playTone(220, 'square', 1.0, 0.05), 200);
     setTimeout(() => playTone(440, 'square', 1.0, 0.05), 400);
     setTimeout(() => playTone(880, 'square', 1.5, 0.05), 600);
  };

  const toggleSound = () => setEnabled(!enabled);

  return (
    <SoundContext.Provider value={{ playHover, playClick, playBoot, enabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};