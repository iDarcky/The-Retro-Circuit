'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import BootSequence from '../ui/BootSequence';
import { SoundProvider } from '../ui/SoundContext';
import MainLayout from './MainLayout';
import RetroLoader from '../ui/RetroLoader';

interface ClientShellProps {
  children: ReactNode;
}

const ClientShell: FC<ClientShellProps> = ({ children }) => {
  const [bootComplete, setBootComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const hasBooted = sessionStorage.getItem('retro_boot_complete');
    if (hasBooted) {
      setBootComplete(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('retro_boot_complete', 'true');
    setBootComplete(true);
  };

  // Prevent hydration mismatch
  if (!mounted) return <div className="bg-retro-dark h-screen w-screen" />;

  return (
    <SoundProvider>
      {!bootComplete ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <MainLayout>
           {children}
        </MainLayout>
      )}
    </SoundProvider>
  );
};

export default ClientShell;