'use client';

import { useEffect } from 'react';

const MONITOR_KEY = 'RETRO_DEBUG_MONITOR';
const LOGS_KEY = 'RETRO_DEBUG_LOGS';
const MAX_LOGS = 100;

export default function DebugObserver() {
    useEffect(() => {
        // Prevent double patching
        // @ts-ignore
        if (typeof window === 'undefined' || window.__DEBUG_OBSERVER_ACTIVE) return;

        const checkMonitor = () => {
            const isActive = localStorage.getItem(MONITOR_KEY) === 'true';

            // @ts-ignore
            if (isActive && !window.__DEBUG_OBSERVER_PATCHED) {
                patchConsole();
            }
        };

        const patchConsole = () => {
            // @ts-ignore
            window.__DEBUG_OBSERVER_PATCHED = true;

            // 1. Patch console.error
            const originalError = console.error;
            console.error = (...args) => {
                originalError(...args);
                persistLog({
                    type: 'output',
                    content: `[LOG] ${args.map(a => String(a)).join(' ')}`,
                    isError: true,
                    timestamp: Date.now()
                });
            };

            // 2. Patch window.onerror
            const errorHandler = (event: ErrorEvent) => {
                persistLog({
                    type: 'output',
                    content: `[CRASH] ${event.message} @ ${event.filename}:${event.lineno}`,
                    isError: true,
                    timestamp: Date.now()
                });
            };
            window.addEventListener('error', errorHandler);

            console.log('[DebugObserver] Console patched for monitoring.');
        };

        const persistLog = (item: any) => {
            try {
                const raw = localStorage.getItem(LOGS_KEY);
                const logs = raw ? JSON.parse(raw) : [];

                // Append and slice
                const newLogs = [...logs, item].slice(-MAX_LOGS);
                localStorage.setItem(LOGS_KEY, JSON.stringify(newLogs));
            } catch (e) {
                // Fail silently to avoid loops
            }
        };

        // Initial check
        checkMonitor();

        // Listen for storage changes (to turn on/off dynamically)
        const storageHandler = (e: StorageEvent) => {
            if (e.key === MONITOR_KEY) {
                if (e.newValue === 'true') location.reload(); // Force reload to apply patches cleanly? Or just check?
                // For now, simpler: we check on mount. The Terminal forces a reload or we accept that turning ON requires a refresh for full coverage?
                // Actually, strictly patching dynamically is better.
                if (e.newValue === 'true') checkMonitor();
            }
        };
        window.addEventListener('storage', storageHandler);

        // @ts-ignore
        window.__DEBUG_OBSERVER_ACTIVE = true;

        return () => {
             window.removeEventListener('storage', storageHandler);
        };
    }, []);

    return null; // Invisible component
}
