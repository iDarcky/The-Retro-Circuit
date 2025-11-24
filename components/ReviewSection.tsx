import React, { useState, useEffect } from 'react';
import { fetchInitialReviews, moderateContent, submitReviewToDB } from '../services/geminiService';
import { validateReview, sanitizeInput } from '../utils/security';
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

    // Initial load of all reviews (or top 10)
    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            const data = await fetchInitialReviews('');
            setReviews(data);
            setLoading(false);
        };
        loadInitial();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setActiveTopic(searchTerm || 'ALL REVIEWS');
        
        // Fetch server reviews
        const serverData = await fetchInitialReviews(searchTerm);
        
        setReviews(serverData);
        setLoading(false);
    };

    const checkRateLimit = (): boolean => {
        const lastPost = localStorage.getItem('retro_last_review_ts');
        if (lastPost) {
            const diff = Date.now() - parseInt(lastPost, 10);
            if (diff < 60000) { // 60 seconds cooldown
                const remaining = Math.ceil((60000 - diff) / 1000);
                setError(`SYSTEM OVERHEAT: Cooling down. Wait ${remaining}s before next transmission.`);
                return false;
            }
        }
        return true;
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 0. Rate Limiting Check (Client Side)
        if (!checkRateLimit()) return;

        setSubmitting(true);

        // 1. Client-side Validation
        const validation = validateReview(reviewText);
        if (!validation.isValid) {
            setError(validation.error || "Invalid input");
            setSubmitting(false);
            return;
        }

        // 2. Sanitation
        const cleanText = sanitizeInput(reviewText);

        // 3. Mock Moderate
        const isSafe = await moderateContent(cleanText);

        if (isSafe) {
            const newReview: Review = {
                id: '', // DB will assign UUID, but for local state we can temp assign
                author: "Player 1",
                rating: rating,
                text: cleanText,
                date: new Date().toLocaleDateString(),
                verified: true
            };

            // 4. Send to Supabase
            const success = await submitReviewToDB(newReview);
            
            if (success) {
                // Refresh list
                const updatedList = await fetchInitialReviews('');
                setReviews(updatedList);
                
                localStorage.setItem('retro_last_review_ts', Date.now().toString());
                setReviewText('');
            } else {
                 setError("NETWORK ERROR: Could not upload to mainframe.");
            }
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
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-pixel text-retro-neon mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                    REVIEW ARCHIVE
                </h2>
                <p className="font-mono text-gray-400">Search the database or log your own entry.</p>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-12" role="search">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Reviews..."
                    aria-label="Search for game reviews"
                    className="flex-1 bg-retro-dark border-2 border-retro-grid text-retro-neon p-4 font-mono focus:border-retro-neon focus:outline-none"
                />
                <Button onClick={handleSearch} isLoading={loading}>
                    SEARCH
                </Button>
            </div>

            {/* Results */}
            <div className="mb-12" aria-live="polite">
                    <div className="flex justify-between items-end border-b border-retro-grid pb-2 mb-6">
                    <h3 className="text-xl font-pixel text-white">{activeTopic ? activeTopic.toUpperCase() : 'RECENT UPLOADS'}</h3>
                    <span className="font-mono text-retro-blue text-sm">AVG RATING: {getAverageRating()}/5</span>
                    </div>

                    <div className="grid gap-6">
                    {reviews.length === 0 ? (
                            <div className="text-center font-mono text-gray-500 py-8">NO DATA FOUND ON THIS TAPE.</div>
                    ) : (
                        reviews.map((review, idx) => (
                            <div key={review.id || idx} className="bg-retro-grid/10 border border-retro-grid p-6 relative">
                                <div className="flex justify-between mb-4">
                                    <span className={`font-pixel text-xs ${review.author === 'Player 1' ? 'text-retro-neon' : 'text-retro-pink'}`}>
                                        {review.author} {review.author === 'Player 1' ? '(YOU)' : ''}
                                    </span>
                                    <div className="text-yellow-400 tracking-widest" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                                        {'★'.repeat(review.rating)}<span className="text-gray-600">{'★'.repeat(5-review.rating)}</span>
                                    </div>
                                </div>
                                <p className="font-mono text-gray-300 text-sm leading-relaxed">{review.text}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-gray-500">{review.date}</span>
                                    {review.verified && <span className="text-[10px] font-pixel text-retro-neon border border-retro-neon px-1" title="Verified Purchase">VERIFIED</span>}
                                </div>
                            </div>
                        ))
                    )}
                    </div>
            </div>

            {/* Submission Form */}
            <div className="border-t-4 border-retro-grid pt-10 mt-10">
                <h3 className="text-xl font-pixel text-retro-blue mb-6">SUBMIT ENTRY</h3>
                
                {error && (
                    <div role="alert" className="p-4 border border-retro-pink text-retro-pink font-mono mb-6 bg-retro-pink/10 animate-pulse">
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleSubmitReview} className="bg-retro-dark border border-retro-grid p-6">
                    <div className="mb-6">
                        <label id="rating-label" className="block font-mono text-xs text-gray-500 mb-2">RATING SEQUENCE</label>
                        <div className="flex gap-2" role="group" aria-labelledby="rating-label">
                            {[1,2,3,4,5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    aria-label={`Rate ${star} stars`}
                                    aria-pressed={rating === star}
                                    className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-700'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="review-text" className="block font-mono text-xs text-gray-500 mb-2">DATA ENTRY</label>
                        <textarea
                            id="review-text"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            aria-invalid={!!error}
                            className="w-full bg-black/30 border border-retro-grid text-white p-4 font-mono focus:border-retro-blue focus:outline-none"
                            placeholder="Type your analysis here..."
                        />
                        <div className="text-right text-[10px] text-gray-600 mt-1">
                            {reviewText.length}/500 CHARS
                        </div>
                    </div>

                    <Button type="submit" isLoading={submitting} variant="secondary" className="w-full">
                        UPLOAD TO MAINFRAME
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ReviewSection;