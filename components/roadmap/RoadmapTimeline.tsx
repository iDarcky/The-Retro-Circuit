'use client';

import { type FC } from 'react';
import { RoadmapPhase, RoadmapItem } from '../../data/roadmap';
import { CheckCircle2, Clock, Hourglass } from 'lucide-react';

interface RoadmapTimelineProps {
  phases: RoadmapPhase[];
}

const RoadmapTimeline: FC<RoadmapTimelineProps> = ({ phases }) => {
  return (
    <div className="relative">
      {/* Central Line - Only visible on desktop, moved to left on mobile */}
      <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/50 to-transparent"></div>
      <div className="md:hidden absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/50 to-transparent"></div>

      <div className="flex flex-col gap-12 md:gap-24 relative py-12">
        {phases.map((phase, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={phase.id} className={`flex flex-col md:flex-row items-center w-full group ${isEven ? 'md:flex-row-reverse' : ''}`}>

              {/* Content Side */}
              <div className="w-full md:w-1/2 px-8 md:px-12 mb-8 md:mb-0">
                <div className={`flex flex-col gap-4 ${isEven ? 'md:text-left' : 'md:text-right text-left'}`}>

                   {/* Phase Header */}
                   <div className={`flex flex-col ${isEven ? 'items-start' : 'items-start md:items-end'}`}>
                      {/* Timeline label removed per request */}
                      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-2">{phase.title}</h2>
                      <p className="text-sm text-text-secondary font-light max-w-sm leading-relaxed">{phase.subtitle}</p>
                   </div>

                   {/* Items List */}
                   <div className={`flex flex-col gap-3 mt-4 w-full ${isEven ? 'items-start' : 'items-start md:items-end'}`}>
                      {phase.items.map((item) => (
                        <RoadmapItemCard key={item.id} item={item} alignRight={!isEven} />
                      ))}
                   </div>

                </div>
              </div>

              {/* Center Node (Timeline Marker) */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                 <div className="w-4 h-4 bg-bg-primary border-2 border-violet-500 rounded-full group-hover:scale-125 group-hover:bg-violet-500 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-500"></div>
              </div>

              {/* Empty Side (for Balance on Desktop) */}
              <div className="hidden md:block w-1/2"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RoadmapItemCard: FC<{ item: RoadmapItem; alignRight?: boolean }> = ({ item, alignRight }) => {
    let statusColor = 'text-zinc-500 border-zinc-800 bg-zinc-900/20';
    let StatusIcon = Hourglass;
    let opacity = 'opacity-60 grayscale';

    if (item.status === 'completed') {
        statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_-2px_rgba(16,185,129,0.2)]';
        StatusIcon = CheckCircle2;
        opacity = 'opacity-100';
    } else if (item.status === 'in-progress') {
        statusColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_-2px_rgba(245,158,11,0.2)]';
        StatusIcon = Clock;
        opacity = 'opacity-100';
    }

    return (
        <div className={`relative p-4 rounded-lg border w-full max-w-md transition-all duration-300 hover:scale-[1.02] ${statusColor} ${opacity}`}>
            <div className={`flex items-start gap-3 ${alignRight ? 'md:flex-row-reverse text-left md:text-right' : 'flex-row'}`}>
                <div className="mt-1 shrink-0">
                    <StatusIcon size={16} />
                </div>
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide mb-1 flex items-center gap-2 justify-start md:justify-start">
                        {item.title}
                        {item.status === 'in-progress' && (
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                        )}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                    {item.date && <div className="mt-2 text-[10px] font-mono uppercase tracking-widest opacity-70">{item.date}</div>}
                </div>
            </div>
        </div>
    );
}

export default RoadmapTimeline;
