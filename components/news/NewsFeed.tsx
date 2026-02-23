import React from 'react';
import { NewsItem } from '@/lib/types/news';
import { NewsCard } from './NewsCard';

interface NewsFeedProps {
  news: NewsItem[];
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <div className="flex flex-col gap-4">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
};
