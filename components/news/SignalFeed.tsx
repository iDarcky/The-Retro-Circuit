import React from 'react';
import { Signal } from '@/lib/types/news';

interface SignalFeedProps {
  signals: Signal[];
}

export const SignalFeed: React.FC<SignalFeedProps> = ({ signals }) => {
  return (
    <div className="w-full bg-bg-primary/80 border border-border-subtle p-4 md:p-6 overflow-hidden relative group">
      {/* Decorative */}
      <div className="absolute top-0 right-0 p-2 opacity-20">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
      </div>

      <h3 className="text-xs font-mono text-emerald-500 tracking-widest uppercase mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        Incoming Transmissions
      </h3>

      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
        {signals.map((signal) => (
          <div key={signal.id} className="border-l-2 border-emerald-900/50 pl-4 py-1 hover:border-emerald-500 transition-colors duration-300">
            <p className="font-mono text-sm text-emerald-100/90 leading-relaxed mb-1">
              {signal.content}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-500/60 font-mono uppercase tracking-wider">
              <span>{new Date(signal.created_at).toLocaleDateString()}</span>
              <span>{'//'}</span>
              <span>{signal.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
