import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Review } from '@/lib/types/news';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Link href={`/reviews/${review.id}`} className="block group">
      <div className="relative border border-white/10 bg-black/40 overflow-hidden h-full flex flex-col hover:border-cyan-500/50 hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.2)] transition-all duration-300">

        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden border-b border-white/10">
           {/* Fallback for now since images are mocks */}
           <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-gray-700 font-pixel text-xs">
              NO SIGNAL
           </div>
           {/* Real Image would go here */}
           {/* <Image src={review.image_url} alt={review.console_name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" /> */}

           {/* Score Badge */}
           <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-cyan-500/50 px-3 py-1 flex items-center gap-2 shadow-lg">
              <span className="font-pixel text-cyan-400 text-lg">{review.score}</span>
              <span className="text-[10px] text-gray-500 font-mono">/ 10</span>
           </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500/80 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        {review.console_name}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono ml-auto">
                        {new Date(review.published_at).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="font-bold text-xl text-white group-hover:text-cyan-400 transition-colors leading-tight mb-2 font-sans tracking-tight">
                    {review.title}
                </h3>
            </div>

            <p className="text-sm text-gray-400 font-light leading-relaxed mb-6 line-clamp-3">
                {review.summary}
            </p>

            <div className="mt-auto flex items-center gap-2 text-xs font-mono text-cyan-500 uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                Read Analysis <span>→</span>
            </div>
        </div>
      </div>
    </Link>
  );
};
