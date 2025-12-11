import Link from 'next/link';
import { NewsItem } from '../lib/types';

interface DashboardSignalFeedProps {
  news: NewsItem[];
}

const DashboardSignalFeed = ({ news }: DashboardSignalFeedProps) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-4">
          <h3 className="font-pixel text-retro-neon text-lg">LATEST SIGNALS</h3>
          <Link href="/signals" className="text-xs font-mono text-retro-blue border border-retro-blue px-2 py-1 hover:bg-retro-blue hover:text-black transition-colors">
              VIEW ALL
          </Link>
       </div>
       {news.length === 0 ? (
          <div className="text-xs font-mono text-gray-500">NO SIGNALS DETECTED.</div>
       ) : (
          news.map((item, i) => (
            <div key={i} className="border-b border-retro-grid pb-4 last:border-0">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span className="text-retro-pink">{item.category}</span>
                </div>
                <Link href="/signals" className="font-mono text-sm text-white hover:text-retro-neon font-bold block mb-1">
                    {item.headline}
                </Link>
                <p className="text-xs text-gray-400 line-clamp-2 font-mono">{item.summary}</p>
            </div>
          ))
       )}
    </div>
  );
};

export default DashboardSignalFeed;
