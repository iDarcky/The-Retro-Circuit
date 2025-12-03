'use client';

import { useState, useCallback, type FormEvent, type FC, type ChangeEvent } from 'react';
import Link from 'next/link';
import { fetchRetroNews, addNewsItem } from '../lib/api';
import { NewsItem, NewsCategory } from '../lib/types';
import Button from './ui/Button';
import RetroLoader from './ui/RetroLoader';

interface SignalFeedClientProps {
  initialNews: NewsItem[];
  initialCount: number;
  referenceData: {
      consoles: {name: string, slug: string}[],
      games: {title: string, slug: string, id: string}[]
  };
}

const SignalFeedClient: FC<SignalFeedClientProps> = ({ initialNews, initialCount, referenceData }) => {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  const ITEMS_PER_PAGE = 10; 

  // Form State
  const [showTransmitter, setShowTransmitter] = useState(false);
  const [newHeadline, setNewHeadline] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCategory, setNewCategory] = useState<NewsCategory>('Hardware');
  const [submitting, setSubmitting] = useState(false);

  const loadNews = useCallback(async (pageNum: number, category: string) => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const { data, count } = await fetchRetroNews(pageNum, ITEMS_PER_PAGE, category);
      setNews(data); 
      setTotalCount(count);
    } catch {
      setError("NO CONNECTION TO MAINFRAME. CHECK SUPABASE CONFIG.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
      setPage(1);
      loadNews(1, category);
  };

  const handleTransmit = async (e: FormEvent) => {
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

  const getRelatedLinks = (text: string) => {
      const lowerText = text.toLowerCase();
      const matches: { type: 'GAME' | 'CONSOLE', label: string, to: string }[] = [];

      referenceData.consoles.forEach(c => {
          const safeName = c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
          const regex = new RegExp(`\\b${safeName}\\b`, 'i');
          if (regex.test(lowerText)) {
              matches.push({ type: 'CONSOLE', label: c.name, to: `/console/${c.slug}` });
          }
      });

      referenceData.games.forEach(g => {
          const safeTitle = g.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
          const regex = new RegExp(`\\b${safeTitle}\\b`, 'i');
          if (regex.test(lowerText)) {
              matches.push({ type: 'GAME', label: g.title, to: `/archive/${g.slug || g.id}` });
          }
      });

      return matches;
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getCategoryColor = (cat: string) => {
      switch(cat) {
          case 'Hardware': return 'text-retro-blue border-retro-blue hover:bg-retro-blue hover:text-retro-dark';
          case 'Software': return 'text-retro-pink border-retro-pink hover:bg-retro-pink hover:text-retro-dark';
          case 'Industry': return 'text-retro-neon border-retro-neon hover:bg-retro-neon hover:text-retro-dark';
          case 'Rumor': return 'text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-retro-dark';
          case 'Mods': return 'text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-retro-dark';
          case 'Events': return 'text-orange-400 border-orange-400 hover:bg-orange-400 hover:text-retro-dark';
          case 'Homebrew': return 'text-green-400 border-green-400 hover:bg-green-400 hover:text-retro-dark';
          default: return 'text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-retro-dark';
      }
  };

  const getTagStyle = (cat: string) => {
    switch(cat) {
        case 'Hardware': return 'bg-retro-blue text-retro-dark';
        case 'Software': return 'bg-retro-pink text-retro-dark';
        case 'Industry': return 'bg-retro-neon text-retro-dark';
        case 'Rumor': return 'bg-yellow-400 text-retro-dark';
        case 'Mods': return 'bg-purple-400 text-retro-dark';
        case 'Events': return 'bg-orange-400 text-retro-dark';
        case 'Homebrew': return 'bg-green-400 text-retro-dark';
        default: return 'bg-gray-400 text-retro-dark';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-retro-grid pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-pixel text-retro-neon mb-2 drop-shadow-[2px_2px_0_rgba(255,0,255,0.5)]">
            SIGNAL FEED
          </h2>
          <p className="font-mono text-gray-400">Encrypted transmission stream.</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowTransmitter(!showTransmitter)} variant="secondary" className="text-xs">
                 {showTransmitter ? 'CLOSE' : 'BROADCAST'}
            </Button>
            <Button onClick={() => loadNews(1, selectedCategory)} isLoading={loading} variant="primary" className="text-xs">
                REFRESH
            </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
          <button 
              onClick={() => handleCategoryChange('ALL')}
              className={`font-mono text-xs px-4 py-1 border transition-all ${
                  selectedCategory === 'ALL' 
                  ? 'bg-white text-retro-dark border-white font-bold' 
                  : 'text-gray-400 border-gray-600 hover:border-white hover:text-white'
              }`}
          >
              ALL
          </button>
          {['Hardware', 'Software', 'Industry', 'Rumor', 'Mods', 'Events', 'Homebrew'].map(cat => {
              const isActive = selectedCategory === cat;
              const colors = getCategoryColor(cat);
              let activeClass = '';
              if (isActive) {
                  if (cat === 'Hardware') activeClass = 'bg-retro-blue text-retro-dark border-retro-blue';
                  else if (cat === 'Software') activeClass = 'bg-retro-pink text-retro-dark border-retro-pink';
                  else if (cat === 'Industry') activeClass = 'bg-retro-neon text-retro-dark border-retro-neon';
                  else if (cat === 'Rumor') activeClass = 'bg-yellow-400 text-retro-dark border-yellow-400';
                  else if (cat === 'Mods') activeClass = 'bg-purple-400 text-retro-dark border-purple-400';
                  else if (cat === 'Events') activeClass = 'bg-orange-400 text-retro-dark border-orange-400';
                  else if (cat === 'Homebrew') activeClass = 'bg-green-400 text-retro-dark border-green-400';
              } else {
                  activeClass = colors;
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

      {showTransmitter && (
          <div className="mb-10 p-6 border-2 border-dashed border-retro-neon bg-retro-neon/5">
              <h3 className="font-pixel text-sm text-retro-neon mb-4">INITIATING UPLINK SEQUENCE...</h3>
              <form onSubmit={handleTransmit} className="space-y-4">
                  <div>
                      <label className="block font-mono text-xs text-retro-blue mb-1">HEADLINE</label>
                      <input 
                        value={newHeadline}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewHeadline(e.target.value)}
                        className="w-full bg-black/50 border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                        placeholder="ENTER HEADLINE..."
                      />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/3">
                        <label className="block font-mono text-xs text-retro-blue mb-1">CATEGORY</label>
                        <select 
                            value={newCategory}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewCategory(e.target.value as any)}
                            className="w-full bg-black/50 border border-retro-grid p-2 text-white font-mono focus:border-retro-neon outline-none"
                        >
                            <option value="Hardware">HARDWARE</option>
                            <option value="Software">SOFTWARE</option>
                            <option value="Industry">INDUSTRY</option>
                            <option value="Rumor">RUMOR</option>
                            <option value="Mods">MODS</option>
                            <option value="Events">EVENTS</option>
                            <option value="Homebrew">HOMEBREW</option>
                        </select>
                    </div>
                  </div>
                  <div>
                      <label className="block font-mono text-xs text-retro-blue mb-1">SUMMARY</label>
                      <textarea 
                        value={newSummary}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewSummary(e.target.value)}
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
            SYSTEM FAILURE: {error}
        </div>
      )}

      {loading && !news.length ? (
           <RetroLoader />
      ) : news.length === 0 ? (
          <div className="text-center font-mono text-gray-500 py-12 border-2 border-dashed border-gray-800">
              NO SIGNALS FOUND ON THIS FREQUENCY.
          </div>
      ) : (
          <div className="space-y-6">
              {news.map((item, idx) => {
                  const links = getRelatedLinks(item.summary + " " + item.headline);
                  const tagStyle = getTagStyle(item.category);

                  return (
                    <div key={idx} className="bg-retro-dark border border-retro-grid p-6 relative overflow-hidden group hover:border-retro-neon transition-all">
                        <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-xs text-gray-600">
                             {new Date(item.date).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-start gap-4 mb-2">
                            <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${tagStyle}`}>
                                {item.category}
                            </span>
                        </div>

                        <h3 className="font-pixel text-lg text-white mb-2 group-hover:text-retro-neon transition-colors">
                            {item.headline}
                        </h3>
                        <p className="font-mono text-gray-400 text-sm leading-relaxed mb-4">
                            {item.summary}
                        </p>

                        {links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-retro-grid/30">
                                <span className="font-mono text-[10px] text-gray-500 pt-1">DETECTED REFERENCES:</span>
                                {links.map((link, i) => (
                                    <Link key={i} href={link.to} className="font-mono text-[10px] border border-retro-blue text-retro-blue px-2 py-0.5 hover:bg-retro-blue hover:text-black transition-colors">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                  );
              })}
          </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8 border-t border-retro-grid/30 mt-8">
            <Button 
                variant="secondary" 
                onClick={() => { setPage(p => p - 1); loadNews(page - 1, selectedCategory); }}
                disabled={page === 1}
                className="text-xs"
            >
                &lt; PREV
            </Button>
            
            <div className="font-pixel text-xs text-retro-neon bg-retro-grid/20 px-4 py-2 rounded">
                PAGE {page} OF {totalPages}
            </div>

            <Button 
                variant="secondary" 
                onClick={() => { setPage(p => p + 1); loadNews(page + 1, selectedCategory); }}
                disabled={page >= totalPages}
                className="text-xs"
            >
                NEXT &gt;
            </Button>
        </div>
      )}
    </div>
  );
};

export default SignalFeedClient;