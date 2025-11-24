import React, { useEffect, useState } from 'react';
import { fetchRetroNews, addNewsItem } from '../services/geminiService';
import { NewsItem } from '../types';
import Button from './Button';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showTransmitter, setShowTransmitter] = useState(false);
  const [newHeadline, setNewHeadline] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCategory, setNewCategory] = useState<'Hardware' | 'Software' | 'Industry' | 'Rumor'>('Hardware');
  const [submitting, setSubmitting] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchRetroNews();
      setNews(items);
    } catch (e) {
      setError("NO CONNECTION TO MAINFRAME. CHECK SUPABASE CONFIG.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleTransmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newHeadline || !newSummary) return;

      setSubmitting(true);
      const newItem: NewsItem = {
          headline: newHeadline,
          summary: newSummary,
          category: newCategory,
          date: new Date().toISOString()
      };

      const success = await addNewsItem(newItem);
      
      if (success) {
          // Reset and Reload
          setNewHeadline('');
          setNewSummary('');
          setShowTransmitter(false);
          await loadNews();
      } else {
          alert("TRANSMISSION FAILED: CHECK DATABASE PERMISSIONS (RLS)");
      }
      setSubmitting(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-end mb-8 border-b-2 border-retro-grid pb-4">
        <div>
          <h2 className="text-3xl font-pixel text-retro-neon mb-2 drop-shadow-[2px_2px_0_rgba(255,0,255,0.5)]">
            CIRCUIT FEED
          </h2>
          <p className="font-mono text-gray-400">Latest signals from the golden age.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setShowTransmitter(!showTransmitter)} variant="secondary">
               {showTransmitter ? 'CLOSE UPLINK' : 'BROADCAST SIGNAL'}
            </Button>
            <Button onClick={loadNews} isLoading={loading} variant="primary">
            REFRESH
            </Button>
        </div>
      </div>

      {showTransmitter && (
          <div className="mb-10 p-6 border-2 border-dashed border-retro-neon bg-retro-neon/5">
              <h3 className="font-pixel text-sm text-retro-neon mb-4">INITIATING UPLINK SEQUENCE...</h3>
              <form onSubmit={handleTransmit} className="space-y-4">
                  <div>
                      <label className="block font-mono text-xs text-retro-blue mb-1">HEADLINE</label>
                      <input 
                        value={newHeadline}
                        onChange={e => setNewHeadline(e.target.value)}
                        className="w-full bg-black/50 border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                        placeholder="ENTER HEADLINE..."
                      />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/3">
                        <label className="block font-mono text-xs text-retro-blue mb-1">CATEGORY</label>
                        <select 
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as any)}
                            className="w-full bg-black/50 border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                        >
                            <option value="Hardware">HARDWARE</option>
                            <option value="Software">SOFTWARE</option>
                            <option value="Industry">INDUSTRY</option>
                            <option value="Rumor">RUMOR</option>
                        </select>
                    </div>
                  </div>
                  <div>
                      <label className="block font-mono text-xs text-retro-blue mb-1">SUMMARY</label>
                      <textarea 
                        value={newSummary}
                        onChange={e => setNewSummary(e.target.value)}
                        rows={3}
                        className="w-full bg-black/50 border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                        placeholder="ENTER SIGNAL DATA..."
                      />
                  </div>
                  <div className="flex justify-end">
                      <Button type="submit" isLoading={submitting} variant="danger">
                          TRANSMIT DATA
                      </Button>
                  </div>
              </form>
          </div>
      )}

      {error && (
        <div className="p-8 border-2 border-retro-pink text-retro-pink font-mono mb-6 bg-retro-pink/10 text-center">
          <h3 className="text-xl font-bold mb-2">ERROR: {error}</h3>
          <p className="text-sm opacity-75">Ensure your Supabase project is active and the 'news' table exists.</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 border border-retro-grid bg-retro-grid/20 animate-pulse rounded p-4">
              <div className="h-4 bg-retro-grid/50 w-3/4 mb-4"></div>
              <div className="h-4 bg-retro-grid/50 w-1/2 mb-2"></div>
              <div className="h-24 bg-retro-grid/30 w-full"></div>
            </div>
          ))}
        </div>
      ) : news.length === 0 && !error ? (
         <div className="text-center py-12 border border-retro-grid border-dashed text-gray-500 font-mono">
             <div className="mb-4">NO NEWS DATA FOUND IN DATABASE.</div>
             <p className="text-xs">Use "BROADCAST SIGNAL" to add test data.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <article key={index} className="group relative border-2 border-retro-grid bg-retro-dark hover:border-retro-neon transition-colors duration-300 p-6 overflow-hidden">
              <div className="absolute top-0 right-0 bg-retro-grid text-retro-neon text-xs font-mono px-2 py-1">
                {new Date(item.date).toLocaleDateString()}
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