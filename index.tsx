
import { useState, Suspense, lazy, StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BootSequence from './components/ui/BootSequence';
import { SoundProvider } from './components/ui/SoundContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import RetroLoader from './components/ui/RetroLoader';
import MainLayout from './components/layout/MainLayout';

// --- LAZY LOADED PAGES (Code Splitting) ---
// Pointing to the nested files inside their respective folders
const ControlRoom = lazy(() => import('./pages/ControlRoom/ControlRoom'));
const SignalFeed = lazy(() => import('./pages/SignalFeed/SignalFeed'));
const VsMode = lazy(() => import('./pages/vs mode/VsMode'));
const GameVault = lazy(() => import('./pages/GameVault/GameVault'));
const GameDetails = lazy(() => import('./pages/GameVault/GameDetails'));
const HistoryLine = lazy(() => import('./pages/timeline page/HistoryLine'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const ConsoleVault = lazy(() => import('./pages/ConsoleVault/ConsoleVault'));
const ConsoleSpecs = lazy(() => import('./pages/ConsoleVault/ConsoleSpecs'));
const ManufacturerDetail = lazy(() => import('./pages/ConsoleVault/ManufacturerDetail'));
const AdminPortal = lazy(() => import('./pages/auth/AdminPortal'));
const SystemMap = lazy(() => import('./pages/SystemMap'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    // Check if we've already booted this session
    const hasBooted = sessionStorage.getItem('retro_boot_complete');
    if (hasBooted) {
        setBootComplete(true);
    }
  }, []);

  const handleBootComplete = () => {
      sessionStorage.setItem('retro_boot_complete', 'true');
      setBootComplete(true);
  };

  return (
    <StrictMode>
        <SoundProvider>
            {!bootComplete ? (
                <BootSequence onComplete={handleBootComplete} />
            ) : (
                <BrowserRouter>
                    <MainLayout>
                        <Suspense fallback={<RetroLoader />}>
                            <ErrorBoundary>
                                <Routes>
                                    <Route path="/" element={<ControlRoom />} />
                                    <Route path="/signals" element={<SignalFeed />} />
                                    <Route path="/archive" element={<GameVault />} />
                                    <Route path="/archive/:slug" element={<GameDetails />} />
                                    <Route path="/systems" element={<ConsoleVault />} />
                                    <Route path="/systems/brand/:name" element={<ManufacturerDetail />} />
                                    <Route path="/systems/:slug" element={<ConsoleSpecs />} />
                                    <Route path="/arena" element={<VsMode />} />
                                    <Route path="/chrono" element={<HistoryLine />} />
                                    <Route path="/login" element={<AuthPage />} />
                                    <Route path="/signup" element={<AuthPage />} />
                                    <Route path="/recovery" element={<AuthPage />} />
                                    <Route path="/admin" element={<AdminPortal />} />
                                    <Route path="/sitemap" element={<SystemMap />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </ErrorBoundary>
                        </Suspense>
                    </MainLayout>
                </BrowserRouter>
            )}
        </SoundProvider>
    </StrictMode>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
