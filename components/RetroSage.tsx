import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import Button from './Button';

const RetroSage: React.FC = () => {
  // Initialize from LocalStorage or Default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('retro_sage_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load chat history", e);
    }
    return [{
      id: 'init',
      role: 'model',
      text: "GREETINGS, USER. I AM THE RETRO SAGE. ASK ME ANYTHING ABOUT THE 8-BIT, 16-BIT, OR 32-BIT ERAS.",
      timestamp: Date.now()
    }];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Persist messages whenever they change
  useEffect(() => {
    localStorage.setItem('retro_sage_history', JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(history, userMsg.text);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  const clearMemory = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "MEMORY CORE PURGED. READY FOR NEW INPUT.",
      timestamp: Date.now()
    }]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-xl font-pixel text-retro-pink">THE ORACLE</h2>
         <button onClick={clearMemory} className="text-[10px] font-mono text-retro-grid hover:text-retro-pink uppercase border border-retro-grid px-2 py-1">
           Purge Memory
         </button>
      </div>

      <div className="flex-1 border-2 border-retro-neon bg-black/50 p-4 overflow-y-auto mb-4 custom-scrollbar rounded-lg shadow-[inset_0_0_20px_rgba(0,255,157,0.2)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg relative border ${
              msg.role === 'user' 
                ? 'bg-retro-grid/50 border-retro-blue text-retro-blue' 
                : 'bg-retro-dark border-retro-neon text-retro-neon'
            }`}>
              <div className="font-pixel text-[10px] opacity-70 mb-1 absolute -top-3 left-2 bg-retro-dark px-2 border border-current">
                {msg.role === 'user' ? 'PLAYER 1' : 'RETRO SAGE'}
              </div>
              <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
             <div className="bg-retro-dark border border-retro-neon p-4 rounded-lg">
                <p className="font-mono text-retro-neon animate-pulse">PROCESSING QUERY...</p>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Insert Coin (or type message)..."
          className="flex-1 bg-retro-dark border-2 border-retro-grid text-retro-neon p-4 font-mono focus:border-retro-neon focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,157,0.3)] rounded"
        />
        <Button type="submit" isLoading={loading} variant="primary">
          SEND
        </Button>
      </form>
    </div>
  );
};

export default RetroSage;