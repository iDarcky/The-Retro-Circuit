'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { executeTerminalCommand } from '../../app/admin/actions';

type HistoryItem = {
    type: 'input' | 'output';
    content: string;
    isError?: boolean;
};

export function Terminal() {
    const [history, setHistory] = useState<HistoryItem[]>([
        { type: 'output', content: 'RETRO CIRCUIT DEBUG CONSOLE v1.0.0' },
        { type: 'output', content: 'TYPE "help" FOR AVAILABLE COMMANDS.' },
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on mount and click
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isProcessing) {
            const command = input.trim();
            if (!command) return;

            // Add input to history
            setHistory(prev => [...prev, { type: 'input', content: command }]);
            setInput('');
            setIsProcessing(true);

            // Client-side commands
            if (command.toLowerCase() === 'clear') {
                setHistory([]);
                setIsProcessing(false);
                return;
            }

            if (command.toLowerCase() === 'help') {
                const helpText =
`AVAILABLE COMMANDS:
-------------------
status    - Check database connection & latency
stats     - View system record counts
users [n] - List recent n users (default 5)
env       - View safe environment variables
clear     - Clear terminal screen
help      - Show this message`;

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
