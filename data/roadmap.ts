export type RoadmapStatus = 'completed' | 'in-progress' | 'planned';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  category: string; // e.g., "Search & Discovery"
  date?: string;
}

export const completedItems: RoadmapItem[] = [
  {
    id: 'security-audit',
    title: 'Security Hardening',
    description: 'Core platform security updates and policy verification.',
    status: 'completed',
    category: 'Technical Foundation',
    date: 'Dec 2023'
  },
  {
    id: 'mobile-ux',
    title: 'Mobile Usability Upgrade',
    description: 'Increased text size and touch targets for better mobile accessibility.',
    status: 'completed',
    category: 'UX & Design',
    date: 'Jan 2024'
  }
];

export const upcomingItems: RoadmapItem[] = [
  // 1. Search & Discovery
  {
    id: 'game-search',
    title: 'Game-Based Search Engine',
    description: 'Find consoles by the games they play (e.g., "God of War", "Pokemon Emerald") and systems ("PS2", "GameCube").',
    status: 'in-progress',
    category: 'Search & Discovery'
  },
  {
    id: 'advanced-filters',
    title: 'Advanced Filtering System',
    description: 'Filter by Price, Manufacturer, CPU Generation, RAM, and OS.',
    status: 'planned',
    category: 'Search & Discovery'
  },
  {
    id: 'smart-sorting',
    title: 'Smart Sorting Options',
    description: 'Sort results by Performance Score, Release Date, and Price.',
    status: 'planned',
    category: 'Search & Discovery'
  },

  // 2. Core Comparison Engine
  {
    id: 'multi-compare',
    title: 'Multi-Device Comparison',
    description: 'Compare 3-4 devices side-by-side in the Arena.',
    status: 'in-progress',
    category: 'Core Platform'
  },
  {
    id: 'shareable-urls',
    title: 'Shareable "Versus" Links',
    description: 'Generate instant links for specific device comparisons to share on social media.',
    status: 'planned',
    category: 'Core Platform'
  },
  {
    id: 'visual-size',
    title: 'Visual Size Comparison',
    description: 'See device sizes relative to common objects like credit cards or phones.',
    status: 'planned',
    category: 'Core Platform'
  },

  // 3. Monetization & Growth
  {
    id: 'price-tracking',
    title: 'Price History & Tracking',
    description: 'Track price trends over time and see "Best Time to Buy" indicators.',
    status: 'planned',
    category: 'Features'
  },
  {
    id: 'stock-alerts',
    title: 'Restock & Price Alerts',
    description: 'Get notified when a device comes back in stock or drops in price.',
    status: 'planned',
    category: 'Features'
  },

  // 4. Content & SEO
  {
    id: 'seo-guides',
    title: 'Curated Buying Guides',
    description: 'In-depth "Best Of" lists for specific budgets and emulation targets.',
    status: 'planned',
    category: 'Content'
  },
  {
    id: 'dynamic-social',
    title: 'Dynamic Social Cards',
    description: 'Rich preview images when sharing comparisons on Discord and Twitter.',
    status: 'planned',
    category: 'Content'
  },

  // 5. Community & Engagement
  {
    id: 'user-reviews',
    title: 'Community Reviews',
    description: 'User-submitted star ratings and performance reports.',
    status: 'planned',
    category: 'Community'
  },
  {
    id: 'playability-voting',
    title: 'Playability Voting',
    description: 'Community voting on game performance (Playable vs. Struggles).',
    status: 'planned',
    category: 'Community'
  },
  {
    id: 'battlestations',
    title: 'Battlestation Gallery',
    description: 'Showcase your handheld setup and mods.',
    status: 'planned',
    category: 'Community'
  },

  // 6. UI/UX & Design
  {
    id: 'dark-mode-polish',
    title: 'Dark Mode Refinements',
    description: 'Ensuring a perfect, flash-free dark mode experience across all devices.',
    status: 'in-progress',
    category: 'UX & Design'
  },
  {
    id: 'real-battery',
    title: 'Real-World Battery Estimates',
    description: 'Battery life estimates based on TDP and capacity, not just manufacturer claims.',
    status: 'planned',
    category: 'UX & Design'
  },

  // 7. Technical & Infrastructure (Sanitized)
  {
    id: 'pwa-support',
    title: 'Installable App (PWA)',
    description: 'Install The Retro Circuit to your home screen for instant access.',
    status: 'planned',
    category: 'Platform'
  },
  {
    id: 'performance-tuning',
    title: 'Global Performance Tuning',
    description: 'Optimizing image loading and server response times for instant navigation.',
    status: 'in-progress',
    category: 'Platform'
  },
  {
    id: 'command-palette',
    title: 'Command Palette',
    description: 'Power-user navigation menu (Cmd+K) to jump anywhere instantly.',
    status: 'planned',
    category: 'Platform'
  }
];
