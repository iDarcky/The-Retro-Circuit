export type RoadmapStatus = 'completed' | 'in-progress' | 'planned';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  category: string; // e.g., "Phase 1: Stability"
  date?: string;
}

export const completedItems: RoadmapItem[] = [
  {
    id: 'security-audit',
    title: 'Security Hardening',
    description: 'Fixed middleware auth bypass and verified RLS policies.',
    status: 'completed',
    category: 'Phase 1: Stability',
    date: 'Dec 2023'
  },
  {
    id: 'mobile-ux',
    title: 'Mobile Usability Upgrade',
    description: 'Increased text size and touch targets for better thumb accessibility.',
    status: 'completed',
    category: 'Phase 1: Stability',
    date: 'Jan 2024'
  }
];

export const upcomingItems: RoadmapItem[] = [
  {
    id: 'search-fix',
    title: 'Search Engine Core Fixes',
    description: 'Implement "No Results" state and keyboard navigation.',
    status: 'in-progress',
    category: 'Phase 1: Stability'
  },
  {
    id: 'game-search',
    title: 'Game-Based Search Engine',
    description: 'Allow users to search for "God of War" or "PS2" to find capable devices.',
    status: 'planned',
    category: 'Phase 2: Core Features'
  },
  {
    id: 'monetization',
    title: 'Affiliate Integration',
    description: 'Add Amazon/AliExpress price checking and buy buttons.',
    status: 'planned',
    category: 'Phase 2: Core Features'
  },
  {
    id: 'vs-mode',
    title: '3-Way Comparison Mode',
    description: 'Expand the Arena to support 3+ devices side-by-side.',
    status: 'planned',
    category: 'Phase 2: Core Features'
  },
  {
    id: 'seo-boost',
    title: 'SEO Overhaul',
    description: 'Dynamic metadata and JSON-LD structured data for Google Rich Snippets.',
    status: 'planned',
    category: 'Phase 2: Core Features'
  },
  {
    id: 'user-reviews',
    title: 'User Ratings System',
    description: 'Community star ratings for Ergonomics, Screen, and Battery.',
    status: 'planned',
    category: 'Phase 3: Engagement'
  },
  {
    id: 'news-engine',
    title: 'News & Content Engine',
    description: 'Launch the /news section and homepage "Latest Intel" widget.',
    status: 'planned',
    category: 'Phase 3: Engagement'
  },
  {
    id: 'social-cards',
    title: 'Dynamic Social Cards',
    description: 'Generate custom OG images for shared comparisons.',
    status: 'planned',
    category: 'Phase 3: Engagement'
  },
  {
    id: 'perf-tune',
    title: 'Performance Tuning',
    description: 'Optimize images and font loading for sub-second LCP.',
    status: 'planned',
    category: 'Phase 4: Polish'
  },
  {
    id: 'micro-interactions',
    title: 'Micro-Interactions',
    description: 'Add haptic feedback and "glitch" effects for immersion.',
    status: 'planned',
    category: 'Phase 4: Polish'
  },
  {
    id: 'launch',
    title: 'Public Launch v1.0',
    description: 'Official release to Reddit and Discord communities.',
    status: 'planned',
    category: 'Phase 4: Polish'
  }
];
