'use client';

import { useEffect } from 'react';

const LOG_KEY = 'RETRO_DEBUG_LOGS';
const MONITOR_KEY = 'RETRO_DEBUG_MONITOR';

export default function DebugObserver() {
    useEffect(() => {
        // 1. Initialize Monitor State
        const isMonitoring = localStorage.getItem(MONITOR_KEY) === 'true';

        // 2. Monkey Patch Console.error if monitoring
        if (isMonitoring) {
            const originalError = console.error;
            console.error = (...args) => {
                try {
                    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
                    const newLog = {
                        type: 'error',
                        content: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem(LOG_KEY, JSON.stringify([...logs, newLog].slice(-50))); // Keep last 50
                } catch (e) {
                    // Ignore persistence errors
                }
                originalError.apply(console, args);
            };
        }

        // 3. Listen for Toggle Events (from Terminal)
        const handleMonitorUpdate = (e: CustomEvent) => {
            const active = e.detail?.active;
            if (active) {
                localStorage.setItem(MONITOR_KEY, 'true');
                // Reload to apply monkey patch?
                // Better: Just apply it dynamically, but for now simple reload or next nav works.
                // But the user wants seamless.
                console.log('DEBUG MONITOR ENABLED');
            } else {
                localStorage.setItem(MONITOR_KEY, 'false');
                console.log('DEBUG MONITOR DISABLED');
            }
        };

        window.addEventListener('RETRO_MONITOR_UPDATE', handleMonitorUpdate as EventListener);

        // 4. Global Error Handler
        const handleGlobalError = (event: ErrorEvent) => {
            if (localStorage.getItem(MONITOR_KEY) === 'true') {
                 const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
                 logs.push({
                     type: 'error',
                     content: `UNCAUGHT: ${event.message} at ${event.filename}:${event.lineno}`,
                     timestamp: new Date().toISOString()
                 });
                 localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-50)));
            }
        };
        window.addEventListener('error', handleGlobalError);

        return () => {
            window.removeEventListener('RETRO_MONITOR_UPDATE', handleMonitorUpdate as EventListener);
            window.removeEventListener('error', handleGlobalError);
        };
    }, []);

    return null; // Headless component
}
