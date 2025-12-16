
'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import BootSequence from '../ui/BootSequence';
import { SoundProvider } from '../ui/SoundContext';
import { SearchProvider } from '../ui/SearchContext';
import GlobalSearch from '../ui/GlobalSearch';
import MainLayout from './MainLayout';

interface ClientShellProps {
  children: ReactNode;
}

const ClientShell: FC<ClientShellProps> = ({ children }) => {
  const [bootComplete, setBootComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      <SearchProvider>
        {!bootComplete ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : (
          <MainLayout>
             {children}
          </MainLayout>
        )}
        <GlobalSearch />
      </SearchProvider>
    </SoundProvider>
  );
};

export default ClientShell;
