'use client';

import { useEffect, useState } from 'react';
import { retroAuth } from '../../lib/auth';
import { fetchManufacturers, fetchConsoleList } from '../../lib/api';
import { Manufacturer } from '../../lib/types';
import { NewsForm } from '../../components/admin/NewsForm';
import { ManufacturerForm } from '../../components/admin/ManufacturerForm';
import { ConsoleForm } from '../../components/admin/ConsoleForm';
import { VariantForm } from '../../components/admin/VariantForm';
import { GameForm } from '../../components/admin/GameForm';
import { SettingsForm } from '../../components/admin/SettingsForm';

type AdminTab = 'NEWS' | 'GAME' | 'CONSOLE' | 'VARIANTS' | 'FABRICATOR' | 'SETTINGS';

export default function AdminPortalPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('NEWS');
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
    // Shared Data
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [consoleList, setConsoleList] = useState<{name: string, id: string}[]>([]);
    const [customLogo, setCustomLogo] = useState<string | null>(null);

    // State for Variant-First Workflow
    const [newlyCreatedConsoleId, setNewlyCreatedConsoleId] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            console.log('[AdminPage] Initializing Admin Portal...');
            try {
                const admin = await retroAuth.isAdmin();
                setIsAdmin(admin);
                
                if (admin) {
                    // Fetch initial data
                    const [manus, consoles] = await Promise.all([
                        fetchManufacturers(),
                        fetchConsoleList()
                    ]);
                    setManufacturers(manus);
                    setConsoleList(consoles as any);
                    
                    const savedLogo = localStorage.getItem('retro_custom_logo');
                    if (savedLogo) setCustomLogo(savedLogo);
                }
            } catch (e) {
                console.error('[AdminPage] Initialization Error:', e);
            }
            setLoading(false);
        };
        check();
    }, []);

    const handleSuccess = (msg: string) => {
        if (msg) {
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
        }
        setErrorMsg(null);
        // Refresh lists if needed based on active tab
        if (activeTab === 'FABRICATOR') fetchManufacturers().then(setManufacturers);
        if (activeTab === 'CONSOLE') fetchConsoleList().then(list => setConsoleList(list as any));
    };

    // Special handler for Console Creation to switch tabs
    const handleConsoleCreated = (id: string, name: string) => {
        console.log(`[AdminPage] Console Created: ${name} (${id}). Switching to Variants tab.`);
        setNewlyCreatedConsoleId(id);
        
        // Refresh the console list so the new ID is valid in the dropdown
        fetchConsoleList().then(list => setConsoleList(list as any));

        setMessage(`FOLDER "${name}" CREATED. PLEASE ADD TECHNICAL SPECS.`);
        setActiveTab('VARIANTS');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="p-8 text-retro-neon font-mono animate-pulse">AUTHENTICATING...</div>;
    if (!isAdmin) return <div className="p-8 text-retro-pink font-mono">ACCESS DENIED. ADMIN PRIVILEGES REQUIRED.</div>;

    const tabs: {id: AdminTab, label: string}[] = [
        { id: 'NEWS', label: 'SIGNALS' },
        { id: 'FABRICATOR', label: 'FABRICATORS' },
        { id: 'CONSOLE', label: 'ADD CONSOLE' },
        { id: 'VARIANTS', label: 'ADD VARIANTS' },
        { id: 'GAME', label: 'ARCHIVE GAME' },
        { id: 'SETTINGS', label: 'SYSTEM' },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
            <div className="flex justify-between items-end mb-8 border-b-4 border-retro-grid pb-4">
                <div>
                    <h1 className="text-3xl font-pixel text-white mb-2">ROOT ACCESS</h1>
                    <p className="font-mono text-xs text-gray-500">DATABASE WRITE PERMISSIONS ENABLED</p>
                </div>
                <div className="font-mono text-xs text-retro-neon">
                    USER: ADMIN
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-retro-grid">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setMessage(null); setErrorMsg(null); }}
                        className={`px-4 py-2 font-mono text-xs transition-colors ${
                            activeTab === tab.id 
                            ? 'bg-retro-neon text-black font-bold' 
                            : 'bg-black text-gray-400 hover:text-white border border-transparent hover:border-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notifications */}
            {message && (
                <div className="mb-6 p-4 border-l-4 border-retro-neon bg-retro-neon/5 text-retro-neon font-mono text-sm shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                    &gt; {message}
                </div>
            )}
            {errorMsg && (
                <div className="mb-6 p-4 border-l-4 border-retro-pink bg-retro-pink/5 text-retro-pink font-mono text-sm shadow-[0_0_10px_rgba(255,0,255,0.1)]">
                    &gt; ERROR: {errorMsg}
                </div>
            )}

            {/* Content Area */}
            <div className="bg-retro-dark border border-retro-grid p-6 relative">
                {activeTab === 'NEWS' && (
                    <NewsForm onSuccess={handleSuccess} onError={setErrorMsg} />
                )}

                {activeTab === 'FABRICATOR' && (
                    <ManufacturerForm onSuccess={handleSuccess} onError={setErrorMsg} />
                )}

                {activeTab === 'CONSOLE' && (
                    <ConsoleForm 
                        manufacturers={manufacturers} 
                        onConsoleCreated={handleConsoleCreated} 
                        onError={setErrorMsg} 
                    />
                )}

                {activeTab === 'VARIANTS' && (
                    <VariantForm 
                        consoleList={consoleList} 
                        preSelectedConsoleId={newlyCreatedConsoleId}
                        onSuccess={handleSuccess} 
                        onError={setErrorMsg} 
                    />
                )}

                {activeTab === 'GAME' && (
                    <GameForm onSuccess={handleSuccess} onError={setErrorMsg} />
                )}

                {activeTab === 'SETTINGS' && (
                    <SettingsForm 
                        customLogo={customLogo} 
                        onLogoUpdate={setCustomLogo} 
                        onSuccess={handleSuccess} 
                    />
                )}
            </div>
        </div>
    );
}