export type SignalType = 'status' | 'alert' | 'update' | 'thought';

export interface Signal {
  id: string;
  content: string;
  type: SignalType;
  created_at: string;
  is_active: boolean;
}

export interface Review {
  id: string;
  console_id: string;
  console_slug: string;
  console_name: string;
  title: string;
  summary: string;
  score: number; // 0-10 or 0-100
  published_at: string;
  author: string;
  image_url: string;
  pros: string[];
  cons: string[];
}

export type NewsCategory = 'announcement' | 'rumor' | 'release' | 'guide';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // Full content for detail page
  published_at: string;
  image_url: string;
  category: NewsCategory;
  author: string;
}
