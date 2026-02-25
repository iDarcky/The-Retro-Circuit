'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Signal, SignalType } from '@/lib/types/news';
import { createSignal, toggleSignalStatus } from '@/app/actions/signals';
import { SwissDropdown } from '../ui/SwissDropdown';

interface SignalManagerProps {
  signals: Signal[];
}

export const SignalManager: React.FC<SignalManagerProps> = ({ signals }) => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [type, setType] = useState<SignalType>('status');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createSignal(content, type);
      setContent('');
      router.refresh();
    } catch (error) {
      console.error('Failed to create signal:', error);
      alert('Failed to transmit signal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleSignalStatus(id, isActive);
      router.refresh();
    } catch (error) {
      console.error('Failed to toggle signal:', error);
      alert('Failed to update signal status.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">

      {/* Create Signal Form */}
      <div className="bg-black/80 border border-white/10 p-6">
        <h2 className="text-xl font-pixel text-emerald-500 mb-6 flex items-center gap-2">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           TRANSMIT SIGNAL
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Message Content</label>
             <textarea
               value={content}
               onChange={(e) => setContent(e.target.value)}
               className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-emerald-400 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none h-24"
               placeholder="> ENTER_TRANSMISSION..."
               required
             />
           </div>

           <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Signal Type</label>
               <SwissDropdown
                 value={type}
                 onChange={(val) => setType(val as SignalType)}
                 options={[
                   { label: 'STATUS_UPDATE', value: 'status' },
                   { label: 'ALERT', value: 'alert' },
                   { label: 'THOUGHT', value: 'thought' },
                   { label: 'SYS_UPDATE', value: 'update' }
                 ]}
                 labelPrefix="" inverted={false}
                 className="w-full"
                 buttonClassName="bg-black border border-white/20 p-3 text-sm font-mono text-white focus:border-emerald-500 focus:outline-none h-[46px] flex justify-between items-center"
               />
             </div>

             <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase text-xs px-6 py-3 transition-colors disabled:opacity-50"
                >
                 {isLoading ? 'TRANSMITTING...' : 'BROADCAST'}
               </button>
             </div>
           </div>
        </form>
      </div>

      {/* Signal List */}
      <div className="bg-black/40 border border-white/5 p-6">
        <h3 className="text-sm font-mono text-gray-500 uppercase mb-4">Transmission Log</h3>

        <div className="space-y-2">
          {signals.map((signal) => (
            <div key={signal.id} className={`flex items-start justify-between p-4 border ${signal.is_active ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-white/5 bg-black/20 opacity-50'}`}>

              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border ${signal.is_active ? 'text-emerald-400 border-emerald-500/30' : 'text-gray-500 border-gray-700'}`}>
                       {signal.type}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono">
                       {new Date(signal.created_at).toLocaleString()}
                    </span>
                 </div>
                 <p className="font-mono text-sm text-gray-300">
                    {signal.content}
                 </p>
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                 <button
                   onClick={() => handleToggle(signal.id, !signal.is_active)}
                   className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border transition-colors ${signal.is_active ? 'text-red-400 border-red-500/30 hover:bg-red-950/30' : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/30'}`}
                 >
                    {signal.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                 </button>
              </div>

            </div>
          ))}

          {signals.length === 0 && (
            <div className="text-center py-8 text-gray-600 font-mono text-xs">
               NO_SIGNALS_FOUND
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
