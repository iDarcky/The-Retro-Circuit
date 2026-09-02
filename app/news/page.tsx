import Link from 'next/link';
import { siteConfig } from '../../config/site';
import { Metadata } from 'next';
import { SectionHeader } from '@/components/news/SectionHeader';
import { SignalFeed } from '@/components/news/SignalFeed';
import { ReviewGrid } from '@/components/news/ReviewGrid';
import { NewsFeed } from '@/components/news/NewsFeed';
import { fetchActiveSignals } from '../actions/signals';
import { fetchPublicReviews } from '../actions/reviews';
import { fetchPublicNews } from '../actions/news';

export const revalidate = false;

export const metadata: Metadata = {
   title: 'Transmission Feed | The Retro Circuit',
   description: 'Latest hardware signals, reviews, and news from the retro handheld sector. Direct updates from the control center.',
   openGraph: {
      title: 'Transmission Feed | The Retro Circuit',
      description: 'Latest hardware signals, reviews, and news from the retro handheld sector.',
      type: 'website',
   }
};

export default async function NewsPage() {
   const [activeSignals, reviews, newsItems] = await Promise.all([
      fetchActiveSignals(),
      fetchPublicReviews(),
      fetchPublicNews()
   ]);

   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Transmission Feed - News & Signals',
      description: 'Latest hardware signals, reviews, and news from the retro handheld sector.',
      url: `${siteConfig.url}/news`,
      about: {
         '@type': 'ItemList',
         itemListElement: [
            ...newsItems.map((news: any, index: number) => ({
               '@type': 'ListItem',
               position: index + 1,
               url: `${siteConfig.url}/news/${news.id}`
            })),
            ...reviews.map((review: any, index: number) => ({
               '@type': 'ListItem',
               position: newsItems.length + index + 1,
               url: `${siteConfig.url}/news/reviews/${review.id}`
            }))
         ]
      }
   };

   return (
      <div className="w-full bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-violet-500/30 selection:text-white pb-24 relative overflow-hidden">
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
         />

         {/* Background Effects */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

         {/* HERO HEADER */}
         <header className="px-6 md:px-12 pt-12 md:pt-24 pb-8 md:pb-16 border-b border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto w-full">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-900/30 bg-violet-950/10 text-[9px] md:text-xs font-mono uppercase tracking-widest text-violet-400 mb-8 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)]">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                  Transmission Feed // v1.0
               </div>

               <h1 className="text-4xl md:text-6xl font-pixel text-white leading-none tracking-tighter mb-4">
                  NEWS & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">SIGNALS</span><span className="text-violet-500 animate-pulse">_</span>
               </h1>

               <p className="text-xl text-gray-400 font-light max-w-2xl">
                  Latest reviews, hardware updates, and direct transmissions from the control center.
               </p>
            </div>
         </header>

         {/* MAIN CONTENT */}
         <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24 relative z-10">

            {/* SECTION 1: SIGNALS */}
            <section>
               <SectionHeader number="01" title="SIGNALS" subtitle="STATUS_FEED" color="emerald" />
               <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                  <div className="text-sm text-gray-400 font-light leading-relaxed">
                     <p className="mb-4">
                        Direct, unfiltered updates from the editor. Quick thoughts on hardware being tested, site updates, and industry whispers.
                     </p>
                     <div className="font-mono text-xs text-emerald-500/70 border-l-2 border-emerald-900/50 pl-4 py-1">
                        {'// FREQUENCY: HIGH'}<br />
                        {'// SOURCE: ADMIN_TERMINAL'}
                     </div>
                  </div>
                  <SignalFeed signals={activeSignals} />
               </div>
            </section>

            {/* SECTION 2: REVIEWS */}
            <section>
               <SectionHeader number="02" title="REVIEWS" subtitle="HARDWARE_ANALYSIS" color="cyan" />
               {reviews.length > 0 ? (
                  <ReviewGrid reviews={reviews} />
               ) : (
                  <div className="text-center py-12 border border-white/10 bg-white/5 rounded-lg">
                     <p className="font-mono text-sm text-gray-500">NO_DATA_AVAILABLE</p>
                  </div>
               )}

               <div className="mt-8 text-center">
                  <Link href="/reviews" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-500 uppercase tracking-widest hover:text-cyan-400 hover:underline underline-offset-4 decoration-cyan-500/30 transition-all">
                     View All Reviews <span>→</span>
                  </Link>
               </div>
            </section>

            {/* SECTION 3: NEWS */}
            <section>
               <SectionHeader number="03" title="NEWS" subtitle="SECTOR_UPDATES" color="violet" />
               <div className="w-full max-w-4xl">

                  {/* News Feed - Full Width */}
                  <div>
                     {newsItems.length > 0 ? (
                        <NewsFeed news={newsItems} />
                     ) : (
                        <div className="text-center py-12 border border-white/10 bg-white/5 rounded-lg">
                           <p className="font-mono text-sm text-gray-500">NO_DATA_AVAILABLE</p>
                        </div>
                     )}
                     <div className="mt-8">
                        <Link href="/news/archive" className="inline-flex items-center gap-2 text-xs font-mono text-violet-500 uppercase tracking-widest hover:text-violet-400 hover:underline underline-offset-4 decoration-violet-500/30 transition-all">
                           Access Archive <span>→</span>
                        </Link>
                     </div>
                  </div>

               </div>
            </section>

         </div>
      </div>
   );
}
