import { Signal, Review, NewsItem } from '@/lib/types/news';

export const MOCK_SIGNALS: Signal[] = [
  {
    id: 's1',
    content: 'Currently testing the Ayaneo Pocket S. Heat dissipation is... interesting.',
    type: 'thought',
    created_at: '2024-05-20T10:00:00Z',
    is_active: true,
  },
  {
    id: 's2',
    content: 'Database migration complete. All systems operational.',
    type: 'status',
    created_at: '2024-05-18T14:30:00Z',
    is_active: true,
  },
  {
    id: 's3',
    content: 'Delays expected for the new Retroid shipment. Check your tracking.',
    type: 'alert',
    created_at: '2024-05-15T09:15:00Z',
    is_active: true,
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    console_id: 'c1',
    console_slug: 'retroid-pocket-4-pro',
    console_name: 'Retroid Pocket 4 Pro',
    title: 'The King of Price to Performance',
    summary: 'At $199, nothing else comes close to the raw power of the Dimensity 1100. It handles PS2 and GameCube with ease, though the screen could be brighter.',
    score: 9.2,
    published_at: '2024-01-15T00:00:00Z',
    author: 'Jules',
    image_url: '/rp4pro.png', // Placeholder, will need real assets eventually
    pros: ['Incredible performance for price', 'Excellent analog triggers', 'Compact form factor'],
    cons: ['Screen brightness is average', 'Gets warm under load']
  },
  {
    id: 'r2',
    console_id: 'c2',
    console_slug: 'anbernic-rg556',
    console_name: 'Anbernic RG556',
    title: 'OLED Glory with Ergonomic Bliss',
    summary: 'The screen is the star here. A 5.5" 1080p OLED panel that makes everything pop. The ergonomics are fantastic, but the sticks have aggressive snapping.',
    score: 8.5,
    published_at: '2024-02-20T00:00:00Z',
    author: 'Jules',
    image_url: '/rg556.png',
    pros: ['Stunning OLED display', 'Best-in-class ergonomics', 'Good battery life'],
    cons: ['Stick snapping issues', 'D-pad is a bit mushy']
  },
  {
    id: 'r3',
    console_id: 'c3',
    console_slug: 'steam-deck-oled',
    console_name: 'Steam Deck OLED',
    title: 'The PC Handheld Endgame',
    summary: 'Valve refined perfection. Better screen, better battery, lighter weight. If you can handle the size, it is the best handheld on the market.',
    score: 9.8,
    published_at: '2023-11-28T00:00:00Z',
    author: 'Jules',
    image_url: '/steamdeck.png',
    pros: ['HDR OLED is game-changing', 'Trackpads are essential', 'SteamOS is seamless'],
    cons: ['Still very large', 'Battery life varies wildly by game']
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Ayaneo Announces Pocket S Release Date',
    slug: 'ayaneo-pocket-s-release',
    excerpt: 'The Snapdragon G3x Gen 2 powerhouse is finally coming. Pre-orders start next week with shipping expected in June.',
    published_at: '2024-05-22T00:00:00Z',
    image_url: '/news/ayaneo-s.jpg',
    category: 'announcement',
    author: 'Editorial'
  },
  {
    id: 'n2',
    title: 'Miyoo Mini Flip: Real or Render?',
    slug: 'miyoo-mini-flip-rumors',
    excerpt: 'Leaked images suggest a clamshell design from Miyoo is imminent. Is it the SP clone we have been waiting for?',
    published_at: '2024-05-10T00:00:00Z',
    image_url: '/news/miyoo-flip.jpg',
    category: 'rumor',
    author: 'Editorial'
  },
  {
    id: 'n3',
    title: 'RetroArch Update 1.18 Released',
    slug: 'retroarch-1-18-update',
    excerpt: 'New cores, better netplay, and accessibility features highlight the latest update to the emulation frontend.',
    published_at: '2024-05-05T00:00:00Z',
    image_url: '/news/retroarch.jpg',
    category: 'guide',
    author: 'Editorial'
  }
];
