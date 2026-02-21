'use client';

import { type FC } from 'react';
import { RoadmapItem } from '../../data/roadmap';
import { CheckCircle2, Clock, Hourglass, Zap } from 'lucide-react';

const RoadmapCard: FC<{ item: RoadmapItem }> = ({ item }) => {
    let statusColor = 'text-zinc-500 border-zinc-800 bg-zinc-900/20';
    let StatusIcon = Hourglass;
    let opacity = 'opacity-60 grayscale';
    let accentColor = 'bg-zinc-800';

    if (item.status === 'completed') {
        statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_10px_-2px_rgba(16,185,129,0.1)] hover:bg-emerald-500/10 hover:border-emerald-500/50';
        StatusIcon = CheckCircle2;
        opacity = 'opacity-100';
        accentColor = 'bg-emerald-500';
    } else if (item.status === 'in-progress') {
        statusColor = 'text-blue-400 border-blue-500/30 bg-blue-500/5 shadow-[0_0_10px_-2px_rgba(59,130,246,0.1)] hover:bg-blue-500/10 hover:border-blue-500/50';
        StatusIcon = Clock;
        opacity = 'opacity-100';
        accentColor = 'bg-blue-500';
    } else {
        // Planned
        statusColor = 'text-zinc-400 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20';
        StatusIcon = Zap;
        opacity = 'opacity-75';
        accentColor = 'bg-white';
    }

    return (
        <div className={`relative p-6 rounded-none border transition-all duration-300 group flex flex-col justify-between h-full gap-4 ${statusColor} ${opacity}`}>

            {/* Top Bar: Category & Status */}
            <div className="flex justify-between items-start">
                 <div className="text-[10px] font-mono uppercase tracking-widest opacity-70 border border-white/10 px-2 py-0.5 rounded-full">
                     {item.category || 'Roadmap'}
                 </div>
                 <div className="mt-1">
                    <StatusIcon size={16} />
                 </div>
            </div>

            {/* Content */}
            <div>
                <h4 className="text-sm font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
                    {item.title}
                    {item.status === 'in-progress' && (
                        <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                        </span>
                    )}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-light">{item.description}</p>
            </div>

             {/* Footer: Date or ID */}
             <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <div className={`h-0.5 w-8 ${accentColor} opacity-50`}></div>
                  {item.date && <div className="text-[9px] font-mono uppercase tracking-widest opacity-50">{item.date}</div>}
             </div>
        </div>
    );
}

export default RoadmapCard;
