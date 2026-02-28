import React from 'react';

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  color?: 'cyan' | 'rose' | 'emerald' | 'violet' | 'orange';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, subtitle, color = 'cyan' }) => {
  const colorMap = {
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10 shadow-[0_0_15px_-3px_rgba(34,211,238,0.1)]',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-950/10 shadow-[0_0_15px_-3px_rgba(251,113,133,0.1)]',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_15px_-3px_rgba(52,211,153,0.1)]',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-950/10 shadow-[0_0_15px_-3px_rgba(167,139,250,0.1)]',
    orange: 'text-orange-400 border-orange-500/30 bg-orange-950/10 shadow-[0_0_15px_-3px_rgba(251,146,60,0.1)]',
  };

  const accentColor = colorMap[color];
  const pulseColor = color === 'cyan' ? 'bg-cyan-500' :
                     color === 'rose' ? 'bg-rose-500' :
                     color === 'emerald' ? 'bg-emerald-500' :
                     color === 'violet' ? 'bg-violet-500' : 'bg-orange-500';

  return (
    <div className="flex flex-col items-start gap-4 mb-8">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] md:text-xs font-mono uppercase tracking-widest backdrop-blur-sm ${accentColor}`}>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${pulseColor}`}></div>
        {number} {'//'} {subtitle || 'SECTION'}
      </div>
      <h2 className="text-2xl md:text-4xl font-pixel text-text-primary tracking-tighter uppercase">
        {title}<span className={`animate-pulse ${pulseColor.replace('bg-', 'text-')}`}>_</span>
      </h2>
    </div>
  );
};
