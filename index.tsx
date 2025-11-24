import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import NewsSection from './components/NewsSection';
import ConsoleComparer from './components/ConsoleComparer';
import GameOfTheWeek from './components/GameOfTheWeek';
import Timeline from './components/Timeline';
import AuthSection from './components/AuthSection';
import BootSequence from './components/BootSequence';
import ConsoleLibrary from './components/ConsoleLibrary';
import ConsoleSpecs from './components/ConsoleSpecs';
import { SoundProvider, useSound } from './components/SoundContext';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import { checkDatabaseConnection } from './services/geminiService';

// --- ICONS ---
const IconNews = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>;
const IconDatabase = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const IconVS = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const IconGOTW = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconTimeline = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconLogin = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>;
const IconHome = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

// --- SIDEBAR NAVIGATION ---
const SidebarItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  const { playHover, playClick } = useSound();

  return (
    <Link 
      to={to} 
      className={`group flex items-center px-4 py-3 font-mono transition-all duration-200 border-l-4 ${
        isActive 
          ? 'border-retro-neon bg-retro-grid/50 text-white shadow-[inset_0_0_10px_rgba(0,255,157,0.2)]' 
          : 'border-transparent text-gray-400 hover:text-retro-blue hover:bg-retro-grid/20 hover:border-retro-blue'
      }`}
      onMouseEnter={playHover}
      onClick={playClick}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-retro-neon' : 'group-hover:scale-110'}`}>
        <Icon />
      </div>
      <span className="tracking-widest text-sm">{label}</span>
    </Link>
  );
};

// --- LAYOUT COMPONENTS ---
const FooterStatus = () => {
    const [dbStatus, setDbStatus] = useState<'CHECKING' | 'ONLINE' | 'OFFLINE'>('CHECKING');

    useEffect(() => {
        const check = async () => {
            const isConnected = await checkDatabaseConnection();
            setDbStatus(isConnected ? 'ONLINE' : 'OFFLINE');
        };
        check();
        const interval = setInterval(check, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 right-0 h-8 bg-retro-dark border-t border-retro-grid flex items-center justify-between px-4 z-50 text-[10px] font-mono">
            <div className="flex items-center space-x-4">
                <span className="text-gray-500">SYSTEM STATUS:</span>
                <span className={`flex items-center ${
                    dbStatus === 'ONLINE' ? 'text-retro-neon' : 
                    dbStatus === 'OFFLINE' ? 'text-retro-pink animate-pulse' : 'text-yellow-400'
                }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                        dbStatus === 'ONLINE' ? 'bg-retro-neon' : 
                        dbStatus === 'OFFLINE' ? 'bg-retro-pink' : 'bg-yellow-400'
                    }`}></span>
                    {dbStatus === 'CHECKING' ? 'ESTABLISHING UPLINK...' : `DATABASE ${dbStatus}`}
                </span>
            </div>
            <div className="text-gray-600">
                RETRO CIRCUIT v1.0.5 // MEM: 64KB OK
            </div>
        </footer>
    );
};

const AppContent = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const location = useLocation();

  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />;
  }

  return (
    <div className="min-h-screen bg-retro-dark pb-10">
      <SEOHead 
        title="Home" 
        description="The ultimate retro gaming terminal. Compare consoles and read news." 
      />
      
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-retro-grid flex justify-between items-center sticky top-0 bg-retro-dark z-40">
        <h1 className="font-pixel text-retro-neon text-sm">THE RETRO CIRCUIT</h1>
        <div className="flex gap-2">
            <Link to="/login" className="p-2 border border-retro-grid text-retro-blue">
                <IconLogin />
            </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen pt-0 md:pt-0">
        
        {/* Sidebar (Desktop) */}
        <nav className="hidden md:flex flex-col w-64 border-r border-retro-grid bg-retro-dark/95 fixed h-full top-0 left-0 z-40 overflow-y-auto">
            <div className="p-6 border-b border-retro-grid mb-4">
                <h1 className="font-pixel text-xl text-retro-neon leading-relaxed drop-shadow-[2px_2px_0_rgba(255,0,255,0.5)]">
                    THE RETRO<br/>CIRCUIT
                </h1>
                <div className="text-[10px] font-mono text-gray-500 mt-2">TERMINAL ID: 8X-99</div>
            </div>

            <div className="flex-1 py-4">
                <SidebarItem to="/" icon={IconHome} label="MAIN MENU" exact />
                <SidebarItem to="/news" icon={IconNews} label="NEWS WIRE" />
                <SidebarItem to="/consoles" icon={IconDatabase} label="HARDWARE DB" />
                <SidebarItem to="/comparer" icon={IconVS} label="VS. MODE" />
                <SidebarItem to="/gotw" icon={IconGOTW} label="GAME OF WEEK" />
                <SidebarItem to="/timeline" icon={IconTimeline} label="TIMELINE" />
            </div>

            <div className="p-4 border-t border-retro-grid">
                <SidebarItem to="/login" icon={IconLogin} label="LOGIN / ACCT" />
            </div>
        </nav>

        {/* Mobile Navigation Bar (Bottom) */}
        <nav className="md:hidden fixed bottom-8 left-0 right-0 bg-retro-dark border-t border-retro-grid flex justify-around p-2 z-40">
            <Link to="/" className="p-2 text-retro-neon"><IconHome /></Link>
            <Link to="/news" className="p-2 text-gray-400"><IconNews /></Link>
            <Link to="/consoles" className="p-2 text-gray-400"><IconDatabase /></Link>
            <Link to="/comparer" className="p-2 text-gray-400"><IconVS /></Link>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-retro-pink via-retro-neon to-retro-blue opacity-50"></div>
            
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/news" element={<NewsSection />} />
                <Route path="/consoles" element={<ConsoleLibrary />} />
                <Route path="/consoles/:slug" element={<ConsoleSpecs />} />
                <Route path="/comparer" element={<ConsoleComparer />} />
                <Route path="/gotw" element={<GameOfTheWeek />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/login" element={<AuthSection />} />
            </Routes>

            {/* Content Footer */}
            <div className="mt-20 pt-10 border-t border-retro-grid border-dashed text-center font-mono text-xs text-gray-600">
                &copy; 199X-2024 THE RETRO CIRCUIT // DESIGNED FOR NETSCAPE NAVIGATOR 4.0
            </div>
        </main>
      </div>

      <FooterStatus />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <SoundProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SoundProvider>
    </ErrorBoundary>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);