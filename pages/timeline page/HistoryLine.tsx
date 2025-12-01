
import { useEffect, useState, type FC } from 'react';
import { fetchTimelineData } from '../../services/dataService';
import { TimelineEvent } from '../../types';

const HistoryLine: FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const data = await fetchTimelineData();
        setEvents(data);
        if(data.length > 0) setSelectedEvent(data[0]);
        setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-3xl font-pixel text-center text-retro-pink mb-10 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            HISTORY LINE
        </h2>

        {loading ? (
            <div className="text-center font-mono text-retro-neon animate-pulse">
                INITIALIZING TEMPORAL CIRCUITS...
            </div>
        ) : (
            <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
                {/* Timeline Axis */}
                <div className="md:w-1/3 relative border-l-4 border-retro-grid ml-4 md:ml-0 overflow-y-auto max-h-[600px] custom-scrollbar pr-4">
                    {events.map((evt, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedEvent(evt)}
                            className={`relative pl-8 pb-10 cursor-pointer group transition-all`}
                        >
                            {/* Node */}
                            <div className={`absolute -left-[11px] top-0 w-5 h-5 border-2 rounded-full transition-all duration-300 ${
                                selectedEvent === evt ? 'bg-retro-neon border-retro-neon scale-125 shadow-[0_0_10px_rgba(0,255,157,1)]' : 'bg-retro-dark border-retro-grid group-hover:border-retro-blue'
                            }`}></div>
                            
                            <div className={`font-pixel text-xs mb-1 ${
                                selectedEvent === evt ? 'text-retro-neon' : 'text-gray-500 group-hover:text-retro-blue'
                            }`}>
                                {evt.year}
                            </div>
                            <div className={`font-mono text-lg font-bold ${
                                selectedEvent === evt ? 'text-white' : 'text-gray-400 group-hover:text-white'
                            }`}>
                                {evt.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                <div className="md:w-2/3">
                    {selectedEvent && (
                        <div className="sticky top-4 border-2 border-retro-blue bg-retro-dark p-8 shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all duration-500">
                            <div className="flex justify-between items-center mb-6 border-b border-retro-grid pb-4">
                                <h3 className="text-4xl font-pixel text-white">{selectedEvent.year}</h3>
                                <span className="font-mono text-retro-pink border border-retro-pink px-2 py-1 text-xs">
                                    {selectedEvent.manufacturer.toUpperCase()}
                                </span>
                            </div>
                            <h4 className="text-2xl font-mono text-retro-blue mb-6">
                                {selectedEvent.name}
                            </h4>
                            <p className="font-mono text-gray-300 text-lg leading-relaxed">
                                {selectedEvent.description}
                            </p>
                            
                            <div className="mt-8 pt-6 border-t border-retro-grid/50 flex gap-4">
                                <div className="h-2 flex-1 bg-retro-grid overflow-hidden">
                                    <div className="h-full bg-retro-neon w-2/3 animate-pulse"></div>
                                </div>
                                <div className="font-pixel text-[10px] text-gray-500">
                                    MARKET IMPACT
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default HistoryLine;
