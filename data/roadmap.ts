export type RoadmapStatus = 'completed' | 'in-progress' | 'planned';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  date?: string; // e.g., "Q1 2024" or "March 15"
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  timeline: string; // e.g., "Days 1-7"
  items: RoadmapItem[];
}

export const roadmapData: RoadmapPhase[] = [
  {
    id: 'phase-1',
    title: 'PHASE 1: STABILITY & TRUST',
    subtitle: 'Fixing critical bugs, security holes, and mobile usability.',
    timeline: 'Days 1-7',
    items: [
      {
        id: 'security-audit',
        title: 'Security Hardening',
        description: 'Fix middleware auth bypass and verify RLS policies.',
        status: 'in-progress',
        date: 'Day 1-2'
      },
      {
        id: 'mobile-ux',
        title: 'Mobile Usability Upgrade',
        description: 'Increase text size and touch targets for better thumb accessibility.',
        status: 'planned',
        date: 'Day 3-4'
      },
      {
        id: 'search-fix',
        title: 'Search Engine Core Fixes',
        description: 'Implement "No Results" state and keyboard navigation.',
        status: 'planned',
        date: 'Day 5-7'
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'PHASE 2: REVENUE & CORE FEATURES',
    subtitle: 'Monetization, "Game-Based Search", and comparing devices.',
    timeline: 'Days 8-20',
    items: [
      {
        id: 'game-search',
        title: 'Game-Based Search Engine',
        description: 'Allow users to search for "God of War" or "PS2" to find capable devices.',
        status: 'planned',
        date: 'Day 8-10'
      },
      {
        id: 'monetization',
        title: 'Affiliate Integration',
        description: 'Add Amazon/AliExpress price checking and buy buttons.',
        status: 'planned',
        date: 'Day 11-14'
      },
      {
        id: 'vs-mode',
        title: '3-Way Comparison Mode',
        description: 'Expand the Arena to support 3+ devices side-by-side.',
        status: 'planned',
        date: 'Day 15-17'
      },
      {
        id: 'seo-boost',
        title: 'SEO Overhaul',
        description: 'Dynamic metadata and JSON-LD structured data for Google Rich Snippets.',
        status: 'planned',
        date: 'Day 18-20'
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'PHASE 3: ENGAGEMENT & CONTENT',
    subtitle: 'Keeping users on the site longer with reviews and news.',
    timeline: 'Days 21-30',
    items: [
      {
        id: 'user-reviews',
        title: 'User Ratings System',
        description: 'Community star ratings for Ergonomics, Screen, and Battery.',
        status: 'planned',
        date: 'Day 21-23'
      },
      {
        id: 'news-engine',
        title: 'News & Content Engine',
        description: 'Launch the /news section and homepage "Latest Intel" widget.',
        status: 'planned',
        date: 'Day 24-26'
      },
      {
        id: 'social-cards',
        title: 'Dynamic Social Cards',
        description: 'Generate custom OG images for shared comparisons.',
        status: 'planned',
        date: 'Day 27-30'
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'PHASE 4: POLISH & LAUNCH',
    subtitle: 'Performance tuning, analytics, and the "Wow" factor.',
    timeline: 'Days 31-40',
    items: [
      {
        id: 'perf-tune',
        title: 'Performance Tuning',
        description: 'Optimize images and font loading for sub-second LCP.',
        status: 'planned',
        date: 'Day 31-33'
      },
      {
        id: 'micro-interactions',
        title: 'Micro-Interactions',
        description: 'Add haptic feedback and "glitch" effects for immersion.',
        status: 'planned',
        date: 'Day 34-36'
      },
      {
        id: 'launch',
        title: 'Public Launch v1.0',
        description: 'Official release to Reddit and Discord communities.',
        status: 'planned',
        date: 'Day 40'
      }
    ]
  }
];
