'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
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
  if (!mounted) return <div className="bg-bg-primary h-screen w-screen" />;

  return (
    <SearchProvider>
      <MainLayout>
          {children}
      </MainLayout>
      <GlobalSearch />
    </SearchProvider>
  );
};

export default ClientShell;
