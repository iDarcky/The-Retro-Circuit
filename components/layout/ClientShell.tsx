'use client';

import { type FC, type ReactNode } from 'react';
import { SearchProvider } from '../ui/SearchContext';
import GlobalSearch from '../ui/GlobalSearch';
import MainLayout from './MainLayout';

interface ClientShellProps {
  children: ReactNode;
}

const ClientShell: FC<ClientShellProps> = ({ children }) => {
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
