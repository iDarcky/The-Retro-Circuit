
'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import { SoundProvider } from '../ui/SoundContext';
import { SearchProvider } from '../ui/SearchContext';
import GlobalSearch from '../ui/GlobalSearch';
import MainLayout from './MainLayout';

interface ClientShellProps {
  children: ReactNode;
}

const ClientShell: FC<ClientShellProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return <div className="bg-retro-dark h-screen w-screen" />;

  return (
    <SoundProvider>
      <SearchProvider>
        <MainLayout>
            {children}
        </MainLayout>
        <GlobalSearch />
      </SearchProvider>
    </SoundProvider>
  );
};

export default ClientShell;
