
import React, { useEffect, useState, useCallback } from 'react';
import { fetchRetroNews, addNewsItem } from '../services/geminiService';
import { NewsItem } from '../types';
import Button from './Button';
import { Link } from 'react-router-dom';
import RetroLoader from './RetroLoader';

interface NewsSectionProps {
  limit?: number;
  showAddForm?: boolean;
  compact?: boolean;
}

type NewsCategory = 'Hardware' | 'Software' | 'Industry' | 'Rumor';

const NewsSection: React.FC<NewsSectionProps> = ({ 
  limit, 
  showAddForm = true, 
  compact = false 
}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // 10 is divisible by 2 (md:grid-cols-2) and 1 (sm:grid-cols-1)
  const ITEMS_PER_PAGE = compact ? (limit || 3) : 10; 

  // Form State
  const [showTransmitter, setShowTransmitter] = useState(false);
  const [newHeadline, setNewHeadline] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCategory, setNewCategory] = useState<NewsCategory>('Hardware');
  const [submitting, setSubmitting] = useState(false);

  const loadNews = useCallback(async (pageNum: number, category: string) => {
    setLoading(true);
    setError(null);
    if (!compact) window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const { data, count } = await fetchRetroNews(pageNum, ITEMS_PER_PAGE, category);
      setNews(data); 
      setTotalCount(count);
    } catch (e) {
      setError("NO CONNECTION TO MAINFRAME. CHECK SUPABASE CONFIG.");
    } finally {
      setLoading(false);
    }
  }, [compact, ITEMS_PER_PAGE]);

  useEffect(() => {
    loadNews(page, selectedCategory);
  }, [page, selectedCategory, loadNews]);

  const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
      setPage(1); // Reset to first page on filter change
  };

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
          setPage(1);
          await loadNews(1, selectedCategory);
      } else {
          alert("TRANSMISSION FAILED: CHECK DATABASE PERMISSIONS (RLS)");
      }
      setSubmitting(false);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Style helpers for tags and filters
  const getCategoryColor = (cat: string) => {
      switch(cat) {
          case 'Hardware': return 'text-retro-blue border-retro-blue hover:bg-retro-blue hover:text-retro-dark';
          case 'Software': return 'text-retro-pink border-retro-pink hover:bg-retro-pink hover:text-retro-dark';
          case 'Industry': return 'text-retro-neon border-retro-neon hover:bg-retro-neon hover:text-retro-dark';
          case 'Rumor': return 'text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-retro-dark';
          default: return 'text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-retro-dark';
      }
  };

  const getTagStyle = (cat: string) => {
    switch(cat) {
        case 'Hardware': return 'bg-retro-blue text-retro-dark';
        case 'Software': return 'bg-retro-pink text-retro-dark';
        case 'Industry': return 'bg-retro-neon text-retro-dark';
        case 'Rumor': return 'bg-yellow-400 text-retro-dark';
        default: return 'bg-gray-400 text-retro-dark';
    }
};

  return (
    <div className={`w-full ${compact ? '' : 'max-w-6xl mx-auto p-4'}`}>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-retro-grid pb-4 gap-4">
        <div>
          <h2 className={`${compact ? 'text-xl' : 'text-3xl'} font-pixel text-retro-neon mb-2 drop-shadow-[2px_2px_0_rgba(255,0,255,0.5)]`}>
            {compact ? 'LATEST SIGNALS' : 'CIRCUIT FEED'}
          </h2>
          {!compact && <p className="font-mono text-gray-400">Latest signals from the golden age.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
            {showAddForm && (
              <Button onClick={() => setShowTransmitter(!showTransmitter)} variant="secondary" className="text-xs">
                 {showTransmitter ? 'CLOSE' : 'BROADCAST'}
              </Button>
            )}
            {!compact && (
              <Button onClick={() => loadNews(1, selectedCategory)} isLoading={loading} variant="primary" className="text-xs">
                REFRESH
              </Button>
            )}
            {compact && (
               <Link to="/news">
                 <button className="font-mono text-xs text-retro-blue hover:text-retro-neon border border-retro-blue hover:border-retro-neon px-3 py-2 transition-colors uppercase">
                   View Archive
                 </button>
               </Link>
            )}
        </div>
      </div>

      {/* FILTER BAR (Only in Full View) */}
      {!compact && (
          <div className="flex flex-wrap gap-3 mb-8">
              <button 
                  onClick={() => handleCategoryChange('ALL')}
                  className={`font-mono text-xs px-4 py-1 border transition-all ${
                      selectedCategory === 'ALL' 
                      ? 'bg-white text-retro-dark border-white font-bold' 
                      : 'text-gray-400 border-gray-600 hover:border-white hover:text-white'
                  }`}
              >
                  ALL SIGNALS
              </button>
              {['Hardware', 'Software', 'Industry', 'Rumor'].map(cat => {
                  const isActive = selectedCategory === cat;
                  const colors = getCategoryColor(cat);
                  // Split color string to get base border/text vs active bg logic
                  // Simplified: if active, invert colors manually based on category
                  let activeClass = '';
                  if (isActive) {
                      if (cat === 'Hardware') activeClass = 'bg-retro-blue text-retro-dark border-retro-blue';
                      else if (cat === 'Software') activeClass = 'bg-retro-pink text-retro-dark border-retro-pink';
                      else if (cat === 'Industry') activeClass = 'bg-retro-neon text-retro-dark border-retro-neon';
                      else if (cat === 'Rumor') activeClass = 'bg-yellow-400 text-retro-dark border-yellow-400';
                  } else {
                      activeClass = colors; // Use the hover classes defined in helper
                  }

                  return (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`font-mono text-xs px-4 py-1 border transition-all uppercase ${activeClass}`}
                    >
                        {cat}
                    </button>
                  );
              })}
          </div>
      )}

      {showAddForm && showTransmitter && (
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
        <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-6`}>
            {[1, 2].map((i) => (
                <div key={i} className="h-32 border border-retro-grid bg-retro-grid/20 animate-pulse rounded p-4">
                    <div className="h-4 bg-retro-grid/50 w-3/4 mb-4"></div>
                    <div className="h-24 bg-retro-grid/30 w-full"></div>
                </div>
            ))}
        </div>
      ) : news.length === 0 && !error ? (
         <div className="text-center py-12 border border-retro-grid border-dashed text-gray-500 font-mono">
             <div className="mb-4">NO SIGNAL FOUND FOR THIS FREQUENCY.</div>
             {selectedCategory !== 'ALL' && (
                 <button onClick={() => handleCategoryChange('ALL')} className="text-retro-blue underline text-xs">RESET FREQUENCY</button>
             )}
         </div>
      ) : (
        <>
            <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-6`}>
            {news.map((item, index) => (
                <article key={`${index}-${item.date}`} className={`group relative border-2 border-retro-grid bg-retro-dark hover:border-retro-neon transition-colors duration-300 ${compact ? 'p-4' : 'p-6'} overflow-hidden`}>
                <div className="absolute top-0 right-0 bg-retro-grid text-retro-neon text-xs font-mono px-2 py-1">
                    {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="mb-3">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            if(!compact) handleCategoryChange(item.category);
                        }}
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold font-mono mb-2 uppercase ${getTagStyle(item.category)} ${!compact ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
                        title={!compact ? "Filter by this category" : ""}
                    >
                        {item.category}
                    </button>
                    <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold font-mono text-retro-blue group-hover:text-retro-neon transition-colors leading-tight`}>
                    {item.headline}
                    </h3>
                </div>
                <p className={`text-gray-400 font-mono text-sm leading-relaxed border-l-2 border-retro-grid pl-4 ${compact ? 'line-clamp-3' : ''}`}>
                    {item.summary}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-retro-pink via-retro-neon to-retro-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </article>
            ))}
            </div>

            {/* Pagination Controls (Only show in full mode) */}
            {!compact && totalPages > 1 && (
                 <div className="flex justify-center items-center gap-4 py-8 border-t border-retro-grid/30 mt-8">
                     <Button 
                         variant="secondary" 
                         onClick={() => setPage(p => Math.max(1, p - 1))}
                         disabled={page === 1}
                     >
                         &lt; PREV
                     </Button>
                     
                     <div className="font-pixel text-xs text-retro-neon bg-retro-grid/20 px-4 py-2 rounded">
                         PAGE {page} OF {totalPages}
                     </div>
 
                     <Button 
                         variant="secondary" 
                         onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                         disabled={page >= totalPages}
                     >
                         NEXT &gt;
                     </Button>
                 </div>
            )}
        </>
      )}
    </div>
  );
};

export default NewsSection;
