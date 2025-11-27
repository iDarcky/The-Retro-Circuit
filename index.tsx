import { useState, useEffect, Suspense, lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import BootSequence from './components/BootSequence';
import { SoundProvider, useSound } from './components/SoundContext';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import { checkDatabaseConnection, retroAuth } from './services/geminiService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import GlobalSearch from './components/GlobalSearch';
import RetroLoader from './components/RetroLoader';

// --- LAZY LOADED PAGES (Code Splitting) ---
const LandingPage = lazy(() => import('./components/LandingPage'));
const NewsSection = lazy(() => import('./components/NewsSection'));
const ConsoleComparer = lazy(() => import('./components/ConsoleComparer'));
const GamesList = lazy(() => import('./components/GamesList'));
const GameDetails = lazy(() => import('./components/GameDetails'));
const Timeline = lazy(() => import('./components/Timeline'));
const AuthSection = lazy(() => import('./components/AuthSection'));
const ConsoleLibrary = lazy(() => import('./components/ConsoleLibrary'));
const ConsoleSpecs = lazy(() => import('./components/ConsoleSpecs'));
const ManufacturerDetail = lazy(() => import('./components/ManufacturerDetail'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));
const HtmlSitemap = lazy(() => import('./components/HtmlSitemap'));
const NotFound = lazy(() => import('./components/NotFound'));

// --- ICONS ---
const IconNews = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>;
const IconDatabase = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const IconVS = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const IconGames = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4m-2-2v4"></path><circle cx="17" cy="11" r="0.5" fill="currentColor"></circle><circle cx="15" cy="13" r="0.5" fill="currentColor"></circle></svg>;
const IconTimeline = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconLogin = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>;
const IconHome = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconLock = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 