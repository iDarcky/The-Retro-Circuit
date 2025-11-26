import React, { useState, useEffect, Suspense, lazy, StrictMode } from 'react';
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
const IconNews = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2