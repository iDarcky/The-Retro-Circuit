'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { executeTerminalCommand } from '../../app/admin/actions';

type HistoryItem = {
    type: 'input' | 'output';
    content: string;
    isError?: boolean;
    timestamp?: number;
};

const MONITOR_KEY = 'RETRO_DEBUG_MONITOR';
const LOGS_KEY = 'RETRO_DEBUG_LOGS';

export function Terminal() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load initial logs from LocalStorage
    useEffect(() => {
        const loadLogs = () => {
             const raw = localStorage.getItem(LOGS_KEY);
             if (raw) {
                 try {
                     const parsed = JSON.parse(raw);
                     setHistory(prev => {
                         // Merge with existing? Or just replace?
                         // Ideally we show the historical logs first.
                         // But for simplicity in this terminal, let's just prepend them if empty.
                         if (prev.length === 0) {
                             return [
                                 { type: 'output', content: 'RETRO CIRCUIT DEBUG CONSOLE v1.1.0' },
                                 { type: 'output', content: 'TYPE "help" FOR AVAILABLE COMMANDS.' },
                                 ...parsed
                             ];
                         }
                         return prev;
                     });
                 } catch (e) {
                     // Corrupt logs
                 }
             } else {
                 setHistory([
                     { type: 'output', content: 'RETRO CIRCUIT DEBUG CONSOLE v1.1.0' },
                     { type: 'output', content: 'TYPE "help" FOR AVAILABLE COMMANDS.' },
                 ]);
             }
        };
        loadLogs();
    }, []);

    // Polling LocalStorage for new logs (Sync with DebugObserver)
    useEffect(() => {
        const interval = setInterval(() => {
            const raw = localStorage.getItem(LOGS_KEY);
            if (!raw) return;

            try {
                const logs = JSON.parse(raw);
                // We need to compare specific unique logs or just length?
                // A simple approach: If local storage has more logs than we displayed (filtered by isError), update.
                // Or better: Just check the last timestamp.

                setHistory(prev => {
                    const lastKnown = prev.filter(p => p.timestamp).pop();
                    const newLogs = logs.filter((l: HistoryItem) => !lastKnown || (l.timestamp && l.timestamp > (lastKnown.timestamp || 0)));

                    if (newLogs.length > 0) {
                        return [...prev, ...newLogs];
                    }
                    return prev;
                });
            } catch (e) { }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isProcessing) {
            const command = input.trim();
            if (!command) return;

            // Add input to history
            const inputItem: HistoryItem = { type: 'input', content: command };
            setHistory(prev => [...prev, inputItem]);
            setInput('');
            setIsProcessing(true);

            // Client-side commands
            if (command.toLowerCase() === 'clear') {
                setHistory([]);
                localStorage.removeItem(LOGS_KEY); // Clear persisted logs too
                setIsProcessing(false);
                return;
            }

            if (command.toLowerCase().startsWith('monitor')) {
                const arg = command.split(' ')[1];
                if (arg === 'on') {
                     localStorage.setItem(MONITOR_KEY, 'true');
                     // Dispatch event for same-window DebugObserver to pick up
                     window.dispatchEvent(new Event('storage'));
                     // Manually patch if needed? No, let DebugObserver handle it via event or we can notify it directly if we exported a helper.
                     // But simpler: just force the 'storage' event which our Observer listens to (wait, it listens to window 'storage' which only fires cross-tab).
                     // We need a CUSTOM event.
                     window.dispatchEvent(new CustomEvent('RETRO_MONITOR_UPDATE', { detail: { active: true } }));

                     setHistory(prev => [...prev, { type: 'output', content: 'CLIENT MONITOR: ENGAGED.' }]);
                } else if (arg === 'off') {
                     localStorage.setItem(MONITOR_KEY, 'false');
                     window.dispatchEvent(new CustomEvent('RETRO_MONITOR_UPDATE', { detail: { active: false } }));

                     setHistory(prev => [...prev, { type: 'output', content: 'CLIENT MONITOR: DISENGAGED.' }]);
                } else {
                     setHistory(prev => [...prev, { type: 'output', content: 'USAGE: monitor <on|off>', isError: true }]);
                }
                setIsProcessing(false);
                return;
            }

            if (command.toLowerCase() === 'help') {
                const helpText =
`AVAILABLE COMMANDS:
-------------------
status       - Check database connection & latency
stats        - View system record counts
users [n]    - List recent n users (default 5)
inspect [t]  - Inspect record (table, id/slug)
trace [op]   - Trace operation (fetch_consoles)
performance  - Run server benchmark
monitor      - Capture client-side errors (on/off)
env          - View safe environment variables
clear        - Clear terminal screen
help         - Show this message`;

                setHistory(prev => [...prev, { type: 'output', content: helpText }]);
                setIsProcessing(false);
                return;
            }

            try {
                // Server-side commands
                const response = await executeTerminalCommand(command);
                setHistory(prev => [...prev, {
                    type: 'output',
                    content: response.output,
                    isError: response.type === 'error'
                }]);
            } catch (err) {
                setHistory(prev => [...prev, {
                    type: 'output',
                    content: 'CRITICAL FAILURE: UNABLE TO CONTACT SERVER.',
                    isError: true
                }]);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div
            className="w-full h-[600px] bg-black border-2 border-retro-neon p-4 font-mono text-sm overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,255,157,0.2)]"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Terminal Output Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pb-4">
                {history.map((item, idx) => (
                    <div key={idx} className={`${
                        item.type === 'input' ? 'text-cyan-400' :
                        item.isError ? 'text-retro-pink' : 'text-retro-neon'
                    }`}>
                        {item.type === 'input' ? '> ' : ''}
                        <span className="whitespace-pre-wrap">{item.content}</span>
                    </div>
                ))}

                {isProcessing && (
                    <div className="text-retro-neon animate-pulse">
                        EXECUTING...
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input Line */}
            <div className="flex items-center text-cyan-400 pt-2 border-t border-gray-800">
                <span className="mr-2">{'>'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-none outline-none text-cyan-400 placeholder-cyan-900 font-bold"
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                />
            </div>
        </div>
    );
}
