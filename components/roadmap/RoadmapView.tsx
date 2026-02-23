'use client';

import { useState } from 'react';
import { RoadmapFeature, Release } from '../../lib/types/domain';
import RoadmapCard from './RoadmapCard';

interface RoadmapViewProps {
  releases: (Release & { roadmap_features: RoadmapFeature[] })[];
  upcomingItems: RoadmapFeature[];
}

type Tab = 'upcoming' | 'changelog';

export default function RoadmapView({ releases, upcomingItems }: RoadmapViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  return (
    <div className="w-full">

      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 mb-8">
        <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 text-sm font-mono uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
            }`}
        >
            Incoming Transmissions
            <span className="ml-2 opacity-50 text-[10px]">{upcomingItems.length}</span>
        </button>
        <button
            onClick={() => setActiveTab('changelog')}
            className={`px-6 py-3 text-sm font-mono uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'changelog'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
            }`}
        >
            Changelog
            <span className="ml-2 opacity-50 text-[10px]">{releases.length}</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {upcomingItems.map((item) => (
                <RoadmapCard key={item.id} item={item} />
            ))}
            {upcomingItems.length === 0 && (
                 <div className="col-span-full py-24 text-center text-text-muted font-mono uppercase tracking-widest opacity-50 border border-dashed border-white/10">
                    No Pending Features
                </div>
            )}
          </div>
      ) : (
          <div className="relative animate-fade-in">
              {/* Continuous Timeline Line */}
              <div className="absolute left-0 top-4 bottom-4 w-px bg-white/10 md:left-1/2 md:-ml-px"></div>

              <div className="space-y-12">
                  {releases.map((release, index) => (
                      <div key={release.id} className="relative pl-8 md:pl-0 group">

                          <div className={`flex flex-col md:flex-row items-center justify-between gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                               {/* Empty Spacer for Timeline centering */}
                               <div className="hidden md:block flex-1"></div>

                               {/* Timeline Dot */}
                               <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] top-8 w-2.5 h-2.5 bg-bg-primary border-2 border-emerald-500 rounded-full z-10 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>

                               {/* Card */}
                               <div className="flex-1 w-full bg-white/[0.02] border border-white/10 p-6 md:p-8 hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                                    <div className="flex flex-col gap-2 mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold font-pixel text-white">v{release.version}</span>
                                            <span className="text-emerald-500 text-[10px] border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 rounded-full uppercase tracking-widest">Released</span>
                                        </div>
                                        <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                                            {new Date(release.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        {release.title && (
                                            <h3 className="text-lg font-bold text-emerald-400 font-mono uppercase tracking-wide mt-1">
                                                // {release.title}
                                            </h3>
                                        )}
                                    </div>

                                    {release.description && (
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light border-l-2 border-white/5 pl-4">
                                            {release.description}
                                        </p>
                                    )}

                                    {release.roadmap_features && release.roadmap_features.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Included Updates</h4>
                                            <ul className="space-y-2">
                                                {release.roadmap_features.map(feat => (
                                                    <li key={feat.id} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                                                        <span className="text-emerald-500 mt-0.5">+</span>
                                                        <span>{feat.title}</span>
                                                        <span className="text-zinc-600 text-[10px] border border-zinc-800 px-1 ml-auto shrink-0 uppercase">{feat.category}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                               </div>
                          </div>
                      </div>
                  ))}
              </div>

              {releases.length === 0 && (
                 <div className="py-24 text-center text-text-muted font-mono uppercase tracking-widest opacity-50 border border-dashed border-white/10">
                    No Release History Logged
                </div>
              )}
          </div>
      )}
    </div>
  );
}
