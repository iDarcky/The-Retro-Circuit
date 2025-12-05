
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
    
    // Shared Data needed by multiple forms
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [consoleList, setConsoleList] = useState<{name: string, id: string}[]>([]);
    const [customLogo, setCustomLogo] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            console.log('[AdminPage] Initializing Admin Portal...');
            try {
                const admin = await retroAuth.isAdmin();
                console.log('[AdminPage] Admin Check Result:', admin);
                setIsAdmin(admin);
                
                if (admin) {
                    const user = await retroAuth.getUser();
                    console.log('[AdminPage] Authenticated User:', user?.email);

                    // Fetch initial data
                    const [manus, consoles] = await Promise.all([
                        fetchManufacturers(),
                        fetchConsoleList()
                    ]);
                    setManufacturers(manus);
                    setConsoleList(consoles as any);
                    
                    const savedLogo = localStorage.getItem('retro_custom_logo');
                    if (savedLogo) setCustomLogo(savedLogo);
                } else {
                    console.warn('[AdminPage] User is not an admin.');
                }
            } catch (e) {
                console.error('[AdminPage] Initialization Error:', e);
            }
            setLoading(false);
        };
        check();
    }, []);

    const handleSuccess = (msg: string) => {
        console.log('[AdminPage] Action Success:', msg);
        setMessage(msg);
        setErrorMsg(null);
        // Refresh lists if needed based on active tab
        if (activeTab === 'FABRICATOR') fetchManufacturers().then(setManufacturers);
        if (activeTab === 'CONSOLE') fetchConsoleList().then(list => setConsoleList(list as any));
    };

    const handleError = (msg: string) => {
        console.error('[AdminPage] Action Error:', msg);
        setErrorMsg(msg);
        setMessage(null);
    };

    const handleTabChange = (tab: AdminTab) => {
        console.log('[AdminPage] Tab Changed to:', tab);
        setActiveTab(tab);
        setMessage(null);
        setErrorMsg(null);
    };

    if (loading) return <div className="p-10 text-center font-mono text-retro-neon">VERIFYING CLEARANCE...</div>;

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-red-600 font-pixel flex-col gap-4">
                <div className="text-6xl">ACCESS DENIED</div>
                <div className="font-mono text-white">SECURITY LEVEL TOO LOW</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 font-mono text-gray-300">
            <div className="border-b-4 border-retro-neon pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <h1 className="text-3xl md:text-4xl font-pixel text-retro-neon">ROOT TERMINAL</h1>
                <div className="text-xs text-retro-blue font-bold tracking-widest border border-retro-blue px-2 py-1">ADMIN_MODE_ACTIVE</div>
            </div>

            {message && <div className="bg-retro-grid border border-retro-neon text-retro-neon p-4 mb-6 animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.2)]">&gt; {message}</div>}
            
            {errorMsg && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 mb-6 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    <div className="font-bold mb-1">⚠ ERROR</div>
                    <div className="break-words">{errorMsg}</div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {(['NEWS', 'FABRICATOR', 'CONSOLE', 'VARIANTS', 'GAME', 'SETTINGS'] as AdminTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`flex-shrink-0 px-6 py-3 border-2 transition-all font-pixel text-xs md:text-sm ${activeTab === tab ? 'border-retro-neon text-retro-neon bg-retro-neon/10 shadow-[0_0_15px_rgba(0,255,157,0.2)]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
                    >
                        {tab === 'SETTINGS' ? 'SETTINGS' : `ADD ${tab}`}
                    </button>
                ))}
            </div>

            <div className="border-2 border-retro-grid p-4 md:p-8 bg-retro-dark shadow-xl min-h-[500px]">
                {activeTab === 'NEWS' && <NewsForm onSuccess={handleSuccess} onError={handleError} />}
                {activeTab === 'FABRICATOR' && <ManufacturerForm onSuccess={handleSuccess} onError={handleError} />}
                {activeTab === 'CONSOLE' && <ConsoleForm manufacturers={manufacturers} onSuccess={handleSuccess} onError={handleError} />}
                {activeTab === 'VARIANTS' && <VariantForm consoleList={consoleList} onSuccess={handleSuccess} onError={handleError} />}
                {activeTab === 'GAME' && <GameForm onSuccess={handleSuccess} onError={handleError} />}
                {activeTab === 'SETTINGS' && <SettingsForm customLogo={customLogo} onLogoUpdate={setCustomLogo} onSuccess={handleSuccess} />}
            </div>
        </div>
    );
}
