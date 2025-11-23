import React, { useState } from 'react';
import { fetchInitialReviews, moderateContent } from '../services/geminiService';
import { Review } from '../types';
import Button from './Button';

const ReviewSection: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTopic, setActiveTopic] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    
    // New review form state
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setActiveTopic(searchTerm);
        const data = await fetchInitialReviews(searchTerm);
        setReviews(data);
        setLoading(false);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const isSafe = await moderateContent(reviewText);

        if (isSafe) {
            const newReview: Review = {
                id: Date.now().toString(),
                author: "Player 1",
                rating: rating,
                text: reviewText,
                date: "Just Now",
                verified: true
            };
            setReviews(prev => [newReview, ...prev]);
            setReviewText('');
        } else {
            setError("SYSTEM ALERT: Review contains corrupted or prohibited data sectors.");
        }
        setSubmitting(false);
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-pixel text-center text-yellow-400 mb-8">
                USER REVIEWS
            </h2>

            {!activeTopic ? (
                <div className="max-w-md mx-auto bg-retro-grid/20 border-2 border-retro-grid p-8 text-center">
                    <p className="font-mono text-retro-neon mb-4">SELECT CARTRIDGE TO REVIEW</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-retro-dark border border-retro-blue p-2 font-mono text-white focus:outline-none"
                            placeholder="Game or Console Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button onClick={handleSearch} disabled={!searchTerm} isLoading={loading}>LOAD</Button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6 bg-retro-grid/10 p-4 border border-retro-grid">
                        <div>
                            <h3 className="text-2xl font-pixel text-white">{activeTopic.toUpperCase()}</h3>
                            <button onClick={() => setActiveTopic(null)} className="text-xs text-retro-pink underline font-mono hover:text-white">
                                Change Selection
                            </button>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-pixel text-yellow-400">
                                {getAverageRating()} / 5
                            </div>
                            <div className="text-xs font-mono text-gray-400">{reviews.length} VOTES REGISTERED</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Write Review */}
                        <div className="order-2 md:order-1">
                            <h4 className="font-pixel text-sm text-retro-neon mb-4">WRITE A REVIEW</h4>
                            <form onSubmit={handleSubmitReview} className="bg-retro-dark border border-retro-grid p-4">
                                {error && (
                                    <div className="mb-4 p-2 bg-retro-pink/20 border border-retro-pink text-retro-pink text-xs font-mono">
                                        {error}
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="block font-mono text-xs text-gray-400 mb-2">RATING</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-700'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block font-mono text-xs text-gray-400 mb-2">REVIEW</label>
                                    <textarea 
                                        className="w-full h-32 bg-black border border-retro-grid p-2 font-mono text-white text-sm focus:border-retro-neon outline-none"
                                        placeholder="Share your thoughts..."
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" isLoading={submitting} className="w-full">
                                    SUBMIT TO MAINFRAME
                                </Button>
                            </form>
                        </div>

                        {/* Read Reviews */}
                        <div className="order-1 md:order-2 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="bg-retro-grid/10 border border-retro-grid p-4 hover:border-retro-blue transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-pixel text-xs text-retro-blue">{rev.author}</span>
                                        <span className="text-yellow-400 tracking-widest text-xs">
                                            {'★'.repeat(rev.rating)}
                                            <span className="text-gray-700">{'★'.repeat(5 - rev.rating)}</span>
                                        </span>
                                    </div>
                                    <p className="font-mono text-sm text-gray-300 mb-2 leading-snug">
                                        "{rev.text}"
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] font-mono text-gray-500">{rev.date}</span>
                                        {rev.verified && (
                                            <span className="text-[10px] font-mono text-retro-neon border border-retro-neon px-1">
                                                VERIFIED
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
