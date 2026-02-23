'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Review } from '@/lib/types/news';
import { createReview, deleteReview } from '@/app/actions/reviews';

interface ReviewManagerProps {
  reviews: Review[];
  consoles: { id: string; name: string; slug: string }[];
}

export const ReviewManager: React.FC<ReviewManagerProps> = ({ reviews, consoles }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    console_id: '',
    title: '',
    summary: '',
    score: 0,
    image_url: '',
    pros: '',
    cons: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedConsole = consoles.find(c => c.id === formData.console_id);
    if (!selectedConsole) {
        alert('Please select a console');
        setIsLoading(false);
        return;
    }

    try {
      await createReview({
        console_id: formData.console_id,
        console_name: selectedConsole.name,
        console_slug: selectedConsole.slug,
        title: formData.title,
        summary: formData.summary,
        score: Number(formData.score),
        image_url: formData.image_url,
        pros: formData.pros.split(',').map(p => p.trim()),
        cons: formData.cons.split(',').map(c => c.trim()),
      });

      setFormData({
        console_id: '',
        title: '',
        summary: '',
        score: 0,
        image_url: '',
        pros: '',
        cons: ''
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to create review:', error);
      alert('Failed to publish review.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(id);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">

      {/* Create Form */}
      <div className="bg-black/80 border border-white/10 p-6">
        <h2 className="text-xl font-pixel text-cyan-500 mb-6 flex items-center gap-2">
           <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
           PUBLISH ANALYSIS
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                   <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Target Hardware</label>
                   <select
                     name="console_id"
                     value={formData.console_id}
                     onChange={handleChange}
                     className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-white focus:border-cyan-500 focus:outline-none"
                     required
                   >
                     <option value="">SELECT_CONSOLE</option>
                     {consoles.map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
               </div>

               <div>
                   <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Score (0-10)</label>
                   <input
                     type="number"
                     name="score"
                     min="0"
                     max="10"
                     step="0.1"
                     value={formData.score}
                     onChange={handleChange}
                     className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-white focus:border-cyan-500 focus:outline-none"
                     required
                   />
               </div>
           </div>

           <div>
             <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Review Title</label>
             <input
               type="text"
               name="title"
               value={formData.title}
               onChange={handleChange}
               className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-white placeholder:text-gray-700 focus:border-cyan-500 focus:outline-none"
               placeholder="> ENTER_TITLE..."
               required
             />
           </div>

           <div>
             <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Summary / Verdict</label>
             <textarea
               name="summary"
               value={formData.summary}
               onChange={handleChange}
               className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-white placeholder:text-gray-700 focus:border-cyan-500 focus:outline-none h-32"
               placeholder="> ENTER_ANALYSIS..."
               required
             />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                   <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Pros (comma separated)</label>
                   <input
                     type="text"
                     name="pros"
                     value={formData.pros}
                     onChange={handleChange}
                     className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-emerald-400 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none"
                     placeholder="Great Screen, Good Battery..."
                   />
               </div>
               <div>
                   <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Cons (comma separated)</label>
                   <input
                     type="text"
                     name="cons"
                     value={formData.cons}
                     onChange={handleChange}
                     className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-rose-400 placeholder:text-rose-900/50 focus:border-rose-500 focus:outline-none"
                     placeholder="Heavy, Expensive..."
                   />
               </div>
           </div>

           <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase text-xs px-8 py-3 transition-colors disabled:opacity-50"
                >
                 {isLoading ? 'PROCESSING...' : 'PUBLISH REVIEW'}
               </button>
           </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-black/40 border border-white/5 p-6">
        <h3 className="text-sm font-mono text-gray-500 uppercase mb-4">Published Reviews</h3>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start justify-between p-4 border border-white/10 bg-black/20 hover:border-cyan-500/30 transition-colors">
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-cyan-500 border border-cyan-500/30 px-2 py-0.5">
                       SCORE: {review.score}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">
                       {review.console_name}
                    </span>
                 </div>
                 <h4 className="font-bold text-white mb-1">{review.title}</h4>
                 <p className="font-mono text-xs text-gray-400 line-clamp-2">
                    {review.summary}
                 </p>
              </div>

              <button
                onClick={() => handleDelete(review.id)}
                className="ml-4 text-[10px] text-red-500 hover:text-red-400 uppercase font-bold border border-red-500/30 hover:bg-red-950/30 px-3 py-1 transition-colors"
              >
                DELETE
              </button>
            </div>
          ))}

           {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-600 font-mono text-xs">
               NO_REVIEWS_FOUND
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
