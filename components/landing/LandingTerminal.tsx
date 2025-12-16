'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingTerminal() {
  const [history, setHistory] = useState<string[]>(['Welcome to The Circuit CLI v1.0.4', 'Type "help" for available commands.']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, `> ${cmd}`];

    switch (trimmed) {
      case 'help':
        newHistory.push(
            'AVAILABLE COMMANDS:',
            '  consoles    - List all consoles in database',
            '  arena       - Enter the comparison arena',
            '  status      - Check system status',
            '  clear       - Clear terminal output',
            '  login       - Access admin mainframe'
        );
        break;
      case 'consoles':
        newHistory.push('Redirecting to /console...');
        router.push('/console');
        break;
      case 'arena':
         newHistory.push('Redirecting to /arena...');
         router.push('/arena');
         break;
      case 'status':
        newHistory.push('SYSTEM: ONLINE', 'LATENCY: 12ms', 'DB_CONN: STABLE');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return; // Early return to avoid adding "clear" to empty history if we wanted that, but standard is to clear
      case 'login':
         newHistory.push('Initiating authentication sequence...');
         router.push('/login');
         break;
      case '':
        break;
      default:
        newHistory.push(`Command not found: ${trimmed}. Type "help" for assistance.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="w-full min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 overflow-y-auto text-sm md:text-base">
        <div className="max-w-3xl mx-auto border border-green-900/30 p-4 min-h-[80vh] shadow-[0_0_20px_rgba(0,255,0,0.05)] rounded bg-[#050505] flex flex-col">

            {/* Terminal Output */}
            <div className="flex-1 space-y-1">
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words">{line}</div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            {/* Input Line */}
            <div className="flex items-center gap-2 mt-4 border-t border-green-900/50 pt-4">
                <span className="text-green-300">user@thecircuit:~$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-900 focus:ring-0"
                    placeholder="type command..."
                    autoFocus
                />
            </div>

        </div>
    </div>
  );
}
