'use client';

import { useState } from 'react';
import { RoadmapFeature } from '../../lib/types/domain';
import RoadmapCard from './RoadmapCard';

interface RoadmapViewProps {
  completedItems: RoadmapFeature[];
  upcomingItems: RoadmapFeature[];
}

type Tab = 'upcoming' | 'completed';

export default function RoadmapView({ completedItems, upcomingItems }: RoadmapViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const items = activeTab === 'upcoming' ? upcomingItems : completedItems;

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
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 text-sm font-mono uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'completed'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
            }`}
        >
            Mission Log
            <span className="ml-2 opacity-50 text-[10px]">{completedItems.length}</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in key={activeTab}">
        {items.map((item) => (
            <RoadmapCard key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
          <div className="py-24 text-center text-text-muted font-mono uppercase tracking-widest opacity-50 border border-dashed border-white/10">
              No Data Available
          </div>
      )}

    </div>
  );
}
