'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingTerminal() {
  const [output, setOutput] = useState<string[]>(['> SYSTEM INITIALIZED...', '> WAITING FOR INPUT...']);
  const [input, setInput] = useState('');
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newOutput = [...output, `> ${input}`];

    switch (cmd) {
      case 'help':
        newOutput.push('AVAILABLE COMMANDS:', '  ls        - List available modules', '  open [id] - Open a module', '  clear     - Clear terminal', '  whoami    - User info');
        break;
      case 'ls':
        newOutput.push('MODULES:', '  [0] console_vault', '  [1] vs_arena', '  [2] about_us');
        break;
      case 'open 0':
      case 'open console_vault':
        newOutput.push('LOADING CONSOLE VAULT...');
        setTimeout(() => router.push('/console'), 1000);
        break;
      case 'open 1':
      case 'open vs_arena':
        newOutput.push('LOADING VS ARENA...');
        setTimeout(() => router.push('/arena'), 1000);
        break;
      case 'clear':
        setOutput(['> CLEARED.']);
        setInput('');
        return;
      case 'whoami':
        newOutput.push('USER: GUEST', 'ACCESS LEVEL: READ_ONLY');
        break;
      default:
        newOutput.push(`ERROR: Command '${cmd}' not found. Type 'help'.`);
    }

    setOutput(newOutput);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono p-4 md:p-8 text-sm md:text-base overflow-hidden">
      <div className="max-w-3xl mx-auto border border-[#00ff00] h-[80vh] p-4 flex flex-col shadow-[0_0_20px_rgba(0,255,0,0.2)] bg-[#001100]">

          <div className="flex-1 overflow-y-auto space-y-1 pb-4 custom-scrollbar">
              <div className="mb-4 text-xs opacity-50">
                  RETRO CIRCUIT OS [Version 1.0.4]<br/>
                  (c) 2024 Retro Corp. All rights reserved.
              </div>
              {output.map((line, i) => (
                  <div key={i} className="break-words">{line}</div>
              ))}
              <div ref={bottomRef} />
          </div>

          <form onSubmit={handleCommand} className="flex gap-2 border-t border-[#00ff00] pt-2">
              <span>$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-[#00ff00] caret-[#00ff00]"
                autoFocus
                spellCheck={false}
              />
          </form>
      </div>
    </div>
  );
}
