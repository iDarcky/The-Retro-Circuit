export type RoadmapStatus = 'completed' | 'in-progress' | 'planned';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  date?: string; // Optional: Keep for "Q1 2024" but remove strict "Days"
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  // timeline: string; // REMOVED
  items: RoadmapItem[];
}

export const completedItems: RoadmapItem[] = [
  {
    id: 'security-audit',
    title: 'Security Hardening',
    description: 'Fixed middleware auth bypass and verified RLS policies.',
    status: 'completed',
    date: 'Dec 2023'
  },
  {
    id: 'mobile-ux',
    title: 'Mobile Usability Upgrade',
    description: 'Increased text size and touch targets for better thumb accessibility.',
    status: 'completed',
    date: 'Jan 2024'
  }
];

export const roadmapData: RoadmapPhase[] = [
  {
    id: 'phase-1',
    title: 'PHASE 1: STABILITY & TRUST',
    subtitle: 'Fixing critical bugs, security holes, and mobile usability.',
    items: [
      {
        id: 'search-fix',
        title: 'Search Engine Core Fixes',
        description: 'Implement "No Results" state and keyboard navigation.',
        status: 'in-progress'
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'PHASE 2: REVENUE & CORE FEATURES',
    subtitle: 'Monetization, "Game-Based Search", and comparing devices.',
    items: [
      {
        id: 'game-search',
        title: 'Game-Based Search Engine',
        description: 'Allow users to search for "God of War" or "PS2" to find capable devices.',
        status: 'planned'
      },
      {
        id: 'monetization',
        title: 'Affiliate Integration',
        description: 'Add Amazon/AliExpress price checking and buy buttons.',
        status: 'planned'
      },
      {
        id: 'vs-mode',
        title: '3-Way Comparison Mode',
        description: 'Expand the Arena to support 3+ devices side-by-side.',
        status: 'planned'
      },
      {
        id: 'seo-boost',
        title: 'SEO Overhaul',
        description: 'Dynamic metadata and JSON-LD structured data for Google Rich Snippets.',
        status: 'planned'
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'PHASE 3: ENGAGEMENT & CONTENT',
    subtitle: 'Keeping users on the site longer with reviews and news.',
    items: [
      {
        id: 'user-reviews',
        title: 'User Ratings System',
        description: 'Community star ratings for Ergonomics, Screen, and Battery.',
        status: 'planned'
      },
      {
        id: 'news-engine',
        title: 'News & Content Engine',
        description: 'Launch the /news section and homepage "Latest Intel" widget.',
        status: 'planned'
      },
      {
        id: 'social-cards',
        title: 'Dynamic Social Cards',
        description: 'Generate custom OG images for shared comparisons.',
        status: 'planned'
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'PHASE 4: POLISH & LAUNCH',
    subtitle: 'Performance tuning, analytics, and the "Wow" factor.',
    items: [
      {
        id: 'perf-tune',
        title: 'Performance Tuning',
        description: 'Optimize images and font loading for sub-second LCP.',
        status: 'planned'
      },
      {
        id: 'micro-interactions',
        title: 'Micro-Interactions',
        description: 'Add haptic feedback and "glitch" effects for immersion.',
        status: 'planned'
      },
      {
        id: 'launch',
        title: 'Public Launch v1.0',
        description: 'Official release to Reddit and Discord communities.',
        status: 'planned'
      }
    ]
  }
];
