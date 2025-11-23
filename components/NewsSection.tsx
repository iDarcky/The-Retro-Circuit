import React, { useEffect, useState } from 'react';
import { fetchRetroNews } from '../services/geminiService';
import { NewsItem } from '../types';
import Button from './Button';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchRetroNews();
      setNews(items);
    } catch (e) {
      setError("Failed to decode the signal from the past.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-end mb-8 border-b-2 border-retro-grid pb-4">
        <div>
          <h2 className="text-3xl font-pixel text-retro-neon mb-2 drop-shadow-[2px_2px_0_rgba(255,0,255,0.5)]">
            CIRCUIT FEED
          </h2>
          <p className="font-mono text-gray-400">Latest signals from the golden age.</p>
        </div>
        <Button onClick={loadNews} isLoading={loading} variant="primary">
          REFRESH SIGNAL
        </Button>
      </div>

      {error && (
        <div className="p-4 border border-retro-pink text-retro-pink font-mono mb-6 bg-retro-pink/10">
          ERROR: {error}
        </div>
      )}

      {loading && news.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 border border-retro-grid bg-retro-grid/20 animate-pulse rounded p-4">
              <div className="h-4 bg-retro-grid/50 w-3/4 mb-4"></div>
              <div className="h-4 bg-retro-grid/50 w-1/2 mb-2"></div>
              <div className="h-24 bg-retro-grid/30 w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <article key={index} className="group relative border-2 border-retro-grid bg-retro-dark hover:border-retro-neon transition-colors duration-300 p-6 overflow-hidden">
              <div className="absolute top-0 right-0 bg-retro-grid text-retro-neon text-xs font-mono px-2 py-1">
                {item.date}
              </div>
              <div className="mb-4">
                <span className={`inline-block px-2 py-0.5 text-xs font-bold font-mono mb-2 ${
                  item.category === 'Hardware' ? 'bg-retro-blue text-retro-dark' :
                  item.category === 'Software' ? 'bg-retro-pink text-retro-dark' :
                  item.category === 'Rumor' ? 'bg-yellow-400 text-retro-dark' :
                  'bg-retro-neon text-retro-dark'
                }`}>
                  {item.category.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold font-mono text-retro-blue group-hover:text-retro-neon transition-colors">
                  {item.headline}
                </h3>
              </div>
              <p className="text-gray-400 font-mono text-sm leading-relaxed border-l-2 border-retro-grid pl-4">
                {item.summary}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-retro-pink via-retro-neon to-retro-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;