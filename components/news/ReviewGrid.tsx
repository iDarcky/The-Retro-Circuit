import React from 'react';
import { Review } from '@/lib/types/news';
import { ReviewCard } from './ReviewCard';

interface ReviewGridProps {
  reviews: Review[];
}

export const ReviewGrid: React.FC<ReviewGridProps> = ({ reviews }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};
