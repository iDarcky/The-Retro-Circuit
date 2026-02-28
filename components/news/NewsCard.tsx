import React from 'react';
import Link from 'next/link';
import { NewsItem } from '@/lib/types/news';

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <Link href={`/news/${news.slug}`} className="block group">
      <div className="relative border border-border-subtle bg-bg-primary/40 p-6 flex flex-col md:flex-row gap-6 hover:border-violet-500/50 hover:bg-violet-950/5 transition-all duration-300">

        {/* Date / Metadata */}
        <div className="flex flex-col md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-border-subtle pb-4 md:pb-0 md:pr-4">
           <span className="font-pixel text-4xl text-violet-500/80 leading-none mb-2">
              {new Date(news.published_at).getDate().toString().padStart(2, '0')}
           </span>
           <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              {new Date(news.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
           </span>
           <span className="mt-4 font-mono text-[10px] text-violet-400 uppercase tracking-widest border border-violet-500/20 px-2 py-1 bg-violet-500/5 w-fit">
              {news.category}
           </span>
        </div>

        {/* Content */}
        <div className="flex-1">
            <h3 className="font-bold text-xl md:text-2xl text-text-primary group-hover:text-violet-400 transition-colors leading-tight mb-3 font-sans tracking-tight">
                {news.title}
            </h3>
            <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-4 line-clamp-2">
                {news.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-violet-500 uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                Read More <span>→</span>
            </div>
        </div>

        {/* Image (Optional / Small) */}
        <div className="hidden md:block w-32 h-32 bg-gray-900 border border-border-strong/5 shrink-0 relative overflow-hidden group-hover:border-violet-500/30 transition-colors">
            {/* Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-700 font-pixel">
                NO IMG
            </div>
        </div>

      </div>
    </Link>
  );
};
